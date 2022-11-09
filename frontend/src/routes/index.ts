import CRoute from '../types/CRoute'
import {
  Page404,
  Page500,
  ShowAchievementUser,
  Auditor,
  AuditorFinal,
  YouthBranch,
  AchievementTabs,
  FormStudent,
  FormManager,
  ParticipantManagement,
  UserSubmission,
  submissionUsers,
  SubmissionUsersTest,
  AuditorFinalTest,
  AchievementPage,
  CriteriaPage,
  DepartmentManagerIndexPage,
  SubmissionPage,
  ManageAuditor,
  Summary,
  ShowHistoryAchievement,
  ManageActivity,
} from './routes'
const routes: CRoute[] = [
  { path: '/quan-ly-hoat-dong', exact: true, component: ManageActivity },
  { path: '/danh-hieu', exact: true, component: AchievementPage },
  { path: '/quan-ly-tieu-chi/:id', exact: true, component: CriteriaPage },
  { path: '/de-cu', exact: true, component: ShowAchievementUser },
  { path: '/lich-su-de-cu', exact: true, component: ShowHistoryAchievement },
  { path: '/auditor', exact: true, component: Auditor },
  { path: '/auditor-final/:id', exact: true, component: AuditorFinal },
  { path: '/danh-sach-nop-ho-so/:id', exact: true, component: UserSubmission },
  { path: '/chi-tiet-ho-so/:id', exact: true, component: submissionUsers },
  {
    path: '/duyet-ho-so/:id/:mssv',
    exact: true,
    component: SubmissionUsersTest,
  },
  {
    path: '/chu-tich-duyet-ho-so/:id/:mssv',
    exact: true,
    component: AuditorFinalTest,
  },

  {
    path: '/quan-li-nguoi-dung',
    exact: true,
    component: ParticipantManagement,
  },
  { path: '/thong-tin', exact: true, component: FormStudent },
  { path: '/thong-tin-can-bo', exact: true, component: FormManager },
  { path: '/chi-doan/:id', exact: true, component: YouthBranch },

  {
    path: '/cham-bai/:id',
    exact: true,
    component: AchievementTabs,
  },
  { path: '/loi-truy-cap', exact: true, component: Page500 },
  {
    path: '/department-manager',
    exact: true,
    component: DepartmentManagerIndexPage,
  },
  {
    path: '/de-cu/:id',
    exact: true,
    component: SubmissionPage,
  },
  {
    path: '/quan-ly-hoi-dong-xet-duyet/:id',
    exact: true,
    component: ManageAuditor,
  },
  {
    path: '/tong-ket/:id',
    exact: true,
    component: Summary,
  },
  { path: '/not-found', exact: true, component: Page404 },
]

export default routes
