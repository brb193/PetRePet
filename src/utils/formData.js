function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function positiveId(value) {
  if (typeof value !== 'string' && typeof value !== 'number') return Number.NaN;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : Number.NaN;
}

module.exports = { text, positiveId };
