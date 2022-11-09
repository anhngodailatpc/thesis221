import { ActivityManageService } from './../services/activityManage.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/enum';
import { Roles } from 'src/common/roles.decorator';
import JwtAuthenticationGuard from 'src/modules/api/guard/jwt-authentication.guard';
import { RolesGuard } from 'src/modules/api/guard/roles.guard';
import { ActivityGroupService } from '../services/activityGroup.service';

@ApiTags('Nhóm hoạt động')
@Controller('activityGroup')
@UseGuards(JwtAuthenticationGuard)
@UseGuards(JwtAuthenticationGuard)
export class ActivityGroupController {
  constructor(
    private activityGroupService: ActivityGroupService,
    private activityService: ActivityManageService,
  ) {}

  @Get()
  @Roles(Role.MANAGER, Role.DEPARTMENT)
  @UseGuards(RolesGuard)
  async getAll() {
    try {
      return await this.activityGroupService.getAll();
    } catch (e: any) {
      return [];
    }
  }
  @Get('limit')
  @Roles(Role.MANAGER, Role.DEPARTMENT)
  @UseGuards(RolesGuard)
  async getAllLimit() {
    try {
      const activity = await this.activityService.getAll();
      const activityGroup = await this.activityGroupService.getAll();
      activity.map((item) => {
        const dataFind = activityGroup.find(
          (itemGroup) => itemGroup.id === item.activityGroup.id,
        );
        if (dataFind) dataFind.maximumActivity--;
        return item;
      });
      return activityGroup.filter((item) => item.maximumActivity > 0);
    } catch (e: any) {
      return [];
    }
  }
  @Roles(Role.MANAGER, Role.DEPARTMENT)
  @UseGuards(RolesGuard)
  @Get('/use-filter')
  async getAllWithFilter(
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    try {
      return await this.activityGroupService.getAllWithFilter(
        page,
        limit,
        search,
      );
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

  @Roles(Role.MANAGER)
  @UseGuards(RolesGuard)
  @Put('/modify-group')
  @HttpCode(200)
  async update(@Body() group: any) {
    try {
      return await this.activityGroupService.modify(group);
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

  @Roles(Role.MANAGER)
  @UseGuards(RolesGuard)
  @Delete(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Delete group successfully',
  })
  async delete(@Param('id') id: string) {
    try {
      const data = await this.activityGroupService.delGroup(id);
      if (data.length > 0) {
        const exception = new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'Không thể xóa nhóm hoạt động',
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

  @Roles(Role.MANAGER)
  @UseGuards(RolesGuard)
  @Post('/add-group')
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Thêm đợt hoạt động thành công',
  })
  async addGroup(@Body() newGroup: any) {
    try {
      return await this.activityGroupService.add(newGroup);
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
}
