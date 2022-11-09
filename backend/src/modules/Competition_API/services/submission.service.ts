import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  Repository,
  getRepository,
  CustomRepositoryCannotInheritRepositoryError,
} from 'typeorm';
import { User } from 'src/models/Achievement/user.entity';

import { CompetitionSubmission } from 'src/models/Competition/comSubmission.entity';
import { Department } from 'src/models/Achievement/department.entity';
import { CompetitionSubmissionDto } from 'src/Dto/Competition/submission.dto';
import { Competition } from 'src/models/Competition/competition.entity';
import { CompetitionCriteria } from 'src/models/Competition/comCriteria.entity';

@Injectable()
export class CompetitionSubmissionService {
  constructor(
    @InjectRepository(CompetitionSubmission)
    private submissionRepository: Repository<CompetitionSubmission>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Competition)
    private competitionRepository: Repository<Competition>,
    @InjectRepository(CompetitionCriteria)
    private criteriaRepository: Repository<CompetitionCriteria>,
  ) {}

  async getUsers(comId: number) {
    const submissionList = await this.submissionRepository.find({
      relations: ['user', 'competition'],
      where: { competition: { id: comId } },
    });
    return submissionList.reduce((pre, submission) => {
      if (pre.includes(submission.user.id)) return pre;
      return [...pre, submission.user.id];
    }, []);
  }

  async getSubmission(id: number) {
    return await this.submissionRepository.find({
      relations: ['user', 'competition', 'comCriteria'],
      where: { competition: { id } },
    });
  }

  async getAll(comId: number, userId: number) {
    const data = await this.submissionRepository.find({
      where: { user: userId, competition: comId },
      relations: ['user', 'competition', 'comCriteria'],
    });
    const raw = data.filter(
      (item) => item.user.id === userId && item.competition.id === comId,
    );
    const result = [];
    for (const item of raw) {
      const newSub = {
        id: item.id,
        userId: item.user.id,
        competitionId: item.competition.id,
        criteriaID: item.comCriteria.id,
        file: item.file,
        point: item.point,
        description: item.description,
        studentComment: item.studentComment,
      };
      result.push(newSub);
    }
    return result;
  }

  async get(examerId: number, comId: number) {
    return await this.submissionRepository.find({
      relations: ['competition', 'comCriteria'],
      where: { competition: { id: comId }, user: { id: examerId } },
    });
  }

  async getUserSubmission(userId: number) {
    return await this.submissionRepository.find({
      relations: ['user', 'competition', 'comCriteria'],
      where: { user: { id: userId } },
    });
  }

  // async getSubmissionExamer(
  //   id: number,
  //   page: number,
  //   limit: number,
  //   keyword?: string,
  // ) {
  //   try {
  //     const newPage = page <= 0 ? 1 : page;
  //     const test = await getRepository(User)
  //       .createQueryBuilder('user')
  //       .select([
  //         'user.id',
  //         'user.email',
  //         'user.name',
  //         'user.surName',
  //         'user.mssv',
  //       ])
  //       .addSelect('department.name', 'department')
  //       .innerJoin(Achievement, 'achievement', `achievement.id = ${id}`)
  //       .innerJoin(
  //         Submission,
  //         'submission',
  //         `user.id = submission.user.id AND submission.achievement.id = ${id}`,
  //       )
  //       .innerJoin(
  //         Department,
  //         'department',
  //         'department.id = user.department.id',
  //       )
  //       .where(
  //         ` user.surName || ' ' || user.name ILIKE :fullName OR user.mssv ILIKE :mssv OR department.name ILIKE :department`,
  //         {
  //           fullName: `%${keyword}%`,
  //           mssv: `%${keyword}%`,
  //           department: `%${keyword}%`,
  //         },
  //       )
  //       .orderBy('submission.createdAt', 'ASC')
  //       .getRawMany();

  //     const testUnique = test.filter(
  //       (item, index, self) =>
  //         self.map((item) => item.user_id).indexOf(item.user_id) === index,
  //     );

  //     return {
  //       count: testUnique.length,
  //       examers: testUnique.slice((newPage - 1) * limit, page * limit),
  //     };
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }

  async add(data: CompetitionSubmissionDto[]) {
    // console.log(data);
    data.map(async (submission: CompetitionSubmissionDto) => {
      const newSub = this.submissionRepository.create(submission);
      newSub.user = this.userRepository.create({ id: submission.userId });
      newSub.competition = this.competitionRepository.create({
        id: submission.competitionId,
      });
      newSub.comCriteria = this.criteriaRepository.create({
        id: submission.criteriaID,
      });
      try {
        await this.submissionRepository.save(newSub);
      } catch (error) {
        console.log('get here');
        console.log(newSub);
        console.log('Crash', error.message);
      }
    });
    return 'Add success';
  }
}
