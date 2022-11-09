import { ContactInfo } from './../../../models/Achievement/contactInfo.entity';
import { Department } from 'src/models/Achievement/department.entity';
import { StatusActivity } from './../../../common/enum';
import { User } from './../../../models/Achievement/user.entity';
import { RegistrationActivity } from '../../../models/BKAP/registration.entity';
import { StatusRegistration } from '../../../common/enum';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Activity from 'src/models/BKAP/activity.entity';
import 'moment/locale/vi';
import { Repository, ILike, getRepository, Not, Raw } from 'typeorm';

@Injectable()
export class ActivityRegistrationService extends TypeOrmQueryService<RegistrationActivity> {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    @InjectRepository(RegistrationActivity)
    private registrationRepository: Repository<RegistrationActivity>,
  ) {
    super(registrationRepository, { useSoftDelete: true });
  }

  async get(page: number, limit: number, keyword = '', department: any) {
    const newPage = page <= 0 ? 1 : page;
    const data = await this.activityRepository.find({
      relations: ['departments', 'activityGroup', 'campaign', 'creator'],
      where: {
        name: ILike(`%${keyword}%`),
        registerEndDay: Raw((alias) => `${alias} >= NOW()`),
      },
      order: { createdAt: 'DESC' },
    });
    // ---------------------------------------------------------------------------------
    const filterData = data.filter(
      (item) =>
        item.departments.find((temp) => temp.id === department.id) &&
        [StatusActivity.PASS, StatusActivity.PASSCONDITION].includes(
          item.status,
        ),
    );

    return {
      data: filterData.slice((newPage - 1) * limit, page * limit),
      count: filterData.length,
    };
  }

  async getHistory(page: number, limit: number, keyword = '', department: any) {
    const newPage = page <= 0 ? 1 : page;
    const data = await this.activityRepository.find({
      relations: ['departments', 'activityGroup', 'campaign'],
      where: {
        name: ILike(`%${keyword}%`),
        endDay: Raw((alias) => `${alias} < NOW()`),
      },
      order: { createdAt: 'DESC' },
    });
    // ---------------------------------------------------------------------------------
    const filterData = data.filter(
      (item) =>
        item.departments.find((temp) => temp.id === department.id) &&
        [StatusActivity.PASS, StatusActivity.PASSCONDITION].includes(
          item.status,
        ),
    );

    return {
      data: filterData.slice((newPage - 1) * limit, page * limit),
      count: filterData.length,
    };
  }

  async getResult(id: number) {
    return await this.registrationRepository.find({
      relations: ['activity'],
      where: { user: { id } },
    });
  }

  async getQuery(page: number, limit: number, keyword = '', id: string) {
    const newPage = page <= 0 ? 1 : page;
    const data = await getRepository(RegistrationActivity)
      .createQueryBuilder('registration')
      .select([
        'registration.id AS registrationid',
        'registration.status AS status',
      ])
      .addSelect([
        'user.name AS name',
        'user.surName AS surname',
        'user.email AS email',
        'user.mssv AS mssv',
      ])
      .addSelect([
        'activity.id AS activityid',
        'activity.maximumParticipant AS max',
      ])
      .addSelect('department.name', 'departmentName')
      .addSelect('info.phone', 'phone')
      .innerJoin(User, 'user', `registration.user.id = user.id`)
      .innerJoin(Activity, 'activity', `registration.activity.id = activity.id`)
      .innerJoin(Department, 'department', 'department.id = user.department.id')
      .innerJoin(ContactInfo, 'info', 'info.user.id = user.id')
      .where(
        ` registration.activity.id = :id AND (user.surName ILIKE :surname OR user.name ILIKE :name OR user.mssv ILIKE :mssv OR department.name ILIKE :department)`,
        {
          id,
          surname: `%${keyword}%`,
          name: `%${keyword}%`,
          mssv: `%${keyword}%`,
          department: `%${keyword}%`,
        },
      )
      .orderBy('registration.createdAt', 'ASC')
      .getRawMany();

    return {
      count: data.length,
      data: data.slice((newPage - 1) * limit, page * limit),
    };
  }

  async updateRegistration(id: string, status: string) {
    const findRegistration = await this.registrationRepository.findOne({ id });
    if (!findRegistration)
      throw new HttpException(
        'Người dùng không đăng ký',
        HttpStatus.BAD_REQUEST,
      );
    findRegistration.status = StatusRegistration[status];
    return await this.registrationRepository.save(findRegistration);
  }

  async getRegistered(id: string) {
    return await this.registrationRepository.find({
      relations: ['activity', 'user'],
      where: { activity: { id }, status: Not(StatusRegistration.CANCEL) },
    });
  }

  async updateExcel(data: string[]) {
    return await Promise.all(
      data.map(async (id) => {
        const findRegistration = await this.registrationRepository.findOne({
          id,
        });
        if (!findRegistration) return '';
        findRegistration.status = StatusRegistration.PASS;
        return await this.registrationRepository.save(findRegistration);
      }),
    );
  }

  async update(status: string, user: User, activity: Activity) {
    const findRegistration = await this.registrationRepository.findOne({
      where: { activity: { id: activity.id }, user: { id: user.id } },
    });

    if (findRegistration) {
      findRegistration.status = StatusRegistration[status];
      return await this.registrationRepository.save(findRegistration);
    }

    const newRegistration = this.registrationRepository.create({
      user,
      status: StatusRegistration[status],
      activity,
    });
    return await this.registrationRepository.save(newRegistration);
  }

  async QRReg(status: string, user: User, activity: Activity) {
    const findRegistration = await this.registrationRepository.findOne({
      where: { activity: { id: activity.id }, user: { id: user.id } },
    });

    if (findRegistration) {
      if (findRegistration.status === StatusRegistration[status]) {
        return false;
      } else {
        findRegistration.status = StatusRegistration[status];
        await this.registrationRepository.save(findRegistration);
        return true;
      }
    }

    const newRegistration = this.registrationRepository.create({
      user,
      status: StatusRegistration[status],
      activity,
    });
    await this.registrationRepository.save(newRegistration);
    return true;
  }
}
