import { RegistrationActivity } from './../../models/BKAP/registration.entity';
import { ContactInfo } from './../../models/Achievement/contactInfo.entity';
import { ResultOfCriteria } from './../../models/Achievement/resultOfCriteria.entity';
import { Result } from 'src/models/Achievement/result.entity';
import { JwtRefreshTokenStrategy } from './strategy/jwt-refresh-token.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { User } from 'src/models/Achievement/user.entity';
import { ClosureCriteria } from './../../models/Achievement/closureCriteria.entity';
import { Criteria } from './../../models/Achievement/criteria.entity';
import { Achievement } from '../../models/Achievement/achievement.entity';
import { Department } from 'src/models/Achievement/department.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { ResultService } from './services/result.service';
import { CriteriaService } from './services/criteria.service';
import { CriteriaController } from './controllers/criteria.controller';
import { UserController } from './controllers/user.controller';
import { AchievementService } from './services/achievement.service';
import { AchievementController } from './controllers/achievement.controller';
import { GoogleAuthenticationController } from './controllers/googleAuthentication.controller';
import { GoogleAuthenticationService } from './services/googleAuthentication.service';
import { UsersService } from './services/users.service';
import { AuthenticationService } from './services/authentication.service';
import { DepartmentService } from './services/department.service';
import { DepartmentController } from './controllers/department.controller';
import { AuditorController } from './controllers/auditor.controller';
import { AuditorService } from './services/auditor.service';
import { SubmissionController } from './controllers/submission.controller';
import { SubmissionService } from './services/submission.service';
import { Submission } from 'src/models/Achievement/submission.entity';
import { RolesGuard } from './guard/roles.guard';
import { YouthBranch } from 'src/models/Achievement/youthBranch.entity';
import { YouthBranchController } from './controllers/youthBranch.controller';
import { YouthBranchService } from './services/youthBranch.service';
import ActivityCampaign from 'src/models/BKAP/activityCampaign.entity';
import { ActivityCampaignService } from '../BKAP_API/services/activityCampaign.service';
import { ActivityCampaignController } from '../BKAP_API/controllers/activityCampaign.controller';
import ActivityGroup from 'src/models/BKAP/activityGroup.entity';
import Activity from 'src/models/BKAP/activity.entity';
import { ActivityRegistrationController } from '../BKAP_API/controllers/activityRegistration.controller';
import { ActivityRegistrationService } from '../BKAP_API/services/activityRegistration.service';
import { ActivityGroupService } from '../BKAP_API/services/activityGroup.service';
import { ActivityGroupController } from '../BKAP_API/controllers/activityGroup.controller';
import { ActivityManageService } from '../BKAP_API/services/activityManage.service';
import { ActivityController } from '../BKAP_API/controllers/activityManage.controller';

//Competition
//entity
import { Competition } from 'src/models/Competition/competition.entity';
import { CompetitionCriteria } from 'src/models/Competition/comCriteria.entity';
import { CompetitionSubmission } from 'src/models/Competition/comSubmission.entity';
//controller
import { CompetitionController } from '../Competition_API/controllers/competition.controller';
import { CompetitionCriteriaController } from '../Competition_API/controllers/criteria.controller';
import { CompetitionSubmissionController } from '../Competition_API/controllers/submission.controller';
//services
import { CompetitionService } from '../Competition_API/services/competition.service';
import { CompetitionCriteriaService } from '../Competition_API/services/criteria.service';
import { CompetitionSubmissionService } from '../Competition_API/services/submission.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Achievement,
      Criteria,
      ClosureCriteria,
      User,
      Department,
      ResultOfCriteria,
      Result,
      Submission,
      YouthBranch,
      ContactInfo,
      ActivityCampaign,
      ActivityGroup,
      Activity,
      RegistrationActivity,
      Competition,
      CompetitionCriteria,
      CompetitionSubmission,
    ]),
    JwtModule.register({}),
    // MulterModule.register({ dest: '../frontend/testUploads' }),
  ],
  providers: [
    CriteriaService,
    AchievementService,
    GoogleAuthenticationService,
    UsersService,
    AuthenticationService,
    DepartmentService,
    AuditorService,
    SubmissionService,
    ResultService,
    YouthBranchService,
    JwtRefreshTokenStrategy,
    JwtStrategy,
    RolesGuard,
    ActivityCampaignService,
    ActivityGroupService,
    ActivityManageService,
    ActivityRegistrationService,
    CompetitionService,
    CompetitionCriteriaService,
    CompetitionSubmissionService,
  ],
  controllers: [
    CriteriaController,
    AchievementController,
    GoogleAuthenticationController,
    UserController,
    DepartmentController,
    AuditorController,
    SubmissionController,
    YouthBranchController,
    ActivityCampaignController,
    ActivityGroupController,
    ActivityController,
    ActivityRegistrationController,
    CompetitionController,
    CompetitionCriteriaController,
    CompetitionSubmissionController,
  ],
})
export class ApiModule {}
// GoogleAuthenticationService;
