import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import { CloudService } from '../services/cloud/cloud.service';

@Injectable()
export class UploadInterceptor implements NestInterceptor {
  constructor(private cloudService: CloudService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const file = request.file;

    if (file) {
      var folderId = Math.ceil(Math.random() * 99999999 + 100000000).toString();
      const { public_id, secure_url } = await this.cloudService.uploadFile({
        path: file.path,
        folder: `e-commerce/${folderId}/image`,
      });
      request.body.image = { public_id, secure_url, folderId: folderId };
    }

    return next.handle().pipe(
      catchError((err) => {
        this.cloudService.deleteFolder(`e-commerce/${folderId}`);
        return throwError(() => err);
      }),
    );
  }
}

@Injectable()
export class UploadMultiFileInterceptor implements NestInterceptor {
  constructor(private cloudService: CloudService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const files = request.files;
    if (files) {
      var folderId = Math.ceil(Math.random() * 99999999 + 100000000).toString();
      request.body.images = { data: [] };

      for (const file of files) {
        const { public_id, secure_url } = await this.cloudService.uploadFile({
          path: file.path,
          folder: `e-commerce/${folderId}/images`,
        });

        request.body.images.data.push({ public_id, secure_url });
      }

      request.body.images.folderId = folderId;
    }

    return next.handle().pipe(
      catchError((err) => {
        this.cloudService.deleteFolder(`e-commerce/${folderId}`);
        return throwError(() => err);
      }),
    );
  }
}
