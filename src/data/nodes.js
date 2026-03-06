export const nodes = [
  {
    id: "about-viraj",
    name: "Viraj Thakur",
    category: "About",
    description: "Software Engineer focused on AI systems and backend product architecture.",
    problem_solved: "Turns fuzzy product ideas into production-ready systems with measurable outcomes.",
    impact_metrics: ["AI + backend portfolio shipped", "Rapid prototype-to-production workflow", "Strong full-cycle engineering ownership"],
    technologies: ["Python", "Django", "Flask", "NLP"],
    github_link: "https://github.com/VirajThakur03",
    demo_link: "",
    architecture: "Product understanding -> System design -> Fast iteration -> Deployment -> Feedback loop",
    code_snippet: "def build_solution(problem):\n    design = propose_architecture(problem)\n    return iterate_with_metrics(design)"
  },
  {
    id: "resume",
    name: "Resume",
    category: "Resume",
    description: "Career highlights, AI/backend depth, and downloadable resume.",
    problem_solved: "Gives recruiters a compact technical summary with direct proof-of-work links.",
    impact_metrics: ["Backend + AI focus", "Production projects", "Recruiter-friendly quick scan"],
    technologies: ["AI", "Backend", "APIs"],
    github_link: "",
    demo_link: "/resume.pdf",
    architecture: "Career highlights -> Projects -> Technical skills -> Contact channels",
    code_snippet: "Resume available as PDF for direct download."
  },
  {
    id: "contact",
    name: "Contact",
    category: "Contact",
    description: "Direct technical collaboration channels for interviews and project opportunities.",
    problem_solved: "Removes friction between portfolio interest and actionable outreach.",
    impact_metrics: ["Fast async communication", "Project context ready", "Open for engineering roles"],
    technologies: ["GitHub", "LinkedIn", "Email"],
    github_link: "https://github.com/VirajThakur03",
    demo_link: "mailto:virajthakur.dev@gmail.com",
    linkedin_link: "https://www.linkedin.com/in/viraj-thakur03/",
    architecture: "GitHub -> LinkedIn -> Email -> Interview scheduling",
    code_snippet: "Preferred contact: virajthakur.dev@gmail.com"
  },

  { id: "python", name: "Python", category: "Skills", description: "Primary language for AI and backend engineering.", technologies: ["Flask", "Django", "Automation"], github_link: "", demo_link: "", architecture: "Core runtime for services", code_snippet: "result = service.run(payload)" },
  { id: "django", name: "Django", category: "Skills", description: "Structured backend and web architecture.", technologies: ["ORM", "Auth", "Templates"], github_link: "", demo_link: "", architecture: "App -> Models -> Views -> URLs", code_snippet: "urlpatterns = [path('api/', include(router.urls))]" },
  { id: "flask", name: "Flask", category: "Skills", description: "Lightweight backend for AI apps.", technologies: ["Blueprints", "REST", "Jinja"], github_link: "", demo_link: "", architecture: "Routes -> Service layer -> Models", code_snippet: "@app.post('/analyze')" },
  { id: "ml", name: "Machine Learning", category: "Skills", description: "Model development and inference workflows.", technologies: ["scikit-learn", "TensorFlow", "Pipelines"], github_link: "", demo_link: "", architecture: "Data -> Train -> Validate -> Deploy", code_snippet: "model.fit(X_train, y_train)" },
  { id: "nlp", name: "NLP", category: "Skills", description: "Text understanding and risk analysis systems.", technologies: ["Transformers", "Tokenization", "Classification"], github_link: "", demo_link: "", architecture: "Preprocess -> Embed -> Classify", code_snippet: "tokens = tokenizer(text)" },
  { id: "apis", name: "APIs", category: "Skills", description: "Scalable REST API design and integration.", technologies: ["REST", "Versioning", "Rate limits"], github_link: "", demo_link: "", architecture: "Gateway -> Service -> Database", code_snippet: "GET /v1/projects" },
  { id: "backend", name: "Backend Engineering", category: "Skills", description: "Reliable and maintainable service architecture.", technologies: ["Queues", "Caching", "Observability"], github_link: "", demo_link: "", architecture: "Services + Jobs + Monitoring", code_snippet: "queue.enqueue(process_job)" },
  { id: "db", name: "Databases", category: "Skills", description: "Schema design and query optimization.", technologies: ["PostgreSQL", "SQLite", "Indexing"], github_link: "", demo_link: "", architecture: "Schema -> Indexes -> Queries", code_snippet: "CREATE INDEX idx_email ON users(email);" },
  { id: "auth", name: "Authentication", category: "Skills", description: "Identity, access control, and security.", technologies: ["JWT", "Sessions", "RBAC"], github_link: "", demo_link: "", architecture: "Auth service -> Tokens -> Permissions", code_snippet: "if !user.can('admin') throw Forbidden" },
  { id: "ai-systems", name: "AI Systems", category: "Skills", description: "Applied AI systems for product outcomes.", technologies: ["Evaluation", "Inference", "Prompting"], github_link: "", demo_link: "", architecture: "Input -> Model routing -> Validation", code_snippet: "output = orchestrator.run(input)" },

  {
    id: "lielens",
    name: "LieLens",
    category: "Projects",
    description: "AI Truth & Risk Analyzer for text that scores deception and communication risk.",
    problem_solved: "Helps teams identify risky, manipulative, or high-uncertainty text before decision making.",
    impact_metrics: ["5-level risk score output", "Sub-2s analysis response target", "3 proof assets published"],
    technologies: ["Python", "Django", "NLP", "ML"],
    github_link: "https://github.com/VirajThakur03/lielens-ai-saas",
    demo_link: "/proofs/lielens.html",
    proof_links: [
      { label: "Project Proof", url: "/proofs/lielens.html" },
      { label: "Architecture Snapshot", url: "/proofs/screenshots/lielens-architecture.svg" },
      { label: "Scoring Output Snapshot", url: "/proofs/screenshots/lielens-output.svg" }
    ],
    architecture: "Frontend input -> Django API -> NLP feature extraction -> Classifier -> Risk explanation response",
    code_snippet:
      "def analyze_text(payload):\n    features = extract_linguistic_features(payload['text'])\n    score = deception_model.predict_proba([features])[0][1]\n    return JsonResponse({'risk_score': round(score, 4)})"
  },
  {
    id: "resume-analyzer",
    name: "AI Resume Analyzer",
    category: "Projects",
    description: "ATS-focused resume analyzer with automated feedback and gap detection.",
    problem_solved: "Gives candidates structured feedback to improve ATS compatibility and recruiter readability.",
    impact_metrics: ["Keyword gap extraction by role", "Section-wise resume scoring", "4 proof assets published"],
    technologies: ["Flask", "NLP", "ML"],
    github_link: "https://github.com/VirajThakur03/Flask-Resume-Analyzer",
    demo_link: "/proofs/resume-analyzer.html",
    proof_links: [
      { label: "Project Proof", url: "/proofs/resume-analyzer.html" },
      { label: "Home Screen Snapshot", url: "/project-media/resume-analyzer/resume-analyzer-home.png" },
      { label: "Signup Snapshot", url: "/project-media/resume-analyzer/resume-analyzer-signup.png" },
      { label: "Analysis Report Snapshot", url: "/project-media/resume-analyzer/resume-analyzer-report.png" },
      { label: "Live Demo Video", url: "/project-media/resume-analyzer/resumeanalyzerproject.mp4" }
    ],
    architecture: "Resume upload -> Text extraction -> Skill matching -> Scoring engine -> Recommendations panel",
    code_snippet:
      "required = set(job_keywords)\nfound = set(extract_skills(resume_text))\nmissing = sorted(required - found)\nreturn {'missing_keywords': missing}"
  },
  {
    id: "music-player",
    name: "Django Music Player",
    category: "Projects",
    description: "Django-based music player with playlist and media organization workflows.",
    problem_solved: "Provides a clean full-stack media experience with persistent playlist management.",
    impact_metrics: ["Playlist CRUD flow shipped", "Persistent track library support", "3 proof assets published"],
    technologies: ["Django", "HTML", "CSS", "JS"],
    github_link: "https://github.com/VirajThakur03/Musicplayer",
    demo_link: "/proofs/music-player.html",
    proof_links: [
      { label: "Project Proof", url: "/proofs/music-player.html" },
      { label: "Playlist Workflow Snapshot", url: "/proofs/screenshots/music-player-playlist.svg" },
      { label: "Routing Snapshot", url: "/proofs/screenshots/music-player-routing.svg" }
    ],
    architecture: "Django app -> Models for tracks/playlists -> View controllers -> Template rendering -> Browser playback",
    code_snippet:
      "def add_to_playlist(request, playlist_id, song_id):\n    playlist = Playlist.objects.get(id=playlist_id)\n    playlist.songs.add(song_id)\n    return redirect('playlist_detail', playlist_id=playlist.id)"
  },
  {
    id: "skillo",
    name: "Skillo",
    category: "Projects",
    description: "Learning and upskilling platform oriented around practical software growth paths.",
    problem_solved: "Transforms scattered learning into trackable skill journeys with guided recommendations.",
    impact_metrics: ["Skill graph based guidance", "Progress tracking workflow", "3 proof assets published"],
    technologies: ["Django", "Python", "APIs"],
    github_link: "https://github.com/VirajThakur03/skillo",
    demo_link: "/proofs/skillo.html",
    proof_links: [
      { label: "Project Proof", url: "/proofs/skillo.html" },
      { label: "Skill Graph Snapshot", url: "/proofs/screenshots/skillo-skill-graph.svg" },
      { label: "Progress Dashboard Snapshot", url: "/proofs/screenshots/skillo-progress.svg" }
    ],
    architecture: "User profile -> Skill graph -> Recommendation service -> Progress tracker -> Feedback loop",
    code_snippet:
      "def next_modules(user):\n    graph = load_skill_graph()\n    gaps = find_skill_gaps(user.current_skills, user.goal)\n    return recommend_modules(graph, gaps)"
  },
  {
    id: "speech-emotion",
    name: "Speech Emotion Recognition",
    category: "Projects",
    description: "Audio emotion classification pipeline using signal processing + machine learning.",
    problem_solved: "Infers human emotional tone from voice input for intelligent interaction systems.",
    impact_metrics: ["40-coefficient MFCC feature vector", "End-to-end emotion inference pipeline", "3 proof assets published"],
    technologies: ["Python", "Signal Processing", "ML"],
    github_link: "https://github.com/VirajThakur03/Speech-Emotion-Recognition-",
    demo_link: "/proofs/speech-emotion.html",
    proof_links: [
      { label: "Project Proof", url: "/proofs/speech-emotion.html" },
      { label: "Feature Pipeline Snapshot", url: "/proofs/screenshots/speech-emotion-features.svg" },
      { label: "Inference Snapshot", url: "/proofs/screenshots/speech-emotion-inference.svg" }
    ],
    architecture: "Audio ingestion -> Noise handling -> MFCC extraction -> Emotion model -> Label confidence output",
    code_snippet:
      "mfcc = librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=40)\nfeature_vector = np.mean(mfcc.T, axis=0)\nemotion = model.predict([feature_vector])[0]"
  },

  {
    id: "hackerrank",
    name: "HackerRank",
    category: "Coding Platforms",
    description: "Problem solving and domain challenge profile.",
    problem_solved: "Builds strong consistency in algorithmic and domain-based coding tasks.",
    impact_metrics: ["Profile linked", "Challenge history available", "Badges visible on platform"],
    technologies: ["Algorithms", "SQL", "Badges"],
    github_link: "https://www.hackerrank.com/virajthakur03",
    demo_link: "https://www.hackerrank.com/virajthakur03",
    architecture: "Practice plan -> Challenge solving -> Badge progression",
    code_snippet: "Profile: hackerrank.com/virajthakur03 | Add latest badge counts periodically."
  },
  {
    id: "codewars",
    name: "CodeWars",
    category: "Coding Platforms",
    description: "Kata-based practice for writing concise and optimized solutions.",
    problem_solved: "Strengthens pattern recognition and implementation speed through repetition.",
    impact_metrics: ["Profile linked", "Rank progression track", "Kata completion growth"],
    technologies: ["Katas", "Rank", "Streak"],
    github_link: "https://www.codewars.com/users/VirajThakur03",
    demo_link: "https://www.codewars.com/users/VirajThakur03",
    architecture: "Kata queue -> Attempt -> Refactor -> Rank progression",
    code_snippet: "Profile: codewars.com/users/VirajThakur03 | Sync rank + completed kata snapshots."
  },
  {
    id: "leetcode",
    name: "LeetCode",
    category: "Coding Platforms",
    description: "DSA and interview preparation through structured problem sets.",
    problem_solved: "Improves interview readiness and mastery of core algorithm patterns.",
    impact_metrics: ["Profile linked", "Difficulty-wise solved tracking", "Contest practice visibility"],
    technologies: ["DSA", "Contests", "Patterns"],
    github_link: "https://leetcode.com/u/VirajThakur003/",
    demo_link: "https://leetcode.com/u/VirajThakur003/",
    architecture: "Topic map -> Daily solve loop -> Revision -> Contest exposure",
    code_snippet: "Profile: leetcode.com/u/VirajThakur003 | Update solved totals by difficulty."
  }
];

export const categoryColors = {
  About: "#18ffff",
  Resume: "#7c4dff",
  Contact: "#00e5ff",
  Skills: "#00e5ff",
  Projects: "#7c4dff",
  "Coding Platforms": "#18ffff"
};
