import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubmissionDto } from 'src/Dto/submission.dto';
import { Submission } from 'src/models/Achievement/submission.entity';
import { Department } from 'src/models/Achievement/department.entity';
import { Repository, getRepository } from 'typeorm';
import { User } from 'src/models/Achievement/user.entity';
import { Achievement } from 'src/models/Achievement/achievement.entity';
import { Criteria } from 'src/models/Achievement/criteria.entity';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(Submission)
    private submissionRepository: Repository<Submission>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>,
    @InjectRepository(Criteria)
    private criteriaRepository: Repository<Criteria>,
  ) {}

  async getUsers(achievementId: number) {
    const submissionList = await this.submissionRepository.find({
      relations: ['user', 'achievement'],
      where: { achievement: { id: achievementId } },
    });
    return submissionList.reduce((pre, submission) => {
      if (pre.includes(submission.user.id)) return pre;
      return [...pre, submission.user.id];
    }, []);
  }

  async getSubmission(id: number) {
    return await this.submissionRepository.find({
      relations: ['user'],
      where: { achievement: { id } },
    });
  }

  async getAll(acvId: number, userId: number) {
    const data = await this.submissionRepository.find({
      where: { user: userId, achievement: acvId },
      relations: ['user', 'achievement', 'criteria'],
    });
    const raw = data.filter(
      (item) => item.user.id === userId && item.achievement.id === acvId,
    );
    const result = [];
    for (const item of raw) {
      const newSub = {
        id: item.id,
        userId: item.user.id,
        achievementId: item.achievement.id,
        criteriaID: item.criteria.id,
        file: item.file,
        point: item.point,
        binary: item.binary,
        description: item.description,
        studentComment: item.studentComment,
        studentSelect: item.studentSelect,
      };

      result.push(newSub);
    }
    return result;
  }

  async get(examerId: number, achievementId: number) {
    return await this.submissionRepository.find({
      relations: ['achievement', 'criteria'],
      where: { achievement: { id: achievementId }, user: { id: examerId } },
    });
  }

  async getUserSubmission(userId: number) {
    return await this.submissionRepository.find({
      relations: ['user', 'achievement', 'criteria'],
      where: { user: { id: userId } },
    });
  }

  async getSubmissionExamer(
    id: number,
    page: number,
    limit: number,
    keyword?: string,
  ) {
    try {
      const newPage = page <= 0 ? 1 : page;
      const test = await getRepository(User)
        .createQueryBuilder('user')
        .select([
          'user.id',
          'user.email',
          'user.name',
          'user.surName',
          'user.mssv',
        ])
        .addSelect('department.name', 'department')
        .innerJoin(Achievement, 'achievement', `achievement.id = ${id}`)
        .innerJoin(
          Submission,
          'submission',
          `user.id = submission.user.id AND submission.achievement.id = ${id}`,
        )
        .innerJoin(
          Department,
          'department',
          'department.id = user.department.id',
        )
        .where(
          ` user.surName || ' ' || user.name ILIKE :fullName OR user.mssv ILIKE :mssv OR department.name ILIKE :department`,
          {
            fullName: `%${keyword}%`,
            mssv: `%${keyword}%`,
            department: `%${keyword}%`,
          },
        )
        .orderBy('submission.createdAt', 'ASC')
        .getRawMany();

      const testUnique = test.filter(
        (item, index, self) =>
          self.map((item) => item.user_id).indexOf(item.user_id) === index,
      );

      return {
        count: testUnique.length,
        examers: testUnique.slice((newPage - 1) * limit, page * limit),
      };
    } catch (error) {
      console.log(error.message);
    }
  }

  async add(data: SubmissionDto[]) {
    // console.log(data);
    data.map(async (submission: SubmissionDto) => {
      const newSub = this.submissionRepository.create(submission);
      newSub.user = this.userRepository.create({ id: submission.userId });
      newSub.achievement = this.achievementRepository.create({
        id: submission.achievementId,
      });
      newSub.criteria = this.criteriaRepository.create({
        id: submission.criteriaID,
      });
      try {
        await this.submissionRepository.save(newSub);
      } catch (error) {
        console.log('Crash', error.message);
      }
    });
    return 'Add success';
  }
}
