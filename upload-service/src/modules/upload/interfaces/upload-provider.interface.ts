export type UploadProviderType = 'GoogleDrive';

export interface UploadProvider {
  uploadFile(file: Express.Multer.File): Promise<string>;
}
