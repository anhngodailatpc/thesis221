import { Role } from './enum';
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);