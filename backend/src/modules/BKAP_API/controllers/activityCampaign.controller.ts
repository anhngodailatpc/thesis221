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
import { ActivityCampaignService } from '../services/activityCampaign.service';
import JwtAuthenticationGuard from 'src/modules/api/guard/jwt-authentication.guard';
import { Role } from 'src/common/enum';
import { Roles } from 'src/common/roles.decorator';
import { RolesGuard } from 'src/modules/api/guard/roles.guard';

@ApiTags('Đợt hoạt động')
@Controller('activityCampaign')
@UseGuards(JwtAuthenticationGuard)
export class ActivityCampaignController {
  constructor(private activityCampaignService: ActivityCampaignService) {}

  @Roles(Role.MANAGER, Role.DEPARTMENT)
  @UseGuards(RolesGuard)
  @Get()
  async getAll() {
    try {
      return await this.activityCampaignService.getAll();
    } catch (e: any) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Lỗi server',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Roles(Role.MANAGER, Role.DEPARTMENT)
  @UseGuards(RolesGuard)
  @Get('/active')
  async getAllActive() {
    try {
      return await this.activityCampaignService.getAllActive();
    } catch (e: any) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Lỗi server',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
      return await this.activityCampaignService.getAllWithFilter(
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
  @Delete(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Delete campaign successfully',
  })
  async delete(@Param('id') id: string) {
    try {
      const data = await this.activityCampaignService.delCampaign(id);
      if (data.length > 0) {
        const exception = new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'Không thể xóa đợt hoạt động',
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
  @Post('/add-campaign')
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Thêm đợt hoạt động thành công',
  })
  async addCampaign(@Body() newCampaign: any) {
    try {
      return await this.activityCampaignService.add(newCampaign);
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
  @Put('/modify-campaign')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Chỉnh sửa đợt hoạt động thành công',
  })
  async modifyCampaign(@Body() campaign: any) {
    try {
      return await this.activityCampaignService.modify(campaign);
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
