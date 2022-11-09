import { createSlice } from '@reduxjs/toolkit'

const competitionSideBarSlice = createSlice({
  name: 'competitionSideBar',
  initialState: 0,
  reducers: {
    setCompetitionSideBar: (state, action) => {
      return action.payload
    },
  },
})

const { actions, reducer } = competitionSideBarSlice
export const { setCompetitionSideBar } = actions
export default reducer
