import { User } from 'src/models/Achievement/user.entity';
import { StatusActivity } from 'src/common/enum';
import { Department } from 'src/models/Achievement/department.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 } from 'uuid';
import ActivityCampaign from './activityCampaign.entity';
import ActivityGroup from './activityGroup.entity';
@Entity()
export class Activity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ nullable: false })
  public name: string;

  @Column({
    type: 'enum',
    enum: StatusActivity,
    default: StatusActivity.CREATED,
  })
  status: StatusActivity;

  @Column({ nullable: true })
  noteStatus: string;

  @Column({ nullable: false })
  maximumParticipant: number;

  @ManyToOne(() => ActivityCampaign, (campaign) => campaign.activities)
  campaign: ActivityCampaign;

  @ManyToOne(() => User, (user) => user.id)
  creator: User;

  @ManyToOne(() => ActivityGroup, (group) => group.activities)
  activityGroup: ActivityGroup;

  @Column({ type: 'real', default: 0 })
  maximumCTXH: number;

  @Column({ nullable: false })
  registerStartDay: Date;

  @Column({ nullable: false })
  registerEndDay: Date;

  @Column({ nullable: false })
  startDay: Date;

  @Column({ nullable: false })
  endDay: Date;

  @ManyToMany(() => Department)
  @JoinTable()
  departments: Department[];

  @Column({ nullable: true })
  link: string;

  @Column({ nullable: true })
  content: string;

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

export default Activity;
