import { YouthBranchService } from './../services/youthBranch.service';
import { DepartmentService } from '../services/department.service';
import {
  Body,
  Controller,
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
import JwtAuthenticationGuard from '../guard/jwt-authentication.guard';
import { Roles } from 'src/common/roles.decorator';
import { RolesGuard } from '../guard/roles.guard';
import { Role } from 'src/common/enum';

@ApiTags('Chi đoàn')
@Controller('youthBranch')
@UseGuards(JwtAuthenticationGuard)
export class YouthBranchController {
  constructor(
    private youthBranchService: YouthBranchService,
    private departmentService: DepartmentService,
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách chi đoàn',
  })
  async get(
    @Query('code') departmentCode: string,
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    try {
      return await this.youthBranchService.get(
        departmentCode,
        page,
        limit,
        search,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post(':code')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Khởi tạo thành công và trả về Chi đoàn',
  })
  @ApiResponse({
    status: 400,
    description: 'Yêu cầu không hợp lệ',
  })
  async add(@Body() data: { name: string }, @Param('code') code: string) {
    try {
      return await this.youthBranchService.create(code, data.name);
    } catch (error: any) {
      if (error.status === 400) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  @Put(':code/:id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Cập nhập lại chi đoàn',
  })
  @ApiResponse({
    status: 400,
    description: 'Yêu cầu không hợp lệ',
  })
  async update(
    @Param('id') id: string,
    @Param('code') code: string,
    @Body() data: { name: string },
  ) {
    try {
      return await this.youthBranchService.update(code, id, data.name);
    } catch (error: any) {
      if (error.status === 400) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
