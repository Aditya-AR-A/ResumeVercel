export interface Certificate {
  name: string;
  file: string;
  thumbnail?: string;
  provider: string;
  field: string;
  skills: string[];
  issueDate: string | null;
  credentialId: string | null;
  description?: string;
  featured?: boolean;
}

export interface GroupedCertificates {
  [provider: string]: Certificate[];
}

// Certificate data validation
export function isValidCertificate(cert: unknown): cert is Certificate {
  if (typeof cert !== 'object' || cert === null) return false;
  const c = cert as Record<string, unknown>;
  return Boolean(
    typeof c.name === 'string' &&
    typeof c.file === 'string' &&
    typeof c.provider === 'string' &&
    typeof c.field === 'string' &&
    Array.isArray(c.skills) &&
    (c.issueDate === null || typeof c.issueDate === 'string') &&
    (c.credentialId === null || typeof c.credentialId === 'string') &&
    (c.description === undefined || typeof c.description === 'string') &&
    (c.featured === undefined || typeof c.featured === 'boolean')
  );
}

