import { User } from './../Achievement/user.entity';
import { Lock } from '../../common/enum';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';

import { CompetitionCriteria } from './comCriteria.entity';
import { Exclude } from 'class-transformer';
@Entity()
export class Competition {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ default: 0 })
  softCriteria: number;

  @Column({ nullable: true })
  description: string;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  endAt: Date;

  @UpdateDateColumn()
  startAt: Date;

  @Column({
    type: 'enum',
    enum: Lock,
    default: Lock.UNAVAILABLE,
  })
  lock: Lock;

  @OneToMany(() => CompetitionCriteria, (criteria) => criteria.competition, {
    cascade: true,
  })
  criteria: CompetitionCriteria[];

  // @OneToMany(() => Result, (result) => result.achievement, {
  //   cascade: true,
  // })
  // results: Result[];

  @OneToMany(() => User, (user) => user.id, {
    cascade: true,
  })
  auditors: User[];

  @ManyToOne(() => User, (user) => user.id)
  auditorFinal: User;

  @Exclude()
  @DeleteDateColumn()
  deletedAt?: Date;
}
