import { TypeOb } from './../../common/enum';
import { User } from './user.entity';
import { Submission } from './submission.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Result } from './result.entity';

@Entity()
export class ResultOfCriteria {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public result: boolean;

  @Column({ nullable: true })
  public description: string;

  @Column({
    type: 'enum',
    enum: TypeOb,
    default: TypeOb.ACHIEVEMENT,
  })
  type: TypeOb;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Result, (result) => result.resultOfCriteria)
  resultAchievement: Result;

  @ManyToOne(() => Submission, (submission) => submission.id)
  submission: Submission;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}

export default ResultOfCriteria;
