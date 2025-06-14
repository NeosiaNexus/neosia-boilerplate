export interface Templates {
  'magic-link': { url: string };
  'reset-password': { url: string };
}

export type TemplateName = keyof Templates;
