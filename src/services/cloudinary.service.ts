import { BadRequestException } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';

export class CloudinaryService {
  private V2 = v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  async imageUpload(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    if (!file) throw new BadRequestException('File is required');
    return new Promise((resolve, reject) => {
      v2.uploader
        .upload_stream(
          {
            resource_type: 'image',
            folder,
          },
          (error, result) => {
            if (error) {
              reject(error);
              console.log(error);
            }
            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }

  async fileUpload(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    if (!file) throw new BadRequestException('File is required');
    return new Promise((resolve, reject) => {
      v2.uploader
        .upload_stream(
          {
            resource_type: 'auto',
            folder,
          },
          (error, result) => {
            if (error) {
              reject(error);
              console.log(error);
            }
            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }

  async videoUpload(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    if (!file) throw new BadRequestException('File is required');
    return new Promise((resolve, reject) => {
      v2.uploader
        .upload_stream(
          {
            resource_type: 'video',
            folder,
          },
          (error, result) => {
            if (error) {
              reject(error);
              console.log(error);
            }
            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }

  async imageDelete(imageUrl: string) {
    const publicId = this.extractPublicIdFromUrl(imageUrl);
    return new Promise((resolve, reject) => {
      v2.uploader.destroy(
        publicId,
        {
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            reject(error);
          }
          return resolve(result);
        },
      );
    });
  }

  async videoDelete(imageUrl: string) {
    const publicId = this.extractPublicIdFromUrl(imageUrl);
    return new Promise((resolve, reject) => {
      v2.uploader.destroy(
        publicId,
        {
          resource_type: 'video',
        },
        (error, result) => {
          if (error) {
            reject(error);
          }
          return resolve(result);
        },
      );
    });
  }

  extractPublicIdFromUrl(url: string) {
    //regular expression to extract the public id from the url
    const regex =
      /\/v\d+\/(.+)\.(?:jpg|jpeg|jpe|gif|png|bmp|svg|webp|mp4|webm|mov|ogv|flv|m3u8|ts)/;

    //extract the public using regular expression
    const matches = url.match(regex);

    if (matches && matches.length > 1) {
      return matches[1];
    } else {
      throw new Error('Invalid Cloudinary url');
    }
  }
}
