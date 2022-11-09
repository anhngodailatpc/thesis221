import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import {
  handleAdd,
  handleDelete,
  handleModify,
  handleUpdateSoft,
} from "../utils/competitionCritArrayHandler";
import store from "../store";

import { CompetitionCriteria } from "../types/BK_Competition/Criterion";
import CompetitionCritApi from "../api/Competition/critApi";

let initialState: { list: CompetitionCriteria[] } = {
  list: [],
};

const dhSlice = createSlice({
  name: "competitionCriteria",
  initialState: initialState,
  reducers: {
    tempAddCrit: (state = initialState, action) => {
      // console.log(action.payload);
      if (action.payload.parentId === 0) {
        return {
          ...state,
          list: [...state.list, action.payload.item],
        };
      } else {
        handleAdd(state.list, action.payload.item, action.payload.parentId);
      }
    },
    deleteCrit: (state, action) => {
      state.list = handleDelete(state.list, action.payload.itemId).resultArr;
    },
    modifyCrit: (state = initialState, action) => {
      handleModify(state.list, action.payload.item, action.payload.parentId);
      //console.log("Modify crit result: " + result);
    },
    fetchCrit: (state = initialState, action) => {
      return {
        ...state,
        list: action.payload,
      };
    },
    updateSoft: (state = initialState, action) => {
      handleUpdateSoft(state.list, action.payload.critId, action.payload.soft);
      // console.log(
      //   "Update crit id: " +
      //     action.payload.critId +
      //     " numsoft: " +
      //     action.payload.soft +
      //     " result: " +
      //     result
      // );
    },
  },
});

const { actions, reducer } = dhSlice;

export const { deleteCrit, modifyCrit, fetchCrit, tempAddCrit, updateSoft } =
  actions;
export default reducer;

export const fetchAll =
  (id: string): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    try {
      const data = await CompetitionCritApi.getAll(id);
      dispatch(fetchCrit(data));
    } catch (error: any) {
      console.log(error.message);
    }
  };
/*
export const add =
  (
    id: string,
    payload: any
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    dispatch(addCrit(payload));
    console.log(store.getState());
    const res = await (id, store.getState().tieuchi.list);
    console.log(res);
  };

export const update =
  (
    acvId: string,
    id: string,
    item: Criteria
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    await CompetitionCritApi.update(id, item);
    const data = await CompetitionCritApi.getAll(acvId);
    dispatch(fetchCrit(data));
  };

export const deleteCriteria =
  (
    acvId: string,
    id: string
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    await CompetitionCritApi.delete(id);
    const data = await CompetitionCritApi.getAll(acvId);
    dispatch(fetchCrit(data));
  };
*/
export const saveState =
  (
    id: string,
    deletedID: string[]
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    await CompetitionCritApi.add(id, {
      list: store.getState().competitionCriteria.list,
      deletedID: deletedID,
    });
  };
