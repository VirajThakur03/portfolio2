export const connections = [
  ["about-viraj", "python"], ["about-viraj", "backend"], ["about-viraj", "ai-systems"],
  ["python", "django"], ["python", "flask"], ["python", "ml"], ["ml", "nlp"],
  ["backend", "apis"], ["backend", "db"], ["backend", "auth"],
  ["ai-systems", "ml"], ["ai-systems", "nlp"],
  ["flask", "lielens"], ["nlp", "lielens"], ["ml", "lielens"],
  ["flask", "resume-analyzer"], ["nlp", "resume-analyzer"],
  ["django", "music-player"], ["django", "skillo"], ["apis", "skillo"],
  ["ml", "speech-emotion"], ["python", "speech-emotion"],
  ["contact", "hackerrank"], ["contact", "codewars"], ["contact", "leetcode"],
  ["resume", "contact"], ["hackerrank", "leetcode"], ["codewars", "leetcode"]
].map(([source, target]) => ({ source, target }));
