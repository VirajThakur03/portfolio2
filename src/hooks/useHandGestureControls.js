import { useEffect, useRef, useState } from "react";

const HANDS_SCRIPT = "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js";
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const lerp = (a, b, t) => a + (b - a) * t;

let mediaPipeLoadPromise = null;

const loadMediaPipeHands = async () => {
  if (window.Hands) return;
  if (!mediaPipeLoadPromise) {
    mediaPipeLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = HANDS_SCRIPT;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load MediaPipe Hands script."));
      document.head.appendChild(script);
    });
  }
  await mediaPipeLoadPromise;
};

const angleDelta = (a, b) => {
  let d = a - b;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
};

const dist2 = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

export const useHandGestureControls = ({
  enabled = true,
  dominantHand = "auto"
} = {}) => {
  const dominantHandRef = useRef(dominantHand.toLowerCase());
  const controlsRef = useRef({
    yawVelocity: 0,
    pitchVelocity: 0,
    zoomVelocity: 0,
    handPresent: false,
    gestureLabel: "none",
    confidence: 0
  });
  const landmarksRef = useRef([]);
  const streamRef = useRef(null);
  const handsRef = useRef(null);
  const prevRef = useRef(null);
  const fpsRef = useRef(0);
  const uiTickRef = useRef(0);

  const [status, setStatus] = useState({
    ready: false,
    tracking: false,
    streamReady: false,
    fps: 0,
    fpsMode: "normal",
    gestureLabel: "none",
    confidence: 0,
    rotationLocked: false,
    zoomLocked: false,
    calibrationRunning: false,
    calibrationProgress: 100,
    calibrationReady: true,
    dominantHandApplied: "auto",
    error: ""
  });

  useEffect(() => {
    dominantHandRef.current = dominantHand.toLowerCase();
  }, [dominantHand]);

  const startCalibration = () => {
    // Keep compatibility with UI; old/simple mode does not require calibration.
    setStatus((s) => ({
      ...s,
      calibrationRunning: false,
      calibrationProgress: 100,
      calibrationReady: true
    }));
  };

  useEffect(() => {
    if (!enabled) {
      controlsRef.current = {
        yawVelocity: 0,
        pitchVelocity: 0,
        zoomVelocity: 0,
        handPresent: false,
        gestureLabel: "disabled",
        confidence: 0
      };
      landmarksRef.current = [];
      prevRef.current = null;
      setStatus((s) => ({
        ...s,
        tracking: false,
        streamReady: false,
        gestureLabel: "disabled",
        confidence: 0
      }));
      return undefined;
    }

    let active = true;
    let video = null;
    let stream = null;
    let rafId = null;
    let busy = false;
    let lastSendTs = 0;
    let frameCounter = 0;
    let fpsStartTs = performance.now();

    const cleanup = async () => {
      active = false;
      if (rafId) cancelAnimationFrame(rafId);
      if (stream) stream.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      if (video) video.srcObject = null;
      if (handsRef.current?.close) {
        try {
          await handsRef.current.close();
        } catch {
          // ignore close errors
        }
      }
      handsRef.current = null;
    };

    const onResults = (results) => {
      if (!active) return;
      const now = performance.now();

      frameCounter += 1;
      if (now - fpsStartTs >= 1000) {
        const fps = Math.round((frameCounter * 1000) / (now - fpsStartTs));
        fpsRef.current = fps;
        frameCounter = 0;
        fpsStartTs = now;
        setStatus((s) => ({ ...s, fps, fpsMode: "normal" }));
      }

      const landmarks = results?.multiHandLandmarks?.[0];
      const handedness = (results?.multiHandedness?.[0]?.label || "").toLowerCase();
      const wanted = dominantHandRef.current;

      if (landmarks && wanted !== "auto" && handedness && handedness !== wanted) {
        landmarksRef.current = [];
        controlsRef.current.yawVelocity = lerp(controlsRef.current.yawVelocity, 0, 0.25);
        controlsRef.current.pitchVelocity = lerp(controlsRef.current.pitchVelocity, 0, 0.25);
        controlsRef.current.zoomVelocity = lerp(controlsRef.current.zoomVelocity, 0, 0.25);
        controlsRef.current.handPresent = false;
        controlsRef.current.gestureLabel = "wrong-hand";
        controlsRef.current.confidence = 0;
        prevRef.current = null;
        if (now - uiTickRef.current > 120) {
          uiTickRef.current = now;
          setStatus((s) => ({
            ...s,
            tracking: false,
            gestureLabel: "wrong-hand",
            confidence: 0,
            dominantHandApplied: wanted
          }));
        }
        return;
      }

      if (!landmarks) {
        landmarksRef.current = [];
        controlsRef.current.yawVelocity = lerp(controlsRef.current.yawVelocity, 0, 0.25);
        controlsRef.current.pitchVelocity = lerp(controlsRef.current.pitchVelocity, 0, 0.25);
        controlsRef.current.zoomVelocity = lerp(controlsRef.current.zoomVelocity, 0, 0.25);
        controlsRef.current.handPresent = false;
        controlsRef.current.gestureLabel = "idle";
        controlsRef.current.confidence = 0;
        prevRef.current = null;
        if (now - uiTickRef.current > 120) {
          uiTickRef.current = now;
          setStatus((s) => ({
            ...s,
            tracking: false,
            gestureLabel: "idle",
            confidence: 0
          }));
        }
        return;
      }

      landmarksRef.current = landmarks.map((l) => ({ x: l.x, y: l.y, z: l.z }));

      const wrist = landmarks[0];
      const thumbTip = landmarks[4];
      const indexTip = landmarks[8];
      const middleMcp = landmarks[9];

      const handSize = Math.max(0.08, dist2(wrist, middleMcp));
      const pinchDistance = dist2(indexTip, thumbTip);
      const pinchNorm = pinchDistance / handSize;
      const palmAngle = Math.atan2(middleMcp.y - wrist.y, middleMcp.x - wrist.x);

      if (!prevRef.current) {
        prevRef.current = {
          ts: now,
          wristX: wrist.x,
          wristY: wrist.y,
          palmAngle,
          pinchNorm
        };
        return;
      }

      const dt = clamp((now - prevRef.current.ts) / 1000, 1 / 120, 1 / 10);
      const dx = wrist.x - prevRef.current.wristX;
      const dy = wrist.y - prevRef.current.wristY;
      const dPalmAngle = angleDelta(palmAngle, prevRef.current.palmAngle);
      const dPinch = pinchNorm - prevRef.current.pinchNorm;

      // Direct mapping like the old behavior: less gating, more immediate response.
      let yawRaw = ((dx * 3.2) + (dPalmAngle * 1.7)) / dt;
      let pitchRaw = ((-dy * 3.4) - (dPalmAngle * 0.4)) / dt;
      let zoomRaw = (dPinch * 14.5) / dt;

      yawRaw = clamp(yawRaw, -3, 3);
      pitchRaw = clamp(pitchRaw, -2.6, 2.6);
      zoomRaw = clamp(zoomRaw, -6, 6);

      const smooth = 0.18;
      controlsRef.current.yawVelocity = lerp(controlsRef.current.yawVelocity, yawRaw, smooth);
      controlsRef.current.pitchVelocity = lerp(controlsRef.current.pitchVelocity, pitchRaw, smooth);
      controlsRef.current.zoomVelocity = lerp(controlsRef.current.zoomVelocity, zoomRaw, smooth);
      controlsRef.current.handPresent = true;

      const ay = Math.abs(controlsRef.current.yawVelocity);
      const ap = Math.abs(controlsRef.current.pitchVelocity);
      const az = Math.abs(controlsRef.current.zoomVelocity);

      let label = "stable";
      if (az > 0.45) {
        label = controlsRef.current.zoomVelocity > 0 ? "pinch-out-zoom-in" : "pinch-in-zoom-out";
      } else if (ay >= ap) {
        label = controlsRef.current.yawVelocity >= 0 ? "1-horizontal-cw" : "2-horizontal-ccw";
      } else {
        label = controlsRef.current.pitchVelocity >= 0 ? "3-vertical-up" : "4-vertical-down";
      }
      controlsRef.current.gestureLabel = label;

      const conf = clamp((ay + ap + az) / 6.2, 0, 1);
      controlsRef.current.confidence = conf;

      prevRef.current = {
        ts: now,
        wristX: wrist.x,
        wristY: wrist.y,
        palmAngle,
        pinchNorm
      };

      if (now - uiTickRef.current > 110) {
        uiTickRef.current = now;
        setStatus((s) => ({
          ...s,
          tracking: true,
          gestureLabel: label,
          confidence: conf,
          dominantHandApplied: wanted === "auto" ? handedness || "auto" : wanted
        }));
      }
    };

    const init = async () => {
      try {
        setStatus((s) => ({ ...s, error: "" }));
        await loadMediaPipeHands();

        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 320 },
            height: { ideal: 240 },
            facingMode: "user"
          },
          audio: false
        });
        streamRef.current = stream;

        video = document.createElement("video");
        video.playsInline = true;
        video.muted = true;
        video.srcObject = stream;
        await video.play();

        handsRef.current = new window.Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });
        handsRef.current.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.55,
          selfieMode: true
        });
        handsRef.current.onResults(onResults);

        setStatus((s) => ({
          ...s,
          ready: true,
          streamReady: true,
          calibrationReady: true
        }));

        const loop = async (ts) => {
          if (!active) return;
          if (!busy && video.readyState >= 2 && ts - lastSendTs >= 33) {
            busy = true;
            lastSendTs = ts;
            try {
              await handsRef.current.send({ image: video });
            } catch {
              // Ignore frame-level errors.
            }
            busy = false;
          }
          rafId = requestAnimationFrame(loop);
        };
        rafId = requestAnimationFrame(loop);
      } catch (error) {
        const msg = error?.message || "Hand tracking setup failed.";
        setStatus((s) => ({
          ...s,
          error: msg,
          ready: false,
          tracking: false,
          streamReady: false
        }));
      }
    };

    init();
    return () => {
      cleanup();
    };
  }, [enabled]);

  return {
    controlsRef,
    landmarksRef,
    streamRef,
    status,
    startCalibration
  };
};

export default useHandGestureControls;
