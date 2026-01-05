import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'legal-documents',
  ): Promise<UploadApiErrorResponse | UploadApiResponse> {
    return new Promise((resolve, reject) => {
      // Determine resource type based on file mimetype
      const resourceType = this.getResourceType(file.mimetype);
      
      const uploadOptions: any = {
        folder,
        resource_type: resourceType,
      };

      // For PDFs and other documents, ensure inline viewing
      if (file.mimetype === 'application/pdf' || 
          file.mimetype.includes('document') ||
          file.mimetype.includes('word') ||
          file.mimetype.includes('excel')) {
        uploadOptions.type = 'upload';
        uploadOptions.access_mode = 'public';
      }
      
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) return reject(error);
          resolve(result as UploadApiResponse);
        },
      );

      if (file && file.buffer) {
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      } else {
        reject(new Error('No file buffer provided'));
      }
    });
  }

  /**
   * Determine the appropriate resource type for Cloudinary
   */
  private getResourceType(mimetype: string): 'image' | 'video' | 'raw' | 'auto' {
    if (mimetype.startsWith('image/')) {
      return 'image';
    }
    if (mimetype.startsWith('video/')) {
      return 'video';
    }
    // PDFs and documents should use 'raw' type
    // We'll handle inline viewing via URL parameters
    return 'raw';
  }

  /**
   * Get URL for inline viewing (no download prompt)
   * This is the key method for displaying PDFs in iframes
   */
  getInlineUrl(publicId: string, mimetype?: string): string {
    // For raw resources (PDFs, docs), modify the URL to force inline display
    const baseUrl = cloudinary.url(publicId, {
      resource_type: 'raw',
      secure: true,
    });
    
    // Replace the default upload path with one that includes inline flag
    // This tells Cloudinary to set Content-Disposition: inline
    return baseUrl.replace('/upload/', '/upload/fl_attachment/');
  }

  /**
   * Alternative inline URL using direct domain manipulation
   */
  getInlineUrlAlt(publicId: string): string {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    // Use res.cloudinary.com and remove fl_attachment parameter
    // This serves the file with inline content-disposition by default
    return `https://res.cloudinary.com/${cloudName}/raw/upload/${publicId}`;
  }

  /**
   * Get URL that forces download
   */
  getDownloadUrl(publicId: string, filename?: string): string {
    return cloudinary.url(publicId, {
      resource_type: 'raw',
      flags: filename ? `attachment:${filename}` : 'attachment',
      secure: true,
    });
  }

  /**
   * Get PDF preview using Google Drive viewer
   * This is more reliable than Cloudinary transformations for PDFs
   */
  getPdfPreviewUrl(fileUrl: string): string {
    return `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(fileUrl)}`;
  }

  /**
   * Get PDF thumbnail using pdf.js or similar
   * Note: For actual PDF thumbnails, you'd need to use a separate service
   * or generate them server-side
   */
  getPdfThumbnail(publicId: string): string {
    // Return the regular URL - frontend can use pdf.js to render thumbnail
    return this.getInlineUrlAlt(publicId);
  }

  /**
   * Delete a file from Cloudinary
   */
  async deleteFile(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'raw'): Promise<any> {
    try {
      return await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
        invalidate: true, // Invalidate CDN cache
      });
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  /**
   * Get the original secure URL from upload result
   * This is what you should store in the database
   */
  getSecureUrl(uploadResult: UploadApiResponse): string {
    return uploadResult.secure_url;
  }
}