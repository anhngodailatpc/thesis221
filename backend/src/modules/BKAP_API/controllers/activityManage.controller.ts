import { ActivityCampaignService } from './../services/activityCampaign.service';
import { User } from 'src/models/Achievement/user.entity';
import { DepartmentService } from './../../api/services/department.service';
import { UsersService } from './../../api/services/users.service';
import { RolesGuard } from './../../api/guard/roles.guard';
import { Role } from './../../../common/enum';
import { Roles } from './../../../common/roles.decorator';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  HttpException,
  HttpStatus,
  Query,
  Put,
  UseGuards,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/modules/api/guard/jwt-authentication.guard';
import { ActivityManageService } from '../services/activityManage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import {
  editActivityFileName,
  imageFileFilter,
} from 'src/utils/fileUploadHandler';

interface RequestWithUser extends Request {
  user: User;
}

@ApiTags('Hoạt động')
@Controller('activity')
@UseGuards(JwtAuthenticationGuard)
export class ActivityController {
  constructor(
    private activityService: ActivityManageService,
    private userService: UsersService,
    private departmentService: DepartmentService,
    private activityCampaignService: ActivityCampaignService,
  ) {}

  @Get()
  async get(
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Req() request: RequestWithUser,
  ) {
    try {
      const newPage = page <= 0 ? 1 : page;
      const countDepartment = await this.departmentService.getAll();
      const data = await this.activityService.get(page, limit, search);
      if (request.user.role === Role.DEPARTMENT) {
        const findData = data.filter(
          (item) => item?.creator?.id === request.user.id,
        );
        return {
          data: findData.slice((newPage - 1) * limit, page * limit),
          count: findData.length,
          maximumDepartment: countDepartment.length,
        };
      }
      return {
        data: data.slice((newPage - 1) * limit, page * limit),
        count: data.length,
        maximumDepartment: countDepartment.length,
      };
    } catch (e: any) {
      return [];
    }
  }

  @Post('/add')
  @HttpCode(201)
  @ApiResponse({
    status: 200,
    description: 'Thêm hoạt động thành công',
  })
  async add(@Body() data: any, @Req() request: RequestWithUser) {
    try {
      if (!request.user.isUpdatedInformation)
        throw new HttpException(
          'Vui lòng cập nhật thông tin cá nhân trước khi thêm hoạt động',
          HttpStatus.BAD_REQUEST,
        );
      const campaign = await this.activityCampaignService.getCampaignById(
        data.campaign,
      );
      return await this.activityService.add(campaign, data, request.user);
    } catch (error: any) {
      if (error.status === 400) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Delete activity successfully',
  })
  async delete(@Param('id') id: string) {
    try {
      const data = await this.activityService.delActivity(id);
      if (!data) {
        const exception = new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'Không thể xóa hoạt động',
          },
          HttpStatus.FORBIDDEN,
        );
        return exception.getResponse();
      }
    } catch (e: any) {
      const exception = new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Lỗi server',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      return exception.getResponse();
    }
  }

  @Put(':id')
  @Roles(Role.MANAGER, Role.DEPARTMENT)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @HttpCode(201)
  @ApiResponse({
    status: 200,
    description: 'Cập nhật hoạt động thành công',
  })
  async update(
    @Param('id') id: string,
    @Body() data: any,
    @Req() request: RequestWithUser,
  ) {
    try {
      if (!request.user.isUpdatedInformation)
        throw new HttpException(
          'Vui lòng cập nhật thông tin cá nhân trước khi thêm hoạt động',
          HttpStatus.BAD_REQUEST,
        );
      const campaign = await this.activityCampaignService.getCampaignById(
        data.campaign,
      );
      return await this.activityService.update(
        id,
        campaign,
        data,
        request.user.id,
      );
    } catch (error: any) {
      if (error.status === 400) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  @Put('/add/status')
  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @HttpCode(201)
  @ApiResponse({
    status: 200,
    description: 'Cập nhật trạng thái hoạt động thành công',
  })
  async updateStatus(
    @Body() data: { id: string; status: string; noteStatus: string },
  ) {
    try {
      return await this.activityService.updateStatus(data);
    } catch (error: any) {
      if (error.status === 400) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  @Post('upload/:campaignId/:groupId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          //console.log(req.params);
          const path = `./public/ActivityFiles/${req.params.campaignId}/${req.params.groupId}`;
          fs.mkdirSync(path, { recursive: true });
          callback(null, path);
        },
        filename: editActivityFileName,
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
}
