import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ActivityCampaign from 'src/models/BKAP/activityCampaign.entity';
import { ILike, Raw, Repository } from 'typeorm';
import { ActivityGroupService } from './activityGroup.service';

@Injectable()
export class ActivityCampaignService extends TypeOrmQueryService<ActivityCampaign> {
  constructor(
    @InjectRepository(ActivityCampaign)
    private activityCampaignRepository: Repository<ActivityCampaign>,
    private activityGroupService: ActivityGroupService,
  ) {
    super(activityCampaignRepository, { useSoftDelete: true });
  }

  async add(newCampaign: ActivityCampaign) {
    const item = await this.activityCampaignRepository.save(newCampaign);
    return {
      id: item.id,
      name: item.name,
      planStartDay: item.planStartDay,
      planEndDay: item.planEndDay,
      startDay: item.startDay,
      endDay: item.endDay,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  async getCampaignById(id: string) {
    const data = await this.activityCampaignRepository.findOne({
      id,
    });
    if (!data)
      throw new HttpException(
        'Đợt hoạt động không tồn tại',
        HttpStatus.BAD_REQUEST,
      );
    return data;
  }

  async getAll() {
    const data = await this.activityCampaignRepository.find({
      order: {
        endDay: 'DESC',
      },
    });
    const returnData = data.map((item) => {
      return {
        id: item.id,
        name: item.name,
        planStartDay: item.planStartDay,
        planEndDay: item.planEndDay,
        startDay: item.startDay,
        endDay: item.endDay,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });
    return returnData;
  }

  async getAllActive() {
    const data = await this.activityCampaignRepository.find({
      where: {
        endDay: Raw((alias) => `${alias} > NOW()`),
      },
      order: {
        endDay: 'DESC',
      },
    });
    const returnData = data.map((item) => {
      return {
        id: item.id,
        name: item.name,
        planStartDay: item.planStartDay,
        planEndDay: item.planEndDay,
        startDay: item.startDay,
        endDay: item.endDay,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });
    return returnData;
  }

  async getAllWithFilter(dirtyPage: number, limit: number, keyword = '') {
    const page = dirtyPage <= 0 ? 1 : dirtyPage;
    const data = await this.activityCampaignRepository.find({
      where: {
        name: ILike(`%${keyword}%`),
        // endDay: Raw((alias) => `${alias} > NOW()`),
      },
      order: {
        endDay: 'DESC',
      },
    });
    const result = data.map((item) => {
      return {
        id: item.id,
        name: item.name,
        planStartDay: item.planStartDay,
        planEndDay: item.planEndDay,
        startDay: item.startDay,
        endDay: item.endDay,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });
    return {
      data: result.slice((page - 1) * limit, page * limit),
      count: result.length,
    };
  }

  async modify(campaign: ActivityCampaign) {
    const item = await this.activityCampaignRepository.save({
      id: campaign.id,
      name: campaign.name,
      planStartDay: campaign.planStartDay,
      planEndDay: campaign.planEndDay,
      startDay: campaign.startDay,
      endDay: campaign.endDay,
    });
    return {
      id: item.id,
      name: item.name,
      planStartDay: item.planStartDay,
      planEndDay: item.planEndDay,
      startDay: item.startDay,
      endDay: item.endDay,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  async delCampaign(id: string) {
    const data = await this.activityGroupService.getAllWithCampaignId(id);
    if (data.length > 0) return data;
    await this.activityCampaignRepository.softDelete(id);
    return [];
  }
}
