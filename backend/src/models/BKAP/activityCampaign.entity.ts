import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 } from 'uuid';
import Activity from './activity.entity';
import ActivityGroup from './activityGroup.entity';
@Entity()
export class ActivityCampaign {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ nullable: false })
  public name: string;

  @Column({ nullable: false })
  planStartDay: Date;

  @Column({ nullable: false })
  planEndDay: Date;

  @Column({ nullable: false })
  startDay: Date;

  @Column({ nullable: false })
  endDay: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => ActivityGroup, (group) => group.campaign)
  activityGroups: ActivityGroup[];

  @OneToMany(() => Activity, (activity) => activity.campaign)
  activities: Activity[];

  @BeforeInsert()
  addId() {
    this.id = v4();
  }
}

export default ActivityCampaign;
