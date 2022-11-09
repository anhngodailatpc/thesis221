import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ActivityCampaign from 'src/models/BKAP/activityCampaign.entity';
import ActivityGroup from 'src/models/BKAP/activityGroup.entity';
import { ActivityGroupDto } from 'src/Dto/activityGroup.dto';
import { ILike, Raw, Repository } from 'typeorm';
import { ActivityManageService } from './activityManage.service';

@Injectable()
export class ActivityGroupService extends TypeOrmQueryService<ActivityGroup> {
  constructor(
    @InjectRepository(ActivityGroup)
    private activityGroupRepository: Repository<ActivityGroup>,
    @InjectRepository(ActivityCampaign)
    private activityCampaignRepository: Repository<ActivityCampaign>,
    private activityService: ActivityManageService,
  ) {
    super(activityGroupRepository, { useSoftDelete: true });
  }

  async add(newGroup: ActivityGroupDto) {
    const newG = this.activityGroupRepository.create(newGroup);
    newG.campaign = this.activityCampaignRepository.create({
      id: newGroup.campaignId,
    });
    const savedItem = await this.activityGroupRepository.save(newG);
    const item = await this.activityGroupRepository.findOne(savedItem.id, {
      relations: ['campaign'],
    });
    return {
      id: item.id,
      name: item.name,
      maximumActivity: item.maximumActivity,
      campaignId: item.campaign.id,
      campaignName: item.campaign.name,
      updatedAt: item.updatedAt,
    };
  }

  async getAll() {
    const data = await this.activityGroupRepository.find({
      relations: ['campaign'],
    });
    const result = data.map((item) => {
      return {
        id: item.id,
        name: item.name,
        maximumActivity: item.maximumActivity,
        campaignId: item.campaign.id,
        campaignName: item.campaign.name,
        updatedAt: item.updatedAt,
      };
    });
    return result;
  }

  async getAllWithFilter(dirtyPage: number, limit: number, keyword = '') {
    const page = dirtyPage <= 0 ? 1 : dirtyPage;
    const data = await this.activityGroupRepository.find({
      relations: ['campaign'],
      where: {
        name: ILike(`%${keyword}%`),
      },
      order: {
        createdAt: 'DESC',
      },
    });
    const result = data.map((item) => {
      return {
        id: item.id,
        name: item.name,
        maximumActivity: item.maximumActivity,
        campaignId: item.campaign.id,
        campaignName: item.campaign.name,
        updatedAt: item.updatedAt,
      };
    });
    return {
      data: result.slice((page - 1) * limit, page * limit),
      count: result.length,
    };
  }

  async getAllWithCampaignId(id: string) {
    const data = await this.activityGroupRepository.find({
      relations: ['campaign'],
    });

    const result = data.filter((item) => item.campaign.id === id);
    return result;
  }

  async modify(group: ActivityGroupDto) {
    const updatedItem = await this.activityGroupRepository.save({
      id: group.id,
      name: group.name,
      maximumActivity: group.maximumActivity,
      campaign: this.activityCampaignRepository.create({
        id: group.campaignId,
      }),
    });
    const item = await this.activityGroupRepository.findOne(updatedItem.id, {
      relations: ['campaign'],
    });
    return {
      id: item.id,
      name: item.name,
      maximumActivity: item.maximumActivity,
      campaignId: item.campaign.id,
      campaignName: item.campaign.name,
      updatedAt: item.updatedAt,
    };
  }

  async delGroup(id: string) {
    const data = await this.activityService.getAllWithGroupId(id);
    if (data.length > 0) {
      return data;
    } else {
      await this.activityGroupRepository.softDelete(id);
      return [];
    }
  }
}
