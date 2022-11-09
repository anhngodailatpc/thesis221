import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/enum';
import { CompetitionCreateDto } from 'src/Dto/Competition/competitionCreate.dto';
import User from 'src/models/Achievement/user.entity';
import JwtAuthenticationGuard from 'src/modules/api/guard/jwt-authentication.guard';
import { CompetitionService } from '../services/competition.service';

interface RequestWithUser extends Request {
  user: User;
}

@ApiTags('Thi đua')
@Controller('competition')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthenticationGuard)
export class CompetitionController {
  constructor(private competitionService: CompetitionService) {}

  @Get()
  async getAll() {
    return await this.competitionService.getAll();
  }
  @Post()
  async create(@Body() competition: CompetitionCreateDto) {
    return await this.competitionService.create(competition);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() competition: CompetitionCreateDto,
  ) {
    return await this.competitionService.update(competition, id);
  }

  @Get(':id')
  async retrieve(@Param('id') id: number) {
    return await this.competitionService.retrieve(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.competitionService.delete(id);
  }
  @Get('filter')
  @ApiResponse({
    status: 200,
    description: 'Return a list of competition',
  })
  async getQuery(
    @Query('isAuditor') isAuditor: boolean,
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Req() request: RequestWithUser,
  ) {
    try {
      if (isAuditor && request.user.role === Role.PARTICIPANT) {
        return await this.competitionService.getQueryCheckAuditor(
          page,
          limit,
          search,
          request.user,
        );
      }
      if (page || limit) {
        return await this.competitionService.getQuery(page, limit, search);
      }
      const data = await this.competitionService.getAll();

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
    description: 'Return a list of competition',
  })
  async getQueryAll(
    @Query('isAuditor') isAuditor: boolean,
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Req() request: RequestWithUser,
  ) {
    try {
      if (request.user.role === Role.ADMIN) return { count: 0 };

      if (isAuditor && request.user.role === Role.PARTICIPANT) {
        return await this.competitionService.getQueryCheckAuditor(
          page,
          limit,
          search,
          request.user,
        );
      }
      if (page || limit) {
        return await this.competitionService.getQueryAll(page, limit, search);
      }
      const data = await this.competitionService.getAll();

      return { data: data, count: data.length };
    } catch (error) {
      console.log(error);
      return {
        data: [],
        count: 0,
      };
    }
  }
}
