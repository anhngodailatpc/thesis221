import { StatusRegistration } from './../../../common/enum';
import { ActivityManageService } from './../services/activityManage.service';
import { ActivityRegistrationService } from '../services/activityRegistration.service';
import JwtAuthenticationGuard from 'src/modules/api/guard/jwt-authentication.guard';
import { UsersService } from '../../api/services/users.service';
import { User } from '../../../models/Achievement/user.entity';
import { RolesGuard } from '../../api/guard/roles.guard';
import { Role } from '../../../common/enum';
import { Roles } from '../../../common/roles.decorator';
import {
  Controller,
  Get,
  Query,
  UseGuards,
  Req,
  Post,
  HttpCode,
  Body,
  HttpException,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

interface RequestWithUser extends Request {
  user: User;
}

@ApiTags('Người tham gia hoạt động')
@Controller('registration')
@UseGuards(JwtAuthenticationGuard)
export class ActivityRegistrationController {
  constructor(
    private activityRegistrationService: ActivityRegistrationService,
    private activityService: ActivityManageService,
    private userService: UsersService,
  ) {}

  @Get()
  @Roles(Role.PARTICIPANT)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  async get(
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Req() request: RequestWithUser,
  ) {
    try {
      const user = await this.userService.getById(request.user.id);
      const { data, count } = await this.activityRegistrationService.get(
        page,
        limit,
        search,
        user.department,
      );
      const result = await this.activityRegistrationService.getResult(user.id);
      const formatData = await Promise.all(
        data.map(async (item) => {
          const findItem = result.find(
            (temp) => temp?.activity?.id === item.id,
          );
          const getRegistered =
            await this.activityRegistrationService.getRegistered(item.id);
          const infoCreator = await this.userService.getById(item.creator.id);
          return {
            ...item,
            creation:
              infoCreator?.role === Role.MANAGER
                ? 'ĐTN-HSV trường'
                : infoCreator?.department?.name,
            statusRegistration: findItem ? findItem.status : '',
            numberRegisteredSuccess: getRegistered.filter(
              (item) => item.status === StatusRegistration.PASS,
            ).length,
          };
        }),
      );
      return { data: formatData, count };
    } catch (e: any) {
      return [];
    }
  }

  @Get('user-history/:id')
  @Roles(Role.PARTICIPANT)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  async getWithID(
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Req() request: RequestWithUser,
  ) {
    try {
      const user = await this.userService.getById(request.user.id);
      const { data, count } = await this.activityRegistrationService.getHistory(
        page,
        limit,
        search,
        user.department,
      );

      const result = await this.activityRegistrationService.getResult(user.id);
      const listActivity = result.map((item) => item?.activity?.id);
      const formatData = await Promise.all(
        data.map(async (item) => {
          const findItem = result.find((temp) => temp.activity.id === item.id);
          const getRegistered =
            await this.activityRegistrationService.getRegistered(item.id);
          const infoCreator = await this.userService.getById(item.creator.id);
          return {
            ...item,
            creation:
              infoCreator?.role === Role.MANAGER
                ? 'ĐTN-HSV trường'
                : infoCreator?.department?.name,
            statusRegistration: findItem ? findItem.status : '',
            numberRegisteredSuccess: getRegistered.filter(
              (item) => item.status === StatusRegistration.PASS,
            ).length,
          };
        }),
      );

      return {
        data: formatData.filter((item) => listActivity.includes(item.id)),
        count,
      };
    } catch (e: any) {
      return { data: [], count: 0 };
    }
  }

  @Get(':activity')
  @Roles(Role.MANAGER, Role.DEPARTMENT)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin sinh viên đăng ký hoạt động',
  })
  async getRegistered(
    @Param('activity') id: string,
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    // @Req() request: RequestWithUser,
  ) {
    try {
      return await this.activityRegistrationService.getQuery(
        page,
        limit,
        search,
        id,
      );
    } catch (e: any) {
      return [];
    }
  }

  @Post('/status/:activityId')
  @Roles(Role.PARTICIPANT)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @HttpCode(201)
  @ApiResponse({
    status: 200,
    description: 'Cập nhật trạng thái sinh viên đăng ký/hủy bỏ hoạt động',
  })
  async updateStatus(
    @Param('activityId') id: string,
    @Body() data: { status: string },
    @Req() request: RequestWithUser,
  ) {
    try {
      const activity = await this.activityService.getById(id);
      const currentDay = new Date();
      const conflict = activity.departments.find(
        (department) => department.id === request.user.department.id,
      );
      if (
        !(
          conflict ||
          (activity.registerStartDay <= currentDay &&
            currentDay <= activity.registerEndDay)
        )
      )
        throw new HttpException(
          'Người dùng không được phép đăng ký',
          HttpStatus.BAD_REQUEST,
        );
      return await this.activityRegistrationService.update(
        data.status,
        request.user,
        activity,
      );
    } catch (error: any) {
      if (error.status === 400) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  @Post('/qr-reg/:activityId')
  @Roles(Role.PARTICIPANT)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Cập nhật trạng thái sinh viên đăng ký/hủy bỏ hoạt động',
  })
  async QRReg(
    @Param('activityId') id: string,
    @Body() data: { status: string },
    @Req() request: RequestWithUser,
  ) {
    try {
      const activity = await this.activityService.getById(id);
      const currentDay = new Date();
      const conflict = activity.departments.find(
        (department) => department.id === request.user.department.id,
      );
      if (
        !(
          conflict ||
          (activity.registerStartDay <= currentDay &&
            currentDay <= activity.registerEndDay)
        )
      ) {
        const exception = new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Hoạt động không áp dụng cho user này hoặc đã hết hạn',
          },
          HttpStatus.BAD_REQUEST,
        );
        return exception.getResponse();
      }
      const result = await this.activityRegistrationService.QRReg(
        data.status,
        request.user,
        activity,
      );
      if (!result) {
        const exception = new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'Đã đăng kí rồi',
          },
          HttpStatus.CONFLICT,
        );
        return exception.getResponse();
      }
    } catch (error: any) {
      if (error.status === 400) {
        const exception = new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Bad request',
          },
          HttpStatus.BAD_REQUEST,
        );
        return exception.getResponse();
      }

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

  @Put('/status/:activity/:registration')
  @Roles(Role.DEPARTMENT, Role.MANAGER)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @HttpCode(201)
  @ApiResponse({
    status: 200,
    description: 'Cập nhật trạng thái sinh viên có được tham gia hoạt động.',
  })
  async updateRegistration(
    @Param('registration') id: string,
    @Param('activity') activityId: string,
    @Body() data: { status: string },
    @Req() request: RequestWithUser,
  ) {
    try {
      await this.activityService.checkAddUpdate(activityId, request.user.id);
      return await this.activityRegistrationService.updateRegistration(
        id,
        data.status,
      );
    } catch (error: any) {
      if (error.status === 400) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  @Put('/status/excel')
  @Roles(Role.MANAGER, Role.DEPARTMENT)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @HttpCode(201)
  @ApiResponse({
    status: 200,
    description:
      'Cập nhật trạng thái sinh viên có được tham gia hoạt động bằng file excel.',
  })
  async updateRegistrationExcel(
    // @Param('activity') activityId: string,
    @Req() request: RequestWithUser,
    @Body() data: { excel: string[]; activityId: string },
  ) {
    try {
      await this.activityService.checkAddUpdate(
        data.activityId,
        request.user.id,
      );
      return await this.activityRegistrationService.updateExcel(data.excel);
    } catch (error: any) {
      if (error.status === 400) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
