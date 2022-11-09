import { StatusRegistration } from 'src/common/enum';
import { Activity } from 'src/models/BKAP/activity.entity';
import { User } from 'src/models/Achievement/user.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 } from 'uuid';

@Entity()
export class RegistrationActivity {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.activityRegistrations)
  user: User;

  @ManyToOne(() => Activity, (activity) => activity.id)
  activity: Activity;

  @Column({
    type: 'enum',
    enum: StatusRegistration,
    default: StatusRegistration.CANCEL,
  })
  status: StatusRegistration;

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

export default RegistrationActivity;
