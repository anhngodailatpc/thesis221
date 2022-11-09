import { Department } from 'src/models/Achievement/department.entity';
import { Submission } from 'src/models/Achievement/submission.entity';
import { Role } from './../../../common/enum';
import { Auditors } from './../../../Dto/auditor.dto';
import { ContactInfo } from './../../../models/Achievement/contactInfo.entity';
import {
  HttpException,
  HttpStatus,
  Injectable,
  // InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Connection,
  In,
  DeleteResult,
  Like,
  Not,
  ILike,
  getRepository,
} from 'typeorm';
import User from 'src/models/Achievement/user.entity';
import * as bcrypt from 'bcrypt';

import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';

@Injectable()
export class UsersService extends TypeOrmQueryService<User> {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(ContactInfo)
    private contactInfoRepository: Repository<ContactInfo>,
    private connection: Connection,
  ) {
    super(usersRepository, { useSoftDelete: true });
  }

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({ email });
    if (user) {
      return user;
    }
    throw new HttpException('Tài khoản không tồn tại ', HttpStatus.NOT_FOUND);
  }

  async checkAndCreateUser(auditors: Auditors[]) {
    return await Promise.all(
      auditors.map(async (user) => {
        const findUser: User = await this.getByEmail(user.label);
        if (findUser.role === Role.ADMIN)
          throw new HttpException(
            'không thể phân admin vào hội đồng xét duyệt',
            HttpStatus.BAD_REQUEST,
          );
        return findUser;
      }),
    );
  }

  async getAll(keyword?: string, except?: string) {
    if (keyword !== undefined) {
      if (keyword === '') keyword = '2309u4wejjsdflkjs';
      const [result, total] = await this.usersRepository.findAndCount({
        where: { email: Like(`%${keyword}%`) },
        order: { createdAt: 'ASC' },
      });
      return result;
    }
    if (except !== undefined) {
      return await this.usersRepository.find({
        where: { role: Not(except) },
        order: { createdAt: 'ASC' },
      });
    }
    return await this.usersRepository.find();
  }

  async getByIds(ids: number[]) {
    return this.usersRepository.find({
      where: { id: In(ids) },
    });
  }

  async getById(id: number) {
    try {
      const user = await this.usersRepository.findOne({
        relations: ['department', 'youthUnionId'],
        where: { id },
      });
      const info = await this.contactInfoRepository.findOne({
        where: { user: { id } },
      });
      if (user) {
        user.contactInfoId = info;
        return user;
      }
    } catch (error: any) {
      console.log(error.message);
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getByMssv(mssv: string) {
    try {
      const user = await this.usersRepository.findOne({
        relations: ['department', 'youthUnionId'],
        where: { mssv },
      });
      const info = await this.contactInfoRepository.findOne({
        where: { user: { id: user?.id } },
      });
      if (user) {
        user.contactInfoId = info;
        return user;
      }
    } catch (error: any) {
      console.log(error.message);
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getUserSubmission(
    achievement: number,
    page: number,
    limit: number,
    keyword = '',
  ) {
    const newPage = page <= 0 ? 1 : page;
    const data = await getRepository(User)
      .createQueryBuilder('user')
      .select([
        'user.id AS id',
        'user.name AS name',
        'user.surName AS surName',
        'user.email AS email',
        'user.mssv AS mssv',
      ])
      .addSelect('department.name', 'department')
      .addSelect('submission.updatedAt', 'updatedAt')
      .innerJoin(
        Submission,
        'submission',
        `submission.user.id = user.id AND submission.achievement.id = ${achievement}`,
      )
      .innerJoin(Department, 'department', `department.id = user.department.id`)
      .where(
        ` user.surName || ' ' || user.name ILIKE :fullName OR user.mssv ILIKE :mssv OR user.email ILIKE :email OR department.name ILIKE :department`,
        {
          fullName: `%${keyword}%`,
          mssv: `%${keyword}%`,
          email: `%${keyword}%`,
          department: `%${keyword}%`,
        },
      )
      .orderBy('submission.updatedAt', 'DESC')
      .getRawMany();

    const dataUnique = data.filter(
      (item, index, self) =>
        self.map((item) => item.id).indexOf(item.id) === index,
    );

    return {
      data: dataUnique.slice((newPage - 1) * limit, page * limit),
      count: dataUnique.length,
    };
  }

  async getUserUnit(
    page: number,
    limit: number,
    keyword = '',
    codeDepartment: string,
    role = Role.PARTICIPANT,
  ) {
    const newPage = page <= 0 ? 1 : page;
    const data = await getRepository(User)
      .createQueryBuilder('user')
      .select([
        'user.id AS id',
        'user.name AS name',
        'user.surName AS surName',
        'user.email AS email',
        'user.mssv AS mssv',
      ])
      .addSelect('department.name', 'department')
      .innerJoin(Department, 'department', `department.id = user.department.id`)
      .where(
        `department.code = :codeDepartment AND user.role = :role AND (user.surName || ' ' || user.name ILIKE :fullName OR user.mssv ILIKE :mssv OR user.email ILIKE :email) `,
        {
          fullName: `%${keyword}%`,
          mssv: `%${keyword}%`,
          email: `%${keyword}%`,
          codeDepartment: codeDepartment,
          role: role,
        },
      )
      .orderBy('user.updatedAt', 'DESC')
      .getRawMany();

    const dataUnique = data.filter(
      (item, index, self) =>
        self.map((item) => item.id).indexOf(item.id) === index,
    );

    return {
      data: dataUnique.slice((newPage - 1) * limit, page * limit),
      count: dataUnique.length,
    };
  }

  async createWithGoogle(email: string, name: string) {
    try {
      const newUser = this.usersRepository.create({
        email,
        name,
        isRegisteredWithGoogle: true,
      });
      return await this.usersRepository.save(newUser);
    } catch (error) {
      console.log('Error creating user with google', error.message);
      throw new error();
    }
  }

  async createAdminWithGoogle(email: string, name: string) {
    try {
      const newUser = this.usersRepository.create({
        email,
        name,
        role: Role.ADMIN,
        isRegisteredWithGoogle: true,
      });
      return await this.usersRepository.save(newUser);
    } catch (error) {
      console.log('Error creating admin with google', error.message);
      throw new error();
    }
  }

  async update(id: number, manager: any) {
    try {
      //console.log(manager);
      if (manager.role === Role.PARTICIPANT) {
        await this.usersRepository.save({
          id: id,
          role: manager.role,
          isUpdatedInformation: false,
        });
      } else {
        await this.usersRepository.save({ id: id, role: manager.role });
      }
      return this.usersRepository.findOne(id);
    } catch (error) {
      console.log(error.message);
    }
  }

  async allowUpdate(id: number) {
    try {
      const user = await this.usersRepository.findOne(id);

      await this.usersRepository.save({
        id: id,
        email: user.email,
        isUpdatedInformation: false,
      });

      return this.usersRepository.findOne(id);
    } catch (error) {
      console.log(error.message);
    }
  }

  async create(email: string, role: Role) {
    try {
      const user = await this.usersRepository.findOne({ email });

      if (user) {
        if (role === Role.PARTICIPANT) {
          await this.usersRepository.save({
            id: user.id,
            role: role,
            isUpdatedInformation: false,
          });
        } else {
          await this.usersRepository.save({ id: user.id, role: role });
        }
        return { ...user, role: role };
      } else return await this.usersRepository.save({ email, role });
    } catch (error: any) {
      try {
        const user = await this.findDeletedWithEmail(email);
        if (user.length === 0) return null;
        await this.usersRepository.save({
          id: user[0].id,
          role: role,
          deletedAt: null,
        });
        return { ...user[0], role: role };
      } catch (e: any) {
        console.log('Error when restoring user', e.message);
      }
      console.error('error in user create service:', error.message);
    }
  }

  // async createSV(id: number, info: ContactInfo) {
  //   try {
  //     await this.update(id, info);
  //     const contactInfo = this.contactInfoRepository.create({
  //       user: this.usersRepository.create({ id }),
  //       ...info,
  //     });
  //     return await this.contactInfoRepository.save(contactInfo);
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }

  async createInfoSV(user: User, info: any) {
    try {
      //console.log('Info create: ', info);
      const contactInfo = this.contactInfoRepository.create({
        user: user,
        ...info,
      });
      await this.usersRepository.update(user.id, {
        hasContactInfo: true,
      });
      return await this.contactInfoRepository.save(contactInfo);
    } catch (error) {
      console.log('Error creating info student:', error.message);
    }
  }

  async getContactinfo(id: number) {
    try {
      const data = await this.contactInfoRepository.find({
        relations: ['user'],
      });

      return data.filter((item) => item.user !== null && item.user.id === id);
    } catch (err: any) {
      console.log('Error get contact data:', err);
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getUserWithDY(userId: number) {
    try {
      const data = await this.usersRepository.find({
        relations: ['department', 'youthUnionId'],
      });
      return data.filter((item) => item.id === userId);
    } catch (err: any) {
      console.log(
        'Error getting user data with department and youth union: ',
        err,
      );
    }
  }

  async createInfoTeacher(user: User, info: any) {
    try {
      //console.log('Info create: ', info);
      const contactInfo = this.contactInfoRepository.create({
        user: user.id,
        ...info,
      });
      await this.usersRepository.update(user.id, {
        hasContactInfo: true,
      });
      return await this.contactInfoRepository.save(contactInfo);
    } catch (error) {
      console.log('Error when creating info teacher', error);
    }
  }

  async updateInfo(user: User, info: any) {
    try {
      //console.log(user);
      //console.log(info);
      await this.contactInfoRepository.update(info.id, info);
      return await this.usersRepository.save(user);
    } catch (error) {
      console.log('error updating user', error.message);
    }
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    try {
      const user = await this.getById(userId);

      const isRefreshTokenMatching = await bcrypt.compare(
        refreshToken,
        user.currentHashedRefreshToken,
      );

      if (isRefreshTokenMatching) {
        return user;
      }
    } catch (error: any) {
      throw new HttpException(
        'Đã có lỗi xảy ra,vui lòng đăng nhập lại!',
        HttpStatus.CONFLICT,
      );
      console.log(error.message);
    }
  }

  async removeRefreshToken(userId: number) {
    return this.usersRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }

  async delete(id: number): Promise<DeleteResult> {
    try {
      const deletingUser: User = await this.usersRepository.findOne(id);
      if (!deletingUser) throw { code: 'USER_NOT_FOUND' };
      return await this.usersRepository.softDelete(id);
    } catch (error: any) {
      console.error(error.message);
    }
  }
  async getQuery(page: number, limit: number, keyword = '', except = '') {
    const newPage = page <= 0 ? 1 : page;
    const [result, total] = await this.usersRepository.findAndCount({
      where: [
        { name: ILike(`%${keyword}%`), role: Not(except) },
        { email: ILike(`%${keyword}%`), role: Not(except) },
        { surName: ILike(`%${keyword}%`), role: Not(except) },
      ],
      order: { createdAt: 'ASC' },
      take: limit,
      skip: (newPage - 1) * limit,
    });
    return {
      data: result,
      count: total,
    };
  }

  async getQueryUser(
    page: number,
    limit: number,
    keyword = '',
    role = Role.PARTICIPANT,
  ) {
    const newPage = page <= 0 ? 1 : page;
    const [result, total] = await this.usersRepository.findAndCount({
      where: [
        { name: ILike(`%${keyword}%`), role: role },
        { email: ILike(`%${keyword}%`), role: role },
        { surName: ILike(`%${keyword}%`), role: role },
      ],
      order: { updatedAt: 'DESC' },
      take: limit,
      skip: (newPage - 1) * limit,
    });
    return {
      data: result,
      count: total,
    };
  }

  async countRow(): Promise<User[]> {
    return await this.usersRepository.query('SELECT * FROM public.user');
  }
  async findDeletedWithEmail(email: string): Promise<User[]> {
    return await this.usersRepository.find({
      where: { email: email },
      withDeleted: true,
    });
  }
}
