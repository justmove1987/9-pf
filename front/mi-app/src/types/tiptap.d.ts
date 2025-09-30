import '@tiptap/core';
import type { ImageBlockOptions } from '../extensions/ImageBlock';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageBlock: {
      setImageBlock: (options: ImageBlockOptions) => ReturnType;
      updateImageBlock: (options: Partial<ImageBlockOptions>) => ReturnType;
    };
  }
}
