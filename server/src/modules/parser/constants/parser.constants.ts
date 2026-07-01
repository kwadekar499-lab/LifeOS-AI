export const PARSER_CONSTANTS = {
  CHUNK: {
    TARGET_SIZE_MIN: 800,
    TARGET_SIZE_MAX: 1000,
    OVERLAP_SIZE_MIN: 150,
    OVERLAP_SIZE_MAX: 200,
  },
  SUPPORTED_MIME_TYPES: {
    PDF: 'application/pdf',
    DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    MARKDOWN: 'text/markdown',
    TEXT: 'text/plain',
  },
  SUPPORTED_EXTENSIONS: {
    PDF: ['.pdf'],
    DOCX: ['.docx'],
    MARKDOWN: ['.md', '.markdown'],
    TEXT: ['.txt'],
  },
  LANGUAGE_DETECTION: {
    ENABLED: true,
    DEFAULT: 'en',
  },
} as const;
