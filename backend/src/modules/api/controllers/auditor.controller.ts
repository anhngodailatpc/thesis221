import { RolesGuard } from './../guard/roles.guard';
import { Role } from './../../../common/enum';
import { Roles } from './../../../common/roles.decorator';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuditorService } from '../services/auditor.service';
import { SubmissionService } from '../services/submission.service';
import { ResultService } from '../services/result.service';
import { CriteriaService } from '../services/criteria.service';
import { AchievementService } from '../services/achievement.service';
import { Request } from 'express';
import JwtAuthenticationGuard from '../guard/jwt-authentication.guard';
import User from 'src/models/Achievement/user.entity';
interface RequestWithUser extends Request {
  user: User;
}

@ApiTags('Người phê duyệt danh hiệu')
@Controller('auditor')
@UseGuards(JwtAuthenticationGuard)
export class AuditorController {
  constructor(
    private auditorService: AuditorService,
    private submissionService: SubmissionService,
    private criteriaService: CriteriaService,
    private achievementService: AchievementService,
    private resultService: ResultService,
  ) {}

  @Get(':achievementId/:userId')
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách những người nộp hồ sơ',
  })
  async getDepartment(
    @Query('listUser') listUser: string,
    @Req() request: RequestWithUser,
    @Param('userId') userId: string,
    @Param('achievementId')
    achievementId: string,
  ) {
    try {
      if (!listUser)
        throw new HttpException(
          'không có danh sách người nộp',
          HttpStatus.BAD_REQUEST,
        );
      if (listUser === '-999') return [];
      return await Promise.all(
        listUser.split(',').map(async (examerId: string) => {
          const submission = await this.submissionService.get(
            +examerId,
            +achievementId,
          );
          const listCriteriaId = await this.achievementService.getChileById(
            +achievementId,
          );
          const achievement = await this.achievementService.getOne(
            +achievementId,
          );
          const flat = await this.criteriaService.flatCriteria(+achievementId);
          const Criterias = await Promise.all(
            flat.map(async (criteria) => {
              const submissionElement = submission.find(
                (sub) => sub.criteria.id === criteria.id,
              );
              if (submissionElement) {
                const resultOfCriteria =
                  await this.auditorService.getResultOfCriteria(
                    submissionElement.id,
                    +userId,
                  );
                const { id, file, point, binary, studentComment } =
                  submissionElement;
                return {
                  isSubmission: true,
                  id,
                  file,
                  point,
                  binary,
                  studentComment,
                  nameCriteria: criteria.name,
                  idCriteria: criteria.id,
                  method: criteria.method,
                  isRoot: listCriteriaId.includes(criteria.id),
                  isCriteria: criteria.isCriteria,
                  evidence: criteria.evidence,
                  content: criteria.content,
                  note: criteria.note,
                  description: resultOfCriteria
                    ? resultOfCriteria.description
                    : '',
                  result: resultOfCriteria ? resultOfCriteria.result : false,
                  idResultOfCriteria: resultOfCriteria?.id,
                  soft: criteria.soft,
                  children: criteria.children,
                };
              } else {
                return {
                  isSubmission: false,
                  nameCriteria: criteria.name,
                  idCriteria: criteria.id,
                  method: criteria.method,
                  isRoot: listCriteriaId.includes(criteria.id),
                  isCriteria: criteria.isCriteria,
                  evidence: criteria.evidence,
                  soft: criteria.soft,
                  children: criteria.children,
                };
              }
            }),
          );
          return {
            examerId: +examerId,
            achievementId,
            userId,
            soft: achievement.softCriteria,
            criterias: Criterias,
          };
        }),
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  @Get(':submission')
  @Roles(Role.PARTICIPANT, Role.MANAGER, Role.DEPARTMENT)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  async getResultSubmission(@Param('submission') submission: string) {
    try {
      const result = await this.resultService.getResultSubmission(submission);
      return result.map((res) => ({
        result: res.result,
        email: res.user.email,
        surName: res.user.surName,
        name: res.user.name,
      }));
    } catch (error) {
      console.error(error.message);
    }
  }

  @Post(':achievement/:examer')
  @HttpCode(201)
  @Roles(Role.PARTICIPANT, Role.MANAGER, Role.DEPARTMENT)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @ApiResponse({
    status: 201,
    description: 'Duyệt hồ sơ',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request ',
  })
  async addCriteria(
    @Body() body: { resultFinal: boolean; data: any },
    @Req() request: RequestWithUser,
    @Param('examer') examer: string,
    @Param('achievement')
    achievement: string,
  ) {
    try {
      const checkAuditor = await this.auditorService.checkAuditor(
        request.user.id,
        +achievement,
      );
      if (checkAuditor === 3)
        throw new HttpException(
          'không thuộc quyền hạn',
          HttpStatus.BAD_REQUEST,
        );
      return await this.auditorService.createEachCriterias(
        body.data,
        body.resultFinal,
        +achievement,
        +examer,
        request.user.id,
      );
    } catch (error: any) {
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
