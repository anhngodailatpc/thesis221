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
import { CriteriaUpdateDto } from 'src/Dto/Competition/criteriaUpdate.dto';
import User from 'src/models/Achievement/user.entity';
import JwtAuthenticationGuard from 'src/modules/api/guard/jwt-authentication.guard';
import { CompetitionService } from '../services/competition.service';
import { CompetitionCriteriaService } from '../services/criteria.service';

interface RequestWithUser extends Request {
  user: User;
}
interface SaveCritSendType {
  list: CriteriaUpdateDto[];
  deletedID: string[];
}

@ApiTags('Tiêu chí thi đua')
@Controller('competition/criteria')
@UseInterceptors(ClassSerializerInterceptor)
//@UseGuards(JwtAuthenticationGuard)
export class CompetitionCriteriaController {
  constructor(
    private competitionService: CompetitionService,
    private criteriaService: CompetitionCriteriaService,
  ) {}
  @Post(':id')
  async test(@Body() data: SaveCritSendType, @Param('id') id: string) {
    return this.criteriaService.save(data.list, parseInt(id));
  }
  @Get(':id')
  async getAll(@Param('id') id: string) {
    return this.criteriaService.getAll(parseInt(id));
  }
}
