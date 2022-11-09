import { createSlice } from "@reduxjs/toolkit";
import Department from "../types/Department";

let initialState: {
  list: Department[];
} = { list: [] };

const departmentSlice = createSlice({
  name: "department",
  initialState: initialState,
  reducers: {
    getAll: (state = initialState, action) => {
      return {
        ...state,
        list: action.payload,
      };
    },
    addDepartment: (state = initialState, action) => {
      return {
        ...state,
        list: [...state.list, action.payload],
      };
    },
    updateDepartment: (state = initialState, action) => {
      const objIndex = state.list.findIndex(
        (obj) => obj.id === action.payload.id
      );
      state.list[objIndex] = action.payload;
    },
    deleteDepartment: (state = initialState, action) => {
      return {
        ...state,
        list: state.list.filter((item) => item.id !== action.payload.id),
      };
    },
    deleteYouthBranch: (state = initialState, action) => {
      //console.log(action.payload);
      const objIndex = state.list.findIndex(
        (obj) => obj.id === action.payload.parentId
      );
      state.list[objIndex].youthBranch = state.list[
        objIndex
      ].youthBranch.filter((item) => item.id !== action.payload.id);
    },
    updateYouthBranch: (state = initialState, action) => {
      //console.log(action.payload);
      const objIndex = state.list.findIndex(
        (obj) => obj.id === action.payload.parentId
      );
      const youthBIndex = state.list[objIndex].youthBranch.findIndex(
        (yB) => yB.id === action.payload.id
      );
      if (
        state.list[objIndex].youthBranch[youthBIndex] !== undefined &&
        state.list[objIndex].youthBranch[youthBIndex] !== null
      ) {
        state.list[objIndex].youthBranch[youthBIndex].name =
          action.payload.name;
      }
    },
    addYouthBranch: (state = initialState, action) => {
      //console.log(action.payload);
      const objIndex = state.list.findIndex(
        (obj) => obj.id === action.payload.parentId
      );
      state.list[objIndex].youthBranch = [
        ...state.list[objIndex].youthBranch,
        action.payload.item,
      ];
    },
  },
});

const { actions, reducer } = departmentSlice;

export const {
  getAll,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  deleteYouthBranch,
  updateYouthBranch,
  addYouthBranch,
} = actions;
export default reducer;

export const generateNewId = (data: Department[]): number => {
  //   console.log("state: ", data);
  let newId = Math.floor(Math.random() * 10000000)
  for (const item of data) {
    if (item.id === newId) {
      newId = generateNewId(data);
    }
  }
  return newId;
};
