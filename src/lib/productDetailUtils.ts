export function formatBenefitLabel(value: string) {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return 'Included';
  if (normalized.includes('template')) return 'Template-ready';
  if (normalized.includes('formula')) return 'Formula-driven';
  if (normalized.includes('dashboard')) return 'Dashboard-ready';
  if (normalized.includes('automation')) return 'Automation-ready';
  if (normalized.includes('chart')) return 'Visual-ready';
  if (normalized.includes('guide')) return 'Guide-supported';
  return normalized.replace(/(^\w|\s+\w)/g, (letter) => letter.toUpperCase());
}
