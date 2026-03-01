const overlapRatio = (a = [], b = []) => {
  const setA = new Set(a.map((item) => JSON.stringify(item)));
  const setB = new Set(b.map((item) => JSON.stringify(item)));
  if (!setA.size || !setB.size) return 0;
  const common = [...setA].filter((x) => setB.has(x)).length;
  return common / Math.max(setA.size, setB.size);
};

export const compatibilityScore = (base, candidate) => {
  const subjectScore = overlapRatio(base.subjects, candidate.subjects);
  const availabilityScore = overlapRatio(base.availability, candidate.availability);
  const goalScore = overlapRatio(base.goals, candidate.goals);
  const styleScore = base.studyStyle === candidate.studyStyle ? 1 : 0.4;
  return Number((subjectScore * 0.35 + availabilityScore * 0.3 + styleScore * 0.2 + goalScore * 0.15).toFixed(3));
};
