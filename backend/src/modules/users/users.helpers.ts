export function initialsOf(firstName: string, lastName: string): string {
  return [firstName, lastName]
    .filter(Boolean)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export function displayName(firstName: string, lastName: string): string {
  return [firstName, lastName].filter(Boolean).join(' ');
}

export function splitName(name: string): {
  firstName: string;
  lastName: string;
} {
  const tokens = name.trim().split(/\s+/).filter(Boolean);
  const [firstName = '', ...rest] = tokens;
  return { firstName, lastName: rest.join(' ') };
}
