import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';
import { v4 } from 'uuid';

import User from '../Achievement/user.entity';
import { Competition } from './competition.entity';
import { CompetitionCriteria } from './comCriteria.entity';

@Entity()
export class CompetitionSubmission {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Competition, (competition) => competition.id, {
    onDelete: 'CASCADE',
  })
  competition: Competition;

  @ManyToOne(() => CompetitionCriteria, (crit) => crit.id, {
    onDelete: 'CASCADE',
  })
  comCriteria: CompetitionCriteria;

  @Column()
  file: string;

  @Column({ type: 'real', default: 0 })
  point: number;

  @Column()
  description: string;

  @Column({ default: '' })
  studentComment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  addId() {
    this.id = v4();
  }
}
