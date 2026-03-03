import { makeAutoObservable } from 'mobx';
import type { FileType, FilePreview } from '../types';

class FileStore {
  currentFile: FilePreview | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setFile(content: string, name: string, mimeType: string): void {
    const type = this.detectFileType(name, mimeType);
    this.currentFile = { content, name, type };
  }

  clearFile(): void {
    this.currentFile = null;
  }

  private detectFileType(fileName: string, mimeType: string): FileType {
    const ext = fileName.split('.').pop()?.toLowerCase();
    
    if (ext === 'md' || ext === 'markdown' || mimeType === 'text/markdown') {
      return 'markdown';
    }
    if (ext === 'json' || mimeType === 'application/json') {
      return 'json';
    }
    if (ext === 'xml' || mimeType === 'text/xml' || mimeType === 'application/xml') {
      return 'xml';
    }
    return 'unknown';
  }

  get fileType(): FileType {
    return this.currentFile?.type || 'unknown';
  }
}

export const fileStore = new FileStore();
