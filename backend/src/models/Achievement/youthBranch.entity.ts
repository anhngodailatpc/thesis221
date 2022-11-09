import { Department } from './department.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  DeleteDateColumn,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';
import { v4 } from 'uuid';
@Entity()
export class YouthBranch {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Department, (department) => department.id)
  departmentId: Department;

  @DeleteDateColumn()
  deletedAt?: Date;

  @BeforeInsert()
  addId() {
    this.id = v4();
  }
}
