interface ImportMeta {
  readonly env: Record<string, string | undefined>;
}

// to make typedoc generator work with direct asset imports
declare module '*.png';
declare module '*.svg';
