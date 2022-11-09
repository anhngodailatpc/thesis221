import { User } from './../../../models/Achievement/user.entity';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../../api/services/users.service';

import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
// import { file_v1 } from 'googleapis';
import * as fs from 'fs';
import {
  editFileName,
  imageFileFilter,
} from '../../../utils/fileUploadHandler';
import JwtAuthenticationGuard from '../../api/guard/jwt-authentication.guard';
import { CompetitionSubmissionService } from '../services/submission.service';
import { CompetitionSubmissionDto } from 'src/Dto/Competition/submission.dto';
interface RequestWithUser extends Request {
  user: User;
}

@ApiTags('Bài nộp cho thi đua')
@UseGuards(JwtAuthenticationGuard)
@Controller('competition/submission')
export class CompetitionSubmissionController {
  constructor(
    private submissionService: CompetitionSubmissionService,
    private userService: UsersService,
  ) {}

  @Get('all/:departmentId')
  @ApiResponse({
    status: 200,
    description: 'Return a list of submission',
  })
  async getSubmission(@Param('departmentId') departmentId: string) {
    try {
      return await this.submissionService.getSubmission(parseInt(departmentId));
    } catch (error) {
      console.error(error.message);
    }
  }

  @Get('/participant-get/:departmentId/:userId')
  @ApiResponse({
    status: 200,
    description: 'Return a list of submission',
  })
  async getList(
    @Param('departmentId') departmentId: string,
    @Param('userId') userId: string,
  ) {
    return await this.submissionService.getAll(
      parseInt(departmentId),
      parseInt(userId),
    );
  }

  @Post('/:departmentId/:userId')
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Successfully adding a submission',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request for submission',
  })
  async addSubmission(
    @Body() submissionDto: CompetitionSubmissionDto[],
    // @Param('departmentId') departmentId: string,
    // @Param('userId') userId: string,
  ) {
    try {
      return await this.submissionService.add(submissionDto);
    } catch (error: any) {
      console.log(error.message);
      throw new HttpException(error.code, HttpStatus.BAD_REQUEST);
    }
  }
  @Post('upload/:userId/:competitionId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          //console.log(req.params);
          const path = `./public/usersubmits/BK_Competition/${req.params.userId}/${req.params.competitionId}`;
          fs.mkdirSync(path, { recursive: true });
          callback(null, path);
        },
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
      limits: { fieldSize: 1 * 1024 * 1024 },
    }),
  )
  async uploadFile(@UploadedFile() file) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    //console.log(file);
    return response;
  }

  @Post('uploadfiles/:userId/:competitionId')
  @UseInterceptors(
    FilesInterceptor('file', 50, {
      storage: diskStorage({
        destination: (req, file, callback) => {
          //console.log(req.params);
          const path = `./public/usersubmits/BK_Competition/${req.params.userId}/${req.params.competitionId}`;
          fs.mkdirSync(path, { recursive: true });
          callback(null, path);
        },
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
      limits: { fieldSize: 1 * 1024 * 1024 },
    }),
  )
  async uploadFiles(@UploadedFiles() file) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    //console.log(file);
    return response;
  }

  @Get('download/:userId/:competitionId/:fileName')
  async serveFile(
    @Param('userId') userId,
    @Param('competitionId') competitionId,
    @Param('fileName') fileName,
    @Res() res,
  ): Promise<any> {
    res.sendFile(fileName, {
      root: `./public/usersubmits/BK_Competition/${userId}/${competitionId}/`,
    });
  }
}
