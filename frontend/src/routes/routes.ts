import React from "react";

const ManageActivity = React.lazy(
  () => import("../features/BK_Activity_Portal/ActivityManage/pages")
);
const ParticipantManagement = React.lazy(
  () => import("../features/BK_Achievement/Roles/pages/participantManagement")
);
const UserSubmission = React.lazy(
  () => import("../features/BK_Achievement/Achievement/page/UserSubmission")
);
const submissionUsers = React.lazy(
  () => import("../features/BK_Achievement/Auditor/components/submissionUsers")
);
const SubmissionUsersTest = React.lazy(
  () => import("../features/BK_Achievement/Auditor/components/Test")
);
const AuditorFinalTest = React.lazy(
  () => import("../features/BK_Achievement/Auditor/components/AuditorFinalTest")
);
const Page404 = React.lazy(() => import("../common/pages/page404"));
const Page500 = React.lazy(() => import("../common/pages/page500"));
const ShowAchievementUser = React.lazy(
  () =>
    import("../features/BK_Achievement/Achievement/page/ShowAchievementUser")
);
const Auditor = React.lazy(
  () => import("../features/BK_Achievement/Auditor/auditor")
);
const AuditorFinal = React.lazy(
  () => import("../features/BK_Achievement/Auditor/auditorFinal")
);
const YouthBranch = React.lazy(
  () => import("../features/BK_Achievement/YouthBranch")
);
const AchievementTabs = React.lazy(
  () => import("../features/BK_Achievement/Achievement/page/AchievementTabs")
);
const FormStudent = React.lazy(
  () => import("../features/BK_Achievement/Information/Pages/Student")
);
const FormManager = React.lazy(
  () => import("../features/BK_Achievement/Information/Pages/Manager")
);
const AchievementPage = React.lazy(
  () => import("../features/BK_Achievement/Achievement/page/AchievementPage")
);
const CriteriaPage = React.lazy(
  () => import("../features/BK_Achievement/Criteria/page/CriteriaPage")
);

const DepartmentManagerIndexPage = React.lazy(
  () => import("../features/BK_Achievement/DepartmentManager/pages/index")
);

const SubmissionPage = React.lazy(
  () => import("../features/BK_Achievement/Student/pages/SubmissionPage")
);

const ManageAuditor = React.lazy(
  () => import("../features/BK_Achievement/Auditor/components/ManageAuditor")
);

const Summary = React.lazy(
  () => import("../features/BK_Achievement/Achievement/page/Summary")
);

const ShowHistoryAchievement = React.lazy(
  () =>
    import("../features/BK_Achievement/Achievement/page/ShowHistoryAchievement")
);

//Competition module

export {
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
};
