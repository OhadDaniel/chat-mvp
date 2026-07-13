export type UploadedDocumentFile = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

export type TextChunk = {
  chunkIndex: number;
  text: string;
};
