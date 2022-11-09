import { Result } from './../../../models/Achievement/result.entity';
import { Department } from './../../../models/Achievement/department.entity';
import { Lock, Role } from './../../../common/enum';
import { Criteria } from 'src/models/Achievement/criteria.entity';
import { Achievement } from '../../../models/Achievement/achievement.entity';
import { User } from './../../../models/Achievement/user.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import {
  DeleteResult,
  ILike,
  Repository,
  getRepository,
  In,
  Raw,
} from 'typeorm';
import { SubmissionService } from './submission.service';

import { AchievementDto } from 'src/Dto/achievement.dto';
import postgresErrorCode from 'src/database/postgresErrorCode.enum';
import { Auditors } from 'src/Dto/auditor.dto';

@Injectable()
export class AchievementService extends TypeOrmQueryService<Achievement> {
  constructor(
    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>,
    @InjectRepository(Criteria)
    private criteriaRepository: Repository<Criteria>,
    private submissionService: SubmissionService,
  ) {
    super(achievementRepository, { useSoftDelete: true });
  }

  async getAll(type: string): Promise<Achievement[]> {
    return await this.achievementRepository.find({
      order: { createdAt: 'DESC' },
      where: { type },
    });
  }

  async getQueryCheckAuditor(
    page: number,
    limit: number,
    keyword = '',
    user: User,
    type: string,
  ) {
    const newPage = page <= 0 ? 1 : page;
    const achievementList = await this.achievementRepository.find({
      relations: ['auditors', 'auditorFinal'],
      where: { type },
    });

    const data = achievementList.reduce((pre, cur) => {
      const isExist = cur.auditors.find((aud) => aud.id === user.id);

      const isExistFinal = cur.auditorFinal
        ? cur.auditorFinal.id === user.id
        : false;
      if (isExistFinal) return [...pre, cur.id];
      if (isExist && cur.lock !== Lock.FOREVER) return [...pre, cur.id];
      return pre;
    }, []);
    const result = await this.achievementRepository.find({
      relations: ['auditors', 'auditorFinal'],
      where: { name: ILike(`%${keyword}%`), id: In(data) },
      order: { createdAt: 'DESC' },
    });
    return {
      data: result.slice((newPage - 1) * limit, newPage * limit),
      count: result.length,
    };
  }

  async getQuery(page: number, limit: number, keyword = '', type: string) {
    const newPage = page <= 0 ? 1 : page;
    const result = await this.achievementRepository.find({
      relations: ['auditors', 'auditorFinal'],
      where: {
        type,
        name: ILike(`%${keyword}%`),
        endAt: Raw((alias) => `${alias} < NOW()`),
      },
      order: { createdAt: 'DESC' },
    });

    return {
      data: result.slice((newPage - 1) * limit, newPage * limit),
      count: result.length,
    };
  }

  async getQueryAll(page: number, limit: number, keyword = '', type: string) {
    const newPage = page <= 0 ? 1 : page;
    const result = await this.achievementRepository.find({
      relations: ['auditors', 'auditorFinal'],
      where: {
        type,
        name: ILike(`%${keyword}%`),
      },
      order: { createdAt: 'DESC' },
    });

    return {
      data: result.slice((newPage - 1) * limit, newPage * limit),
      count: result.length,
    };
  }

  async getStatus(id: number, userRequest: User) {
    const achievement = await this.achievementRepository.findOne({
      relations: ['auditorFinal', 'auditors'],
      where: { id },
    });
    if (!achievement)
      throw new HttpException(
        'danh hiệu không tồn tại',
        HttpStatus.BAD_REQUEST,
      );
    if (achievement.lock === Lock.UNAVAILABLE)
      return { status: achievement.lock };
    if (achievement.auditorFinal.id === userRequest.id)
      return { status: Lock.UNLOCK };
    const user = achievement.auditors.find(
      (user) => user.id === userRequest.id,
    );
    if (!user && userRequest.role !== Role.MANAGER)
      throw new HttpException(
        'Người dùng không được phép truy cập',
        HttpStatus.BAD_REQUEST,
      );
    return { status: achievement.lock };
  }

  async setStatus(
    status: string,
    achievementId: number,
    userId: number,
    manager = false,
  ) {
    const achievement = await this.achievementRepository.findOne({
      relations: ['auditorFinal'],
      where: { id: achievementId },
    });
    if (!achievement)
      throw new HttpException(
        'danh hiệu không tồn tại',
        HttpStatus.BAD_REQUEST,
      );
    if (achievement.auditorFinal.id !== userId) {
      if (!manager)
        throw new HttpException(
          'Không có quyền chỉnh sửa',
          HttpStatus.BAD_REQUEST,
        );
    }
    if (achievement.lock === Lock.FOREVER)
      throw new HttpException(
        'Thẩm định danh hiệu đã kết thúc',
        HttpStatus.BAD_REQUEST,
      );
    if (status === 'FOREVER') {
      const { count } = await this.submissionService.getSubmissionExamer(
        achievementId,
        1,
        1,
        '',
      );

      const resultUser = await this.getSummary(achievementId);
      if (resultUser.length !== count)
        throw new HttpException(
          'Phải duyệt hết hồ sơ mới có thể khóa phiên thẩm định hồ sơ này',
          HttpStatus.BAD_REQUEST,
        );
      achievement.lock = Lock[status];
    }
    achievement.lock = Lock[status];
    return await this.achievementRepository.save(achievement);
  }

