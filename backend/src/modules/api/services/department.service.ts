import { DepartmentDto } from 'src/Dto/department.dto';
import { YouthBranchDto } from './../../../Dto/department.dto';
import { Department } from './../../../models/Achievement/department.entity';
import { YouthBranch } from './../../../models/Achievement/youthBranch.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, getRepository } from 'typeorm';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';

@Injectable()
export class DepartmentService extends TypeOrmQueryService<Department> {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(YouthBranch)
    private youthBranchRepository: Repository<YouthBranch>,
  ) {
    super(departmentRepository, { useSoftDelete: true });
  }

  async getAll() {
    return await this.departmentRepository.find({
      relations: ['youthBranch'],
      order: { createdAt: 'ASC' },
    });
  }

  async get(page: number, limit: number, keyword = '') {
    const newPage = page <= 0 ? 1 : page;
    const data = await getRepository(Department)
      .createQueryBuilder('department')
      .select([
        'department.id AS id',
        'department.name AS name',
        'department.code AS code',
      ])
      .where(` department.code ILIKE :code OR department.name ILIKE :name`, {
        code: `%${keyword}%`,
        name: `%${keyword}%`,
      })
      .orderBy('department.createdAt', 'ASC')
      .getRawMany();

    return {
      data: data.slice((newPage - 1) * limit, page * limit),
      count: data.length,
    };
  }

  async getDepartment(params: object) {
    const department = await this.departmentRepository.findOne(params);
    if (!department) throw { code: 'DEPARTMENT_NOT_FOUND' };
    return department;
  }

  // async findYouthBranch(name: string) {
  //   const result = await this.youthBranchRepository.findOne({
  //     name: youthBranch.name,
  //   });
  //   if (result) throw { code: 'YOUTH_BRANCH_FOUNDED' };
  // }

  async addDepartmentList(departmentDto: DepartmentDto[]) {
    try {
      return await Promise.all(
        departmentDto.map(async (department: DepartmentDto) => {
          const data = await this.departmentRepository.findOne({
            code: department.code,
          });
          if (data) return data;
          return await this.departmentRepository.save({
            code: department.code,
            name: department.name,
          });
        }),
      );
    } catch (error: any) {
      console.error(error.message);
    }
  }

  async addDepartment(departmentDto: DepartmentDto) {
    const department = await this.departmentRepository.findOne({
      code: departmentDto.code,
    });
    if (department)
      throw new HttpException(
        'Không thể trùng Mã đơn vị',
        HttpStatus.BAD_REQUEST,
      );
    return await this.departmentRepository.save({
      code: departmentDto.code,
      name: departmentDto.name,
    });
  }

  async addYouthBranchList(youthBranchList: DepartmentDto[]) {
    try {
      return await Promise.all(
        youthBranchList.map(async (youthBranch: DepartmentDto) => {
          const result = await this.youthBranchRepository.findOne({
            name: youthBranch.name,
          });
          if (result) return;
          const department = await this.getDepartment({
            code: youthBranch.code,
          });
          if (!department) return;
          const newBranch = this.youthBranchRepository.create({
            name: youthBranch.name,
            departmentId: department,
          });
          return await this.youthBranchRepository.save(newBranch);
        }),
      );
    } catch (error: any) {
      console.error(error.message);
    }
  }

  async addYouthBranch(codeDepartment: string, youthBranch: YouthBranchDto) {
    try {
      const result = await this.youthBranchRepository.findOne({
        name: youthBranch.name,
      });
      if (result) throw { code: 'YOUTH_BRANCH_FOUNDED' };
      const department = await this.getDepartment({ code: codeDepartment });
      const newBranch = this.youthBranchRepository.create({
        name: youthBranch.name,
        departmentId: department,
      });
      return await this.youthBranchRepository.save(newBranch);
    } catch (error: any) {
      console.error(error.message);
    }
  }

  // async add(department: DepartmentDto[]) {
  //   return await Promise.all(
  //     department.map(async (element: DepartmentDto) => {
  //       const data = await this.departmentRepository.findOne({
  //         id: element.id,
  //       });

  //       let newDepartment: Department;
  //       if (data) {
  //         newDepartment = await this.departmentRepository.save({
  //           ...data,
  //           ...element,
  //         });
  //       } else {
  //         newDepartment = await this.departmentRepository.save(element);
  //       }
  //       const youthBranchList = await Promise.all(
  //         element.youthBranch.map(async (item: YouthBranchDto) => {
  //           return await this.addOrUpdateYouthBranch(item, newDepartment);
  //         }),
  //       );

  //       return {
  //         ...newDepartment,
  //         youthBranch: youthBranchList,
  //       };
  //     }),
  //   );
  // }

  // async addOrUpdateYouthBranch(
  //   youthBranch: YouthBranchDto,
  //   department: Department,
  // ) {
  //   const data = await this.youthBranchRepository.findOne(youthBranch.id);
  //   if (data) {
  //     return await this.youthBranchRepository.save({
  //       ...data,
  //       ...youthBranch,
  //       departmentId: department,
  //     });
  //   }
  //   return await this.youthBranchRepository.save({
  //     ...youthBranch,
  //     departmentId: department,
  //   });
  // }

  async update(id: number, departmentDto: any): Promise<Department> {
    const department = await this.departmentRepository.findOne(id);
    if (!department)
      throw new HttpException('Khoa không tồn tại', HttpStatus.BAD_REQUEST);
    if (department.code !== departmentDto.code) {
      const isExit = await this.departmentRepository.findOne({
        code: departmentDto.code,
      });
      if (isExit)
        throw new HttpException(
          'Không thể trùng Mã đơn vị',
          HttpStatus.BAD_REQUEST,
        );
    }
    return await this.departmentRepository.save({
      ...department,
      ...departmentDto,
    });
  }

  async delete(id: number): Promise<DeleteResult> {
    const department: Department = await this.departmentRepository.findOne(id);
    if (!department) throw { code: 'DEPARTMENT_NOT_FOUND' };
    return await this.departmentRepository.softDelete(id);
  }
}
