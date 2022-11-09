import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavTitle,
  CSidebarNavItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import logo_BK from '../../assets/images/law-logo.png'
import navigation from './navigation'
import { RootState } from '../../store'
import { setSidebar } from '../../redux/sidebar'
// eslint-disable-next-line react-hooks/rules-of-hooks

function TheSidebar() {
  const sidebarShow = useSelector((state: RootState) => state.sidebar)
  const currentUser = useSelector((state: RootState) => state.user)
  const countAchievement = useSelector(
    (state: RootState) => state.achievementSideBar
  )
  const countCompetition = useSelector(
    (state: RootState) => state.competitionSideBar
  )
  const dispatch = useDispatch()
  const [list, setList] = useState<any>([])
  useEffect(() => {
    async function listenUser() {
      const list = navigation.filter(
        (item) =>
          item.role.includes(currentUser.role) ||
          (item.to === '/danh-hieu' && countAchievement !== 0) ||
          (item.to === '/thi-dua' && countCompetition !== 0)
      )
      setList(list)
    }
    if (currentUser.id !== 0) {
      listenUser()
    }
  }, [countAchievement, countCompetition, currentUser.role, currentUser.id])
  return (
    <CSidebar
      show={sidebarShow as boolean | '' | 'responsive' | undefined}
      onShowChange={(val: any) => dispatch(setSidebar(val))}
      colorScheme='dark'>
      <CSidebarBrand className='d-md-down-none'>
        <CIcon className='c-sidebar-brand-full' src={logo_BK} height={35} />
      </CSidebarBrand>

      <CSidebarNav>
        <CCreateElement
          items={list}
          components={{ CSidebarNavTitle, CSidebarNavItem }}
        />
      </CSidebarNav>
    </CSidebar>
  )
}

export default TheSidebar
