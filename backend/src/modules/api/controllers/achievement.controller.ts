import { User } from './../../../models/Achievement/user.entity';
import { RolesGuard } from './../guard/roles.guard';
import { Role } from './../../../common/enum';
import { Roles } from './../../../common/roles.decorator';
import { AuditorService } from './../services/auditor.service';
import { ManageAuditorDto } from './../../../Dto/auditor.dto';
// import { Achievement } from './../../../models/achievement.entity';
import { AchievementService } from './../services/achievement.service';
import { DepartmentService } from '../services/department.service';
import { ResultService } from '../services/result.service';
import { UsersService } from './../services/users.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  Put,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
  HttpStatus,
  Query,
  Req,
} from '@nestjs/common';
import JwtAuthenticationGuard from '../guard/jwt-authentication.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AchievementDto } from 'src/Dto/achievement.dto';

interface RequestWithUser extends Request {
  user: User;
}

@ApiTags('Danh hiệu')
@Controller('achievement')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthenticationGuard)
export class AchievementController {
  constructor(
    private achievementService: AchievementService,
    private departmentService: DepartmentService,
    private resultService: ResultService,
    private userService: UsersService,
    private auditorService: AuditorService,
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Return a list of achievement',
  })
  async getList(@Query('type') type: string) {
    return await this.achievementService.getAll(type);
  }

  @Get('filter')
  @ApiResponse({
    status: 200,
    description: 'Return a list of achievement',
  })
  async getQuery(
    @Query('isAuditor') isAuditor: boolean,
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('type') type: string,
    @Query('limit') limit: number,
    @Req() request: RequestWithUser,
  ) {
    try {
      if (
        isAuditor &&
        [Role.PARTICIPANT, Role.DEPARTMENT].includes(request.user.role)
      ) {
        return await this.achievementService.getQueryCheckAuditor(
          page,
          limit,
          search,
          request.user,
          type,
        );
      }
      if (page || limit) {
        return await this.achievementService.getQuery(
          page,
          limit,
          search,
          type,
        );
      }
      const data = await this.achievementService.getAll(type);

      return { data: data, count: data.length };
    } catch (error) {
      return {
        data: [],
        count: 0,
      };
    }
  }

  @Get('all/filter')
  @ApiResponse({
    status: 200,
    description: 'Return a list of achievement',
  })
  async getQueryAll(
    @Query('isAuditor') isAuditor: boolean,
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('type') type: string,
    @Query('limit') limit: number,
    @Req() request: RequestWithUser,
  ) {
    try {
      if (request.user.role === Role.ADMIN) return { count: 0 };

      if (
        isAuditor &&
        [Role.PARTICIPANT, Role.DEPARTMENT].includes(request.user.role)
      ) {
        return await this.achievementService.getQueryCheckAuditor(
          page,
          limit,
          search,
          request.user,
          type,
        );
      }
      if (page || limit) {
        return await this.achievementService.getQueryAll(
          page,
          limit,
          search,
          type,
        );
      }
      const data = await this.achievementService.getAll(type);

      return { data: data, count: data.length };
    } catch (error) {
      return {
        data: [],
        count: 0,
      };
    }
  }

  @Get('users/submission/:achievement')
  @ApiResponse({
    status: 200,
    description: 'Return a list of achievement',
  })
  async getUserSubmission(
    @Param('achievement') achievement: string,
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Req() request: RequestWithUser,
  ) {
    try {
      const dataAchievement = await this.achievementService.getOne(
        +achievement,
      );
      const auditors = dataAchievement.auditorFinal
        ? [
            dataAchievement.auditorFinal.id,
            ...dataAchievement.auditors.map((auditor) => auditor.id),
          ]
        : dataAchievement.auditors.map((auditor) => auditor.id);
      if (
        request.user.role !== Role.MANAGER &&
        !auditors.includes(request.user.id)
      )
        throw new HttpException('Không đủ quyền hạn', HttpStatus.BAD_REQUEST);

      const { data: examers, count } = await this.userService.getUserSubmission(
        +achievement,
        page,
        limit,
        search,
      );

      const data = await Promise.all(
        examers.map(async (examer: any) => {
          const isExamer = await this.resultService.getExamer(
            +achievement,
            examer.id,
            request.user.id,
          );
          return {
            ...examer,
            result: isExamer
              ? isExamer.result
                ? 'success'
                : 'failure'
              : 'none',
          };
        }),
      );
      return { data, count };
    } catch (error: any) {
      if (error.status === 400) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Return a achievement',
  })
  async get(@Param('id') id: string) {
    return await this.achievementService.getOne(+id);
  }

  @Get('resultUser/:id')
  @ApiResponse({
    status: 200,
    description: 'Trả về kết quả cuối cùng cho người đk danh hiệu',
  })
  async getResultUser(
    @Param('id') id: string,
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    try {
      await this.achievementService.getOne(+id);
      return await this.auditorService.getResultUser(+id, page, limit, search);
    } catch (error: any) {
      console.error(error.message);
    }
  }

  @Get('status/:achievement')
  @ApiResponse({
    status: 200,
    description: 'Trả về xem danh hiệu có đang bị khóa hay không',
  })
  async getStatus(
    @Param('achievement') id: string,
    @Req() request: RequestWithUser,
  ) {
    try {
      return await this.achievementService.getStatus(+id, request.user);
    } catch (error: any) {
      console.error(error.message);
    }
  }

  @Get('manageUnit/:achievement')
  @ApiResponse({
    status: 200,
    description: 'Trả về xem danh sách các đơn vị của 1 danh hiệu',
  })
  async getManage(@Param('achievement') id: string) {
    try {
      const achievement = await this.achievementService.getOne(+id);
      const data = await Promise.all(
        achievement.manageUnit.map(async (item) => {
          const [emailUnit, codeUnit] = item.split(',');
          const {
            id: idUser,
            email,
            name,
            surName,
          } = await this.userService.getByEmail(emailUnit);
          const { data } = await this.departmentService.get(1, 1, codeUnit);

          return {
            email,
            name,
            surName,
            department: data[0].name,
            code: data[0].code,
          };
        }),
      );
      return data;
    } catch (error: any) {
      console.error(error.message);
    }
  }

  @Put('status/:achievement')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Thiết lập trạng thái cho danh hiệu',
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad request for course information (not found id, duplicate code, ...)',
  })
  async updateStatus(
    @Param('achievement') id: string,
    @Req() request: RequestWithUser,
    @Body() data: { status: string },
  ) {
    try {
      return await this.achievementService.setStatus(
        data.status,
        +id,
        request.user.id,
        request.user.role === Role.MANAGER,
      );
    } catch (error: any) {
      if (error.status === 400) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  @Post('deleteManageUnit/:id')
  // @UseGuards(RolesGuard)
  // @Roles(Role.MANAGER)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Xóa thành viên trong quản lý đơn vị',
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad request for course information (not found id, duplicate code, ...)',
  })
  async deleteManageUnits(@Param('id') id: string, @Body() data: any) {
    try {
      return await this.achievementService.deleteManageUnit(+id, data.str);
    } catch (error: any) {
      if (error.status === 400) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  @Put('manageUnit/:achievement')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Cập nhật trạng thái cho quản lý đơn vị',
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad request for course information (not found id, duplicate code, ...)',
  })
  async manageUnit(
    @Param('achievement') id: string,
    @Req() request: RequestWithUser,
    @Body() data: { email: string; codeDepartment: string },
  ) {
    try {
      return await this.achievementService.manageUnit(+id, data);
    } catch (error: any) {
      if (error.status === 400) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER)
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Tạo danh hiệu và trả về',
  })
  @ApiResponse({
    status: 400,
    description: 'Trả về lỗi (tên danh hiệu bị trùng,...)',
  })
  async add(@Body() achievementDto: AchievementDto) {
    try {
      return await this.achievementService.add(achievementDto);
    } catch (error: any) {
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Chỉnh sửa danh hiệu',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  async updateCourse(
    @Param('id') id: string,
    @Body() achievementDto: AchievementDto,
  ) {
    try {
      return await this.achievementService.update(+id, achievementDto);
    } catch (error: any) {
      console.log(error.message);
      throw new HttpException(error.code, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('auditor/:id')
  @HttpCode(200)
  async getAuditors(@Param('id') id: string) {
    try {
      const { auditors, auditorFinal } =
        await this.achievementService.getAuditors(+id);
      const userList = await Promise.all(
        auditors.map(async (auditor) => {
          const { email } = await this.userService.getById(auditor.id);
          return {
            id: auditor.id,
            name: auditor.name,
            surName: auditor.surName,
            email,
            isFinal: false,
          };
        }),
      );
      if (auditorFinal) {
        return [
          ...userList,
          {
            id: auditorFinal.id,
            name: auditorFinal.name,
            surName: auditorFinal.surName,
            email: auditorFinal.email,
            isFinal: true,
          },
        ];
      }
      return userList;
    } catch (error: any) {
      console.log(error.message);
      throw new HttpException(
        { status: error.code, message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('summary/:achievement')
  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER, Role.PARTICIPANT, Role.DEPARTMENT)
  @HttpCode(200)
  async getSummary(
    @Param('achievement') id: string,
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    try {
      const response = await this.achievementService.getSummary(+id);
      const countSubmission = response.length;
      const { data: departmentFilter, count: countDepartment } =
        await this.departmentService.get(page, limit, search);
      const formatObjectDepartment = departmentFilter.reduce(
        (pre, { id, name, code }) => ({
          ...pre,
          [id]: {
            id,
            name,
            code,
            success: 0,
            failed: 0,
          },
        }),
        {},
      );
      response.forEach((item) => {
        if (item.result) {
          formatObjectDepartment[item.department_id] &&
            formatObjectDepartment[item.department_id].success++;
        } else {
          formatObjectDepartment[item.department_id] &&
            formatObjectDepartment[item.department_id].failed++;
        }
      });
      return {
        countSubmission,
        countDepartment,
        data: Object.values(formatObjectDepartment),
      };
    } catch (error: any) {
      console.log(error.message);
      throw new HttpException(
        { status: error.code, message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('auditor/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER)
  @HttpCode(200)
  async updateAuditors(
    @Param('id') id: string,
    @Body() auditorDto: ManageAuditorDto,
  ) {
    try {
      if (auditorDto.isFinal) {
        if (auditorDto.auditor.length === 0) {
          return await this.achievementService.saveAuditorFinal(+id, null);
        }
        if (auditorDto.auditor.length > 1)
          throw new HttpException(
            'không được có 2 chủ tịch xét duyệt',
            HttpStatus.BAD_REQUEST,
          );
        const User = await this.userService.checkAndCreateUser(
          auditorDto.auditor,
        );

        return await this.achievementService.saveAuditorFinal(+id, User[0]);
      } else {
        const isExist = await this.achievementService.checkAuditorFinal(
          +id,
          auditorDto.auditor,
        );
        if (isExist)
          throw new HttpException(
            'Không thể vừa là thành viên vừa là chủ tịch hội đồng xét duyệt',
            HttpStatus.BAD_REQUEST,
          );
        const Users = await this.userService.checkAndCreateUser(
          auditorDto.auditor,
        );
        return await this.achievementService.saveUsers(+id, Users);
      }
    } catch (error: any) {
      if (error.status === 400) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description:
      'Successfully deleting a course, return the number of affected objects in affected field',
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad request for course information (not found id, duplicate code, ...)',
  })
  async deleteCourse(@Param('id') id: string) {
    try {
      const result = await this.achievementService.delete(+id);
      return { affected: result.affected };
    } catch (error: any) {
      console.log(error.message);
      throw new HttpException(error.code, HttpStatus.BAD_REQUEST);
    }
  }
}
