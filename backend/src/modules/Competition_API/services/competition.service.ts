import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompetitionCreateDto } from 'src/Dto/Competition/competitionCreate.dto';
import User from 'src/models/Achievement/user.entity';
import { Competition } from 'src/models/Competition/competition.entity';
import { ILike, Raw, Repository } from 'typeorm';

@Injectable()
export class CompetitionService extends TypeOrmQueryService<Competition> {
  constructor(
    @InjectRepository(Competition)
    private competitionRepository: Repository<Competition>,
  ) {
    super(competitionRepository, { useSoftDelete: true });
  }

  async getAll() {
    return await this.competitionRepository.find();
  }

  async create(competition: CompetitionCreateDto) {
    return await this.competitionRepository.save(competition);
  }

  async update(competition: CompetitionCreateDto, id: number) {
    let updatingCompetition = await this.competitionRepository.findOne(id);
    updatingCompetition = { ...updatingCompetition, ...competition };
    const result = await this.competitionRepository.save(updatingCompetition);
    return result;
  }

  async retrieve(id: number) {
    return await this.competitionRepository.findOne(id);
  }

  async delete(id: number) {
    return await this.competitionRepository.softDelete(id);
  }

  async getQuery(page: number, limit: number, keyword = '') {
    const newPage = page <= 0 ? 1 : page;
    const result = await this.competitionRepository.find({
      relations: ['auditors', 'auditorFinal'],
      where: {
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

  async getQueryAll(page: number, limit: number, keyword = '') {
    const newPage = page <= 0 ? 1 : page;
    const result = await this.competitionRepository.find({
      where: {
        name: ILike(`%${keyword}%`),
      },
      order: { createdAt: 'DESC' },
    });

    return {
      data: result.slice((newPage - 1) * limit, newPage * limit),
      count: result.length,
    };
  }
  async getQueryCheckAuditor(
    page: number,
    limit: number,
    keyword = '',
    user: User,
  ) {
    return { msg: 'Hello' };
  }
}
