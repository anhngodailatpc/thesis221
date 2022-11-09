import { Department } from '../../../models/Achievement/department.entity';
import { YouthBranch } from '../../../models/Achievement/youthBranch.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Repository, ILike } from 'typeorm';

@Injectable()
export class YouthBranchService extends TypeOrmQueryService<YouthBranch> {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(YouthBranch)
    private youthBranchRepository: Repository<YouthBranch>,
  ) {
    super(youthBranchRepository, { useSoftDelete: true });
  }

  async get(departmentCode: string, page: number, limit: number, keyword = '') {
    const newPage = page <= 0 ? 1 : page;
    const [result, total] = await this.youthBranchRepository.findAndCount({
      relations: ['departmentId'],
      join: {
        alias: 'youthBranch',
        innerJoin: { department: 'youthBranch.departmentId' },
      },
      where: (qb) => {
        qb.where({
          name: ILike(`%${keyword}%`),
        }).andWhere('department.code = :code', {
          code: departmentCode,
        });
      },
      order: { createdAt: 'ASC' },
      take: limit,
      skip: (newPage - 1) * limit,
    });

    return {
      data: result,
      count: total,
    };
  }

  async create(code: string, name: string) {
    const department = await this.departmentRepository.findOne({ code });
    if (!department)
      throw new HttpException('Đơn vị không tồn tại', HttpStatus.BAD_REQUEST);
    const newBranch = this.youthBranchRepository.create({
      name,
      departmentId: department,
    });
    return await this.youthBranchRepository.save(newBranch);
  }

  async update(code: string, id: string, name: string) {
    const youthBranch = await this.youthBranchRepository.findOne({
      relations: ['departmentId'],
      where: { id },
    });
    if (youthBranch.departmentId?.code !== code)
      throw new HttpException('Chi đoàn không tồn tại', HttpStatus.BAD_REQUEST);
    youthBranch.name = name;
    return await this.youthBranchRepository.save(youthBranch);
  }
}
