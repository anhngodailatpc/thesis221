import { createSlice, ThunkAction } from "@reduxjs/toolkit";
import { AnyAction } from "redux";
import {
  handleApplicationFileChange,
  handleApplicationPointChange,
  handleApplicationStudentCommentChange,
} from "../utils/competitionCritArrayHandler";
import { RootState } from "../store";
import { CompetitionSubmission } from "../types/BK_Competition/Submission";
import competitionSubmissionApi from "../api/Competition/submissionApi";

let initialState: { list: CompetitionSubmission[] } = {
  list: [],
};

const dhSlice = createSlice({
  name: "submission",
  initialState: initialState,
  reducers: {
    loadAll: (state = initialState, action) => {
      return {
        ...state,
        list: action.payload,
      };
    },
    addSubmission: (state = initialState, action) => {
      return state;
    },
    genSubmission: (state = initialState, action) => {
      return {
        ...state,
        list: action.payload.list,
      };
    },
    updatePoint: (state = initialState, action) => {
      handleApplicationPointChange(
        state.list,
        action.payload.subId,
        action.payload.point
      );
      // console.log(
      //   "Update point in submission with id: " +
      //     action.payload.subId +
      //     " result" +
      //     result
      // );
    },

    updateStudentComment: (state = initialState, action) => {
      handleApplicationStudentCommentChange(
        state.list,
        action.payload.subId,
        action.payload.studentComment
      );
      // console.log(
      //   "Update comment in submission with id: " +
      //     action.payload.subId +
      //     " result" +
      //     result
      // );
    },

    updateFile: (state = initialState, action) => {
      handleApplicationFileChange(
        state.list,
        action.payload.subId,
        action.payload.file
      );
      // console.log(
      //   "Update binary in submission with id: " +
      //     action.payload.subId +
      //     " result" +
      //     result
      // );
    },
  },
});

const { actions, reducer } = dhSlice;

export const {
  addSubmission,
  genSubmission,
  updatePoint,
  updateFile,
  loadAll,
  updateStudentComment,
} = actions;
export default reducer;

export const fetchAll =
  (
    acvId: string,
    userId: string
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    try {
      const data = await competitionSubmissionApi.getAll(acvId, userId);
      dispatch(loadAll(data));
    } catch (err: any) {}
  };

export const addSubmissionAsync =
  (
    acvId: string,
    userId: string,
    data: CompetitionSubmission[]
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    await competitionSubmissionApi.add(acvId, userId, data);
    //console.log(res);
  };
