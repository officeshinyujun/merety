import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// 파일 저장 경로 설정
const UPLOAD_DIR = './uploads/profiles';

// 디렉토리가 없으면 생성 (동기적으로 실행 - 서버 시작 시 또는 요청 시 체크)
// 실제 프로덕션에서는 서버 시작 시점에 체크 처리하는 것이 좋음
if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

@Controller('api/upload')
@UseGuards(JwtAuthGuard)
export class UploadController {

  @Post('profile')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          if (!existsSync(UPLOAD_DIR)) {
            mkdirSync(UPLOAD_DIR, { recursive: true });
          }
          cb(null, UPLOAD_DIR);
        },
        filename: (req, file, cb) => {
          // 파일명: UUID_원본파일명
          const randomName = uuidv4();
          const extension = extname(file.originalname);
          cb(null, `${randomName}${extension}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        // 이미지 파일만 허용
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new BadRequestException('이미지 파일만 업로드 가능합니다.'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB 제한
      },
    }),
  )
  uploadProfile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('파일이 제공되지 않았습니다.');
    }

    // 클라이언트가 접근할 수 있는 URL 반환 (ServeStaticModule 설정 필요)
    // 예: /uploads/profiles/filename.jpg
    const fileUrl = `/uploads/profiles/${file.filename}`;

    return {
      url: fileUrl,
    };
  }

  @Post('markdown-image')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/markdown';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const randomName = uuidv4();
          const extension = extname(file.originalname);
          cb(null, `${randomName}${extension}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        // 이미지 및 PDF 파일 허용
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|pdf)$/)) {
          return cb(new BadRequestException('이미지 또는 PDF 파일만 업로드 가능합니다.'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB 제한
      },
    }),
  )
  uploadMarkdownImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('파일이 제공되지 않았습니다.');
    }

    const fileUrl = `/uploads/markdown/${file.filename}`;

    return {
      url: fileUrl,
    };
  }
}
