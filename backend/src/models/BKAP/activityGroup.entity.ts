import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 } from 'uuid';
import Activity from './activity.entity';
import ActivityCampaign from './activityCampaign.entity';
@Entity()
export class ActivityGroup {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ nullable: false })
  public name: string;

  @Column({ nullable: false })
  maximumActivity: number;

  @ManyToOne(() => ActivityCampaign, (campaign) => campaign.activityGroups)
  campaign: ActivityCampaign;

  @OneToMany(() => Activity, (activity) => activity.activityGroup)
  activities: Activity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @BeforeInsert()
  addId() {
    this.id = v4();
  }
}

export default ActivityGroup;
