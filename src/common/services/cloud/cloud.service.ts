import { Injectable } from '@nestjs/common';
import cloudinary from '../../config/cloud.config';

interface UploadFileOptions {
  path: string;
  folder?: string;
  public_id?: string;
}

@Injectable()
export class CloudService {
  async uploadFile({ path, folder, public_id }: UploadFileOptions) {
    return await cloudinary.uploader.upload(path, { folder, public_id });
  }

  async uploadFiles(files: Express.Multer.File[], folder: string) {
    const uploadedFiles: object[] = [];
    for (const file of files) {
      const { public_id, secure_url } = await this.uploadFile({
        path: file.path,
        folder,
      });
      uploadedFiles.push({ public_id, secure_url });
    }
    return uploadedFiles;
  }

  async destroyFile(public_id: string) {
    return await cloudinary.uploader.destroy(public_id);
  }

  private async deleteFolderResources(path: string) {
    return await cloudinary.api.delete_resources_by_prefix(path);
  }

  async deleteFolder(folder: string) {
    await this.deleteFolderResources(folder);
    return await cloudinary.api.delete_folder(folder);
  }
}
