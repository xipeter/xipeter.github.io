export type FileType = 'markdown' | 'json' | 'xml' | 'unknown';

export interface FilePreview {
  name: string;
  content: string;
  type: FileType;
}
