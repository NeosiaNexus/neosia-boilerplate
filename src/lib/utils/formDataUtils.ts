export type DateMode = 'utc' | 'local';

// -------- utils internes --------
const _getRaw = (fd: FormData, name: string): string => fd.get(name)?.toString().trim() ?? '';

/** Blob/File "like" compatible Node & navigateur */
export type FormDataFile = Blob & { name?: string; lastModified?: number };

export const isFileLike = (v: unknown): v is FormDataFile =>
  !!v &&
  typeof v === 'object' &&
  typeof (v as unknown as { arrayBuffer: () => Promise<ArrayBuffer> }).arrayBuffer === 'function' &&
  typeof (v as unknown as { size: number }).size === 'number' &&
  typeof (v as unknown as { type: string }).type === 'string';

// -------- string --------
export const getStr = (fd: FormData, name: string): string => _getRaw(fd, name);

export const getOptStr = (fd: FormData, name: string): string | undefined => {
  const v = _getRaw(fd, name);
  return v.length ? v : undefined;
};

// -------- number --------
export const getNumber = (fd: FormData, name: string): number => {
  const v = _getRaw(fd, name);
  const n = Number(v.replace(',', '.'));
  return Number.isFinite(n) ? n : NaN;
};

export const getOptNumber = (fd: FormData, name: string): number | undefined => {
  const n = getNumber(fd, name);
  return Number.isFinite(n) ? n : undefined;
};

export const getInt = (fd: FormData, name: string): number => {
  const v = _getRaw(fd, name);
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : NaN;
};

export const getOptInt = (fd: FormData, name: string): number | undefined => {
  const n = getInt(fd, name);
  return Number.isFinite(n) ? n : undefined;
};

// -------- date --------
const parseDate = (raw: string, mode: DateMode): Date => {
  if (!raw) return new Date(NaN);
  if (raw.includes('T')) {
    const d = new Date(raw);
    return isNaN(d.getTime()) ? new Date(NaN) : d;
  }
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  if (!m) return new Date(NaN);
  const [, yStr, moStr, dStr] = m;
  const y = Number(yStr),
    mo = Number(moStr),
    d = Number(dStr);
  return mode === 'utc' ? new Date(Date.UTC(y, mo - 1, d)) : new Date(y, mo - 1, d);
};

export const getDate = (fd: FormData, name: string, opts: { mode?: DateMode } = {}): Date => {
  const v = _getRaw(fd, name);
  return parseDate(v, opts.mode ?? 'utc');
};

export const getOptDate = (
  fd: FormData,
  name: string,
  opts: { mode?: DateMode } = {},
): Date | undefined => {
  const d = getDate(fd, name, opts);
  return isNaN(d.getTime()) ? undefined : d;
};

// -------- file helpers --------
export type FileAccept = string | string[]; // ".png", "image/*", "application/pdf", ...
export interface FileConstraints {
  accept?: FileAccept;
  maxSize?: number; // bytes
  minSize?: number; // bytes
}

export const normalizeAccept = (accept?: FileAccept): string[] =>
  !accept
    ? []
    : Array.isArray(accept)
      ? accept
      : accept
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);

/** Vérifie type/extension sans référencer File au runtime Node */
export const isTypeAllowed = (file: FormDataFile, acceptList: string[]): boolean => {
  if (acceptList.length === 0) return true;
  const name = (file.name ?? '').toLowerCase();
  const mime = (file.type || '').toLowerCase();

  return acceptList.some(rule => {
    const r = rule.toLowerCase();
    if (r.startsWith('.')) {
      // Règle extension -> nécessite un name
      return !!name && name.endsWith(r);
    }
    if (r.endsWith('/*')) {
      return mime.startsWith(r.slice(0, r.indexOf('/')) + '/');
    }
    return mime === r;
  });
};

/** Récupère tous les "File-like" pour ce champ (ignore les strings) */
const _getAllFiles = (fd: FormData, name: string): FormDataFile[] => {
  const all = fd.getAll(name);
  const out: FormDataFile[] = [];
  for (const v of all) {
    if (typeof v === 'string') continue;

    // Safe guard: ne touche 'File' que si présent globalement
    if (typeof File !== 'undefined' && v instanceof File) {
      out.push(v as unknown as FormDataFile);
      continue;
    }
    if (isFileLike(v)) {
      out.push(v as FormDataFile);
    }
  }
  return out;
};

export const filterFilesByConstraints = (
  files: FormDataFile[],
  c: FileConstraints = {},
): FormDataFile[] => {
  const list = normalizeAccept(c.accept);
  return files.filter(f => {
    if (c.minSize !== undefined && f.size < c.minSize) return false;
    if (c.maxSize !== undefined && f.size > c.maxSize) return false;
    if (list.length && !isTypeAllowed(f, list)) return false;
    return true;
  });
};

export const getFile = (
  fd: FormData,
  name: string,
  constraints?: FileConstraints,
): FormDataFile | null => {
  const files = _getAllFiles(fd, name);
  const filtered = constraints ? filterFilesByConstraints(files, constraints) : files;
  return filtered[0] ?? null;
};

export const getOptFile = (
  fd: FormData,
  name: string,
  constraints?: FileConstraints,
): FormDataFile | undefined => {
  const f = getFile(fd, name, constraints);
  return f ?? undefined;
};

export const getFiles = (
  fd: FormData,
  name: string,
  constraints?: FileConstraints,
): FormDataFile[] => {
  const files = _getAllFiles(fd, name);
  return constraints ? filterFilesByConstraints(files, constraints) : files;
};

export const getOptFiles = (
  fd: FormData,
  name: string,
  constraints?: FileConstraints,
): FormDataFile[] | undefined => {
  const arr = getFiles(fd, name, constraints);
  return arr.length ? arr : undefined;
};

// -------- export groupé --------
export const formDataUtils = {
  // string
  getStr,
  getOptStr,
  // number
  getNumber,
  getOptNumber,
  getInt,
  getOptInt,
  // date
  getDate,
  getOptDate,
  // file
  normalizeAccept,
  isTypeAllowed,
  getFile,
  getOptFile,
  getFiles,
  getOptFiles,
  filterFilesByConstraints,
};

export default formDataUtils;
