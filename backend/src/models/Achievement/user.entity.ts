import { Role } from '../../common/enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Department } from './department.entity';
import { Achievement } from './achievement.entity';
import { Submission } from './submission.entity';
import { YouthBranch } from './youthBranch.entity';
import ContactInfo from './contactInfo.entity';
import ActivityRegistration from 'src/models/BKAP/registration.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public email: string;

  @Column({ nullable: true })
  public name: string;

  @Column({ nullable: true })
  public surName: string;

  @Column({ nullable: true })
  public mssv: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.PARTICIPANT,
  })
  role: Role;

  @Column({ default: false })
  public isRegisteredWithGoogle: boolean;

  @Column({ default: false })
  public isUpdatedInformation: boolean;

  @Column({ default: false })
  public hasContactInfo: boolean;

  @ManyToOne(() => YouthBranch, (youthBranch) => youthBranch.id)
  public youthUnionId: YouthBranch;

  @Column({
    nullable: true,
  })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Department, (department) => department.users)
  department: Department;

  @ManyToOne(() => Achievement, (achievement) => achievement.auditors)
  auditors: Achievement;

  @OneToOne(() => ContactInfo, (contactInfo) => contactInfo.id)
  contactInfoId: ContactInfo;

  @OneToMany(() => Submission, (submission) => submission.user)
  submissions: Submission[];

  @OneToMany(
    () => ActivityRegistration,
    (activityRegistration) => activityRegistration.user,
  )
  activityRegistrations: ActivityRegistration[];

  @DeleteDateColumn()
  deletedAt?: Date;
}

export default User;
