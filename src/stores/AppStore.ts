import { makeAutoObservable } from 'mobx';

export type FormatType = 'markdown' | 'json' | 'xml';
export type ModeType = 'edit' | 'preview';

class AppStore {
  content = '';
  format: FormatType = 'markdown';
  mode: ModeType = 'edit';

  constructor() {
    makeAutoObservable(this);
  }

  setContent(newContent: string): void {
    this.content = newContent;
  }

  setFormat(newFormat: FormatType): void {
    this.format = newFormat;
  }

  setMode(newMode: ModeType): void {
    this.mode = newMode;
  }

  clear(): void {
    this.content = '';
    this.mode = 'edit';
  }

  get hasContent(): boolean {
    return this.content.length > 0;
  }
}

export const appStore = new AppStore();
