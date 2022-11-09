import React from "react";
import CRoute from "./types/CRoute";
const Page404 = React.lazy(() => import("./common/pages/page404"));
const Page500 = React.lazy(() => import("./common/pages/page500"));
const ShowAchievementUser = React.lazy(
  () => import("./features/BK_Achievement/Achievement/page/ShowAchievementUser")
);

const Auditor = React.lazy(
  () => import("./features/BK_Achievement/Auditor/auditor")
);
const AuditorFinal = React.lazy(
  () => import("./features/BK_Achievement/Auditor/auditorFinal")
);

const YouthBranch = React.lazy(
  () => import("./features/BK_Achievement/YouthBranch")
);

const ManageDepartment = React.lazy(
  () => import("./features/BK_Achievement/Achievement/page/ManageDepartment")
);

const MemberUnit = React.lazy(
  () => import("./features/BK_Achievement/Achievement/page/MemberUnit")
);

const AchievementTabs = React.lazy(
  () => import("./features/BK_Achievement/Achievement/page/AchievementTabs")
);
const FormStudent = React.lazy(
  () => import("./features/BK_Achievement/Information/Pages/Student")
);
const FormManager = React.lazy(
  () => import("./features/BK_Achievement/Information/Pages/Manager")
);
const ParticipantManagement = React.lazy(
  () => import("./features/BK_Achievement/Roles/pages/participantManagement")
);
const UserSubmission = React.lazy(
  () => import("./features/BK_Achievement/Achievement/page/UserSubmission")
);
const submissionUsers = React.lazy(
  () => import("./features/BK_Achievement/Auditor/components/submissionUsers")
);
const SubmissionUsersTest = React.lazy(
  () => import("./features/BK_Achievement/Auditor/components/Test")
);
const AuditorFinalTest = React.lazy(
  () => import("./features/BK_Achievement/Auditor/components/AuditorFinalTest")
);
const ManageActivity = React.lazy(
  () => import("./features/BK_Activity_Portal/ActivityManage/pages")
);
const AchievementPage = React.lazy(
  () => import("./features/BK_Achievement/Achievement/page/AchievementPage")
);
const CriteriaPage = React.lazy(
  () => import("./features/BK_Achievement/Criteria/page/CriteriaPage")
);

const ShowCompetitionUser = React.lazy(
  () => import("./features/BK_Competition/Achievement/page/ShowCompetitionUser")
);

const DepartmentManagerIndexPage = React.lazy(
  () => import("./features/BK_Achievement/DepartmentManager/pages/index")
);

const SubmissionPage = React.lazy(
  () => import("./features/BK_Achievement/Student/pages/SubmissionPage")
);

const ManageAuditor = React.lazy(
  () => import("./features/BK_Achievement/Auditor/components/ManageAuditor")
);

const Summary = React.lazy(
  () => import("./features/BK_Achievement/Achievement/page/Summary")
);

const ShowHistoryAchievement = React.lazy(
  () =>
    import('./features/BK_Achievement/Achievement/page/ShowHistoryAchievement')
)
const ShowHistoryCompetition = React.lazy(
  () =>
    import('./features/BK_Competition/Achievement/page/ShowHistoryCompetition')
)

const CampaignPage = React.lazy(
  () =>
    import("./features/BK_Activity_Portal/ActivityCampaign/pages/CampaignPage")
);

const GroupActivityPage = React.lazy(
  () => import("./features/BK_Activity_Portal/ActivityGroup/pages/GroupPage")
);
const ActivityUsersRegister = React.lazy(
  () =>
    import(
      "./features/BK_Activity_Portal/ActivityManage/pages/ActivityUsersRegister"
    )
);
const ActivityRegisterParticipant = React.lazy(
  () =>
    import("./features/BK_Activity_Portal/ActivityParticipant/pages/Register")
);
const ActivityRegisterHistory = React.lazy(
  () =>
    import("./features/BK_Activity_Portal/ActivityParticipant/pages/History")
);

const ActivityQRRegister = React.lazy(
  () =>
    import(
      "./features/BK_Activity_Portal/ActivityManage/pages/ActivityQRRegister"
    )
);

//competition
const CompetitionPage = React.lazy(
  () => import("./features/BK_Competition/Achievement/page/CompetitionPage")
);

const routes: CRoute[] = [
  { path: '/quan-ly-hoat-dong', exact: true, component: ManageActivity },
  { path: '/danh-hieu', exact: true, component: AchievementPage },
  { path: '/quan-ly-tieu-chi/:id', exact: true, component: CriteriaPage },
  { path: '/de-cu', exact: true, component: ShowAchievementUser },
  { path: '/lich-su-de-cu', exact: true, component: ShowHistoryAchievement },
  { path: '/lich-su-thi-dua', exact: true, component: ShowHistoryCompetition },
  { path: '/auditor', exact: true, component: Auditor },
  { path: '/auditor-final/:id', exact: true, component: AuditorFinal },
  { path: '/danh-sach-nop-ho-so/:id', exact: true, component: UserSubmission },
  { path: '/chi-tiet-ho-so/:id', exact: true, component: submissionUsers },
  { path: '/thanh-vien-don-vi/:id', exact: true, component: MemberUnit },
  {
    path: '/quan-ly-don-vi/:id',
    exact: true,
    component: ManageDepartment,
  },

  {
    path: "/duyet-ho-so/:id/:mssv",
    exact: true,
    component: SubmissionUsersTest,
  },
  {
    path: "/chu-tich-duyet-ho-so/:id/:mssv",
    exact: true,
    component: AuditorFinalTest,
  },

  {
    path: "/quan-li-nguoi-dung",
    exact: true,
    component: ParticipantManagement,
  },
  { path: "/thong-tin", exact: true, component: FormStudent },
  { path: "/thong-tin-can-bo", exact: true, component: FormManager },
  { path: "/chi-doan/:id", exact: true, component: YouthBranch },

  {
    path: "/cham-bai/:id",
    exact: true,
    component: AchievementTabs,
  },
  { path: "/loi-truy-cap", exact: true, component: Page500 },
  { path: "/not-found", exact: true, component: Page404 },
  {
    path: "/department-manager",
    exact: true,
    component: DepartmentManagerIndexPage,
  },
  {
    path: "/de-cu/:id",
    exact: true,
    component: SubmissionPage,
  },
  {
    path: "/quan-ly-hoi-dong-xet-duyet/:id",
    exact: true,
    component: ManageAuditor,
  },
  {
    path: "/tong-ket/:id",
    exact: true,
    component: Summary,
  },
  {
    path: "/quan-ly-dot-hoat-dong",
    exact: true,
    component: CampaignPage,
  },
  {
    path: "/quan-ly-nhom-hoat-dong",
    exact: true,
    component: GroupActivityPage,
  },
  {
    path: "/hoat-dong/danh-sach-dang-ky/:id",
    exact: true,
    component: ActivityUsersRegister,
  },
  {
    path: "/dang-ky-hoat-dong",
    exact: true,
    component: ActivityRegisterParticipant,
  },
  {
    path: "/danh-sach-thi-dua",
    exact: true,
    component: ShowCompetitionUser,
  },
  {
    path: "/lich-su-dang-ky",
    exact: true,
    component: ActivityRegisterHistory,
  },
  {
    path: "/qr-reg/:id",
    exact: true,
    component: ActivityQRRegister,
  },
  //competition
  {
    path: "/thi-dua",
    exact: true,
    component: CompetitionPage,
  },
];

export default routes;
