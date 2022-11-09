import { YouthBranch } from './youthBranch.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Department {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true, nullable: false })
  code: string;

  @Column({ unique: true, nullable: false })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.department, {
    cascade: true,
  })
  users: User[];

  @OneToMany(() => YouthBranch, (youthBranch) => youthBranch.departmentId, {
    cascade: true,
  })
  youthBranch: YouthBranch[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
