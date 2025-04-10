export type UploadProviderType = 'googleDrive' | 'customStorage';

export type UploadFileResponse = {
  path: string;
  folder: string;
  filename: string;
};

export interface UploadProvider {
  uploadFile(file: Express.Multer.File): Promise<UploadFileResponse>;
}
