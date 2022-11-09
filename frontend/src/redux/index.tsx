import TCReducer from "./TieuChi";
import sidebar from "./sidebar";
import userReducer from "./user";
import auditorReducer from "./auditor";
import collapseAuditorReducer from "./collapseAuditor";
import submissionReducer from "./submission";
import departmentReducer from "./department";
import spinnerReducer from "./spinner";
import achievementSideBarReducer from "./achievementSideBar";
import competitionSideBarReducer from './competitionSideBar'
import unAuthorizedReducer from "./unAuthorized";
import competitionCriteriaReducer from "./Criteria";
import competitionSubmissionReducer from "./competitionSubmission";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  tieuchi: TCReducer,
  sidebar: sidebar,
  user: userReducer,
  auditor: auditorReducer,
  collapseAuditor: collapseAuditorReducer,
  submission: submissionReducer,
  department: departmentReducer,
  spinner: spinnerReducer,
  unAuthorized: unAuthorizedReducer,
  achievementSideBar: achievementSideBarReducer,
  competitionSideBar: competitionSideBarReducer,
  competitionCriteria: competitionCriteriaReducer,
  competitionSubmission: competitionSubmissionReducer,
})

export default rootReducer;

export type State = ReturnType<typeof rootReducer>;
