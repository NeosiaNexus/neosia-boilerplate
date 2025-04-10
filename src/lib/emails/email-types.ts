export type Templates = {
  'magic-link': { url: string };
  'reset-password': { url: string };
};

export type TemplateName = keyof Templates;