  async saveAuditorFinal(id: number, user: User) {
    const achievement = await this.achievementRepository.findOne({
      relations: ['auditorFinal', 'auditors'],
      where: { id },
    });
    if (achievement.auditorFinal?.email && user) {
      if (
        achievement.auditors.some(
          (user) => user.email === achievement.auditorFinal.email,
        )
      ) {
        throw new HttpException(
          'Không thể vừa là thành viên vừa là chủ tịch hội đồng xét duyệt',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Không thể có 2 chủ tịch hội đồng xét duyệt',
        HttpStatus.BAD_REQUEST,
      );
    }
    achievement.auditorFinal = user;
    return await this.achievementRepository.save(achievement);
  }

  async checkAuditorFinal(id: number, users: Auditors[]) {
    const achievement = await this.achievementRepository.findOne({
      relations: ['auditorFinal'],
      where: { id },
    });
    if (achievement.auditorFinal?.email) {
      if (users.some((user) => user.label === achievement.auditorFinal.email))
        return true;
    }
    return false;
  }

  async saveUsers(id: number, users: User[]) {
    const achievement = await this.getOne(id);
    achievement.auditors = users;
    return await this.achievementRepository.save(achievement);
  }

  async getChileById(id: number) {
    const achievement = await this.achievementRepository.findOne({
      relations: ['criterias'],
      where: {
        id,
      },
    });
    return achievement.criterias.map((cri) => cri.id);
  }

  async getOne(id: number): Promise<Achievement> {
    const achievement = await this.achievementRepository.findOne({
      relations: ['auditorFinal', 'auditors', 'criterias'],
      where: { id },
    });
    if (!achievement)
      throw new HttpException(
        'Danh hiệu không tồn tại',
        HttpStatus.BAD_REQUEST,
      );
    return achievement;
  }

  async manageUnit(
    id: number,
    data: { email: string; codeDepartment: string },
  ) {
    const achievement = await this.getOne(id);
    achievement.manageUnit = [
      ...achievement.manageUnit,
      `${data.email},${data.codeDepartment}`,
    ];
    return await this.achievementRepository.save(achievement);
  }

  async add(achievementDto: AchievementDto): Promise<Achievement> {
    try {
      return await this.achievementRepository.save(achievementDto);
    } catch (error) {
      if (error?.code === postgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'Tên danh hiệu bị trùng',
          HttpStatus.BAD_REQUEST,
        );
      }
      console.log('achievement-add', error.message);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addChildCriteria(id: number, Criterias: Criteria[]) {
    const achievement = await this.getOne(id);
    achievement.criterias = Criterias;
    return await this.achievementRepository.save(achievement);
  }

  async getAuditors(id: number) {
    const auditors = await this.achievementRepository.findOne({
      relations: ['auditors', 'auditorFinal'],
      where: { id },
    });
    //console.log(auditors)
    return auditors;
  }

  async getSummary(achievementId: number) {
    try {
      const data = await getRepository(User)
        .createQueryBuilder('user')
        .select('user.email', 'email')
        .addSelect('department.name', 'department')
        .addSelect('department.id', 'department_id')
        .addSelect('result.result', 'result')
        .innerJoin(
          Department,
          'department',
          `department.id = user.department.id`,
        )
        .innerJoin(
          Result,
          'result',
          `result.examer.id = user.id AND result.achievement.id = ${achievementId} AND result.final = ${true}`,
        )
        .orderBy('user.createdAt')
        .getRawMany();
      return data;
    } catch (error: any) {
      console.log(error.message);
    }
  }

  async updateAuditors(achievementId: number, userFinal: User, users: User[]) {
    try {
      const achievement = await this.getOne(achievementId);
      achievement.auditorFinal = userFinal;
      achievement.auditors = users;
      return await this.achievementRepository.save(achievement);
    } catch (error) {
      console.log(error.message);
    }
  }

  async update(id: number, achievementDto: AchievementDto) {
    try {
      let updatingAchievement: Achievement =
        await this.achievementRepository.findOne(id);
      if (!updatingAchievement) throw { code: 'Achievement_NOT_FOUND' };
      updatingAchievement = { ...updatingAchievement, ...achievementDto };
      return await this.achievementRepository.save(updatingAchievement);
    } catch (error) {
      if (error?.code === postgresErrorCode.UniqueViolation) {
        return {
          statusCode: 400,
          message: 'Tên danh hiệu bị trùng',
        };
      }
      console.log('Lỗi trong lúc update tiêu chí', error.message);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteManageUnit(id: number, str: string) {
    const achievement = await this.getOne(id);
    achievement.manageUnit = achievement.manageUnit.filter(
      (item) => item != str,
    );
    return await this.achievementRepository.save(achievement);
  }

  async delete(id: number): Promise<DeleteResult> {
    const deletingAchievement: Achievement =
      await this.achievementRepository.findOne(id);
    if (!deletingAchievement) throw { code: 'Achievement_NOT_FOUND' };
    return await this.achievementRepository.softDelete(id);
  }
}
