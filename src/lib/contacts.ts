/** A plausible number is not evidence that it is a current working contact. */
export function contactText(raw: string | null): string {
  if (raw === null || /^(?:NONE|N\/A|0|Not provided.*)$/i.test(raw.trim()))
    return 'Not provided in the source';
  return raw;
}

export function telephoneHref(
  raw: string,
  verifiedCurrent = false
): string | null {
  const digits = raw.replace(/[\s()-]/g, '');
  if (
    !verifiedCurrent ||
    !/^(?:09\d{9}|0[2-8]\d{8,9}|\+63\d{10})$/.test(digits)
  )
    return null;
  return `tel:${digits}`;
}
