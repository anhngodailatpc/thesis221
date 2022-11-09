import { User } from 'src/models/Achievement/user.entity';
import { StatusActivity } from './../../../common/enum';
import { ActivityGroup } from './../../../models/BKAP/activityGroup.entity';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ActivityCampaign from 'src/models/BKAP/activityCampaign.entity';
import Activity from 'src/models/BKAP/activity.entity';
import { Department } from 'src/models/Achievement/department.entity';
import 'moment/locale/vi';
import { Repository, ILike } from 'typeorm';

@Injectable()
export class ActivityManageService extends TypeOrmQueryService<Activity> {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(ActivityGroup)
    private activityGroupRepository: Repository<ActivityGroup>,
    @InjectRepository(ActivityCampaign)
    private activityCampaignRepository: Repository<ActivityCampaign>,
  ) {
    super(activityRepository, { useSoftDelete: true });
  }

  async add(campaign: ActivityCampaign, data: any, user: User) {
    const startDay = new Date(data.startDay);
    const endDay = new Date(data.endDay);
    const registerStartDay = new Date(data.registerStartDay);
    const registerEndDay = new Date(data.registerEndDay);
    if (!(campaign.startDay < registerStartDay))
      throw new HttpException(
        `Ngày hoạt động mở đăng ký cho sinh viên phải từ sau ngày diễn ra đợt hoạt động (${String(
          campaign.startDay.getDate(),
        ).padStart(2, '0')}/${String(campaign.startDay.getMonth() + 1).padStart(
          2,
          '0',
        )}/${campaign.startDay.getFullYear()})`,
        HttpStatus.BAD_REQUEST,
      );
    if (!(registerStartDay < startDay))
      throw new HttpException(
        'Ngày hoạt động diễn ra phải từ sau ngày mở đăng ký cho sinh viên',
        HttpStatus.BAD_REQUEST,
      );
    if (!(registerEndDay < endDay))
      throw new HttpException(
        'Ngày hoạt động kết thúc phải sau ngày kết thúc mở đăng ký cho sinh viên',
        HttpStatus.BAD_REQUEST,
      );
    if (!(endDay < campaign.endDay))
      throw new HttpException(
        `Ngày hoạt động kết thúc muộn nhất là đến ngày kết thúc đợt hoạt động (${String(
          campaign.endDay.getDate(),
        ).padStart(2, '0')}/${String(campaign.endDay.getMonth() + 1).padStart(
          2,
          '0',
        )}/${campaign.endDay.getFullYear()})`,
        HttpStatus.BAD_REQUEST,
      );
    const newActivity = this.activityRepository.create({
      ...data,
      creator: user,
      campaign: this.activityCampaignRepository.create({ id: data.campaign }),
      activityGroup: this.activityGroupRepository.create({
        id: data.activityGroup,
      }),
      departments: data.departments.map(
        (item: { value: number; label: string }) =>
          this.departmentRepository.create({ id: item.value }),
      ),
    });
    return await this.activityRepository.save(newActivity);
  }

  async update(
    id: string,
    campaign: ActivityCampaign,
    data: any,
    userId: number,
  ) {
    await this.checkAddUpdate(id, userId);
    let findActivity = await this.activityRepository.findOne({ id });
    if (!findActivity)
      throw new HttpException(
        'Hoạt động không tồn tại',
        HttpStatus.BAD_REQUEST,
      );
    const startDay = new Date(data.startDay);
    const endDay = new Date(data.endDay);
    const registerStartDay = new Date(data.registerStartDay);
    const registerEndDay = new Date(data.registerEndDay);
    if (!(campaign.startDay < registerStartDay))
      throw new HttpException(
        `Ngày hoạt động mở đăng ký cho sinh viên phải từ sau ngày diễn ra đợt hoạt động (${String(
          campaign.startDay.getDate(),
        ).padStart(2, '0')}/${String(campaign.startDay.getMonth() + 1).padStart(
          2,
          '0',
        )}/${campaign.startDay.getFullYear()})`,
        HttpStatus.BAD_REQUEST,
      );
    if (!(registerStartDay < startDay))
      throw new HttpException(
        'Ngày hoạt động diễn ra phải từ sau ngày mở đăng ký cho sinh viên' +
          registerStartDay +
          startDay,
        HttpStatus.BAD_REQUEST,
      );
    if (!(registerEndDay < endDay))
      throw new HttpException(
        'Ngày hoạt động kết thúc phải sau ngày kết thúc mở đăng ký cho sinh viên',
        HttpStatus.BAD_REQUEST,
      );
    if (!(endDay < campaign.endDay))
      throw new HttpException(
        `Ngày hoạt động kết thúc muộn nhất là đến ngày kết thúc đợt hoạt động (${String(
          campaign.endDay.getDate(),
        ).padStart(2, '0')}/${String(campaign.endDay.getMonth() + 1).padStart(
          2,
          '0',
        )}/${campaign.endDay.getFullYear()})`,
        HttpStatus.BAD_REQUEST,
      );
    findActivity = {
      ...findActivity,
      ...data,
      endDay,
      campaign: this.activityCampaignRepository.create({ id: data.campaign }),
      activityGroup: this.activityGroupRepository.create({
        id: data.activityGroup,
      }),
      departments: data.departments.map(
        (item: { value: number; label: string }) =>
          this.departmentRepository.create({ id: item.value }),
      ),
    };
    return await this.activityRepository.save(findActivity);
  }

  async get(page: number, limit: number, keyword = '') {
    const data = await this.activityRepository.find({
      relations: ['departments', 'activityGroup', 'campaign', 'creator'],
      where: { name: ILike(`%${keyword}%`) },
      order: { createdAt: 'DESC' },
    });

    return data;
  }

  async getAll() {
    return await this.activityRepository.find({
      relations: ['departments', 'activityGroup', 'campaign', 'creator'],
    });
  }

  async checkAddUpdate(activityId: string, userId: number) {
    const findActivity = await this.getById(activityId);
    if (findActivity?.creator?.id != userId)
      throw new HttpException('Không đủ quyền hạn', HttpStatus.BAD_REQUEST);
  }

  async getAllWithGroupId(id: string) {
    const data = await this.activityRepository.find({
      relations: ['activityGroup'],
    });
    const result = data.filter((item) => item.activityGroup.id === id);
    return result;
  }
  async getById(id: string) {
    const activity = await this.activityRepository.findOne({
      where: { id },
      relations: ['departments', 'creator'],
    });
    if (!activity)
      throw new HttpException(
        'Hoạt động không tồn tại',
        HttpStatus.BAD_REQUEST,
      );
    return activity;
  }

  async updateStatus(data: { id: string; status: string; noteStatus: string }) {
    const dataActivity = await this.activityRepository.findOne({ id: data.id });
    if (!dataActivity)
      throw new HttpException(
        'Hoạt động không tồn tại',
        HttpStatus.BAD_REQUEST,
      );
    dataActivity.status = StatusActivity[data.status];
    dataActivity.noteStatus = data.noteStatus;
    return await this.activityRepository.save(dataActivity);
  }

  async delActivity(id: string) {
    const activity = await this.activityRepository.findOne(id);
    if (['NOPASS', 'CREATED'].includes(activity.status)) {
      await this.activityRepository.softDelete(id);
      return true;
    }
    return false;
  }
}
