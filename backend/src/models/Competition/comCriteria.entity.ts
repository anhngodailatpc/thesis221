import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';
import { v4 } from 'uuid';

import { Competition } from './competition.entity';
import { CriteriaType } from 'src/common/enum';

@Entity()
export class CompetitionCriteria {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ nullable: true })
  parentId: string;

  @Column({ unique: false, nullable: false })
  name: string;

  @Column({ default: false })
  isCriteria: boolean;

  @Column({ default: '' })
  note: string;

  @Column({
    type: 'enum',
    enum: CriteriaType,
    default: CriteriaType.HARD,
  })
  type: CriteriaType;

  @Column({ default: false })
  evidence: boolean;

  @Column({ nullable: true })
  standardPoint: number;

  @Column({ default: 0 })
  soft: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Competition, (competition) => competition.criteria, {
    onDelete: 'CASCADE',
  })
  competition: Competition;

  // @OneToMany(() => Submission, (submission) => submission.criteria)
  // submissions: Submission[];
  @BeforeInsert()
  addId() {
    this.id = v4();
  }
}
