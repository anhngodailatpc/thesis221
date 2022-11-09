import React, { useEffect, useState, useRef } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CDataTable,
  CRow,
  CButton,
  CCardHeader,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import UserApi from '../../../../api/Achievement/userApi'
import AuditorApi from '../../../../api/Achievement/auditorApi'
import Select from 'react-select'
import { AuditorForAchievement } from '../../../../types/Auditor'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../store'
import { roles } from '../../../../common/roles'
import achievementApi from '../../../../api/Achievement/achievementApi'

const fields = [
  {
    key: 'name',
    label: 'Tên',
    _style: { width: '35%', textAlign: 'center' },
  },
  {
    key: 'email',
    label: 'Email',
    _style: { width: '35%', textAlign: 'center' },
  },
  {
    key: 'final',
    label: ' Chủ tịch hội đồng xét duyệt',
    _style: { width: '15%', textAlign: 'center' },
  },
  {
    key: 'action',
    label: 'Thao tác',
    _style: { width: '15%', textAlign: 'center' },
    sorter: false,
    filter: false,
  },
]

const selectOptions = [
  { value: 1, label: 'Chủ tịch hội đồng xét duyệt', isDisabled: false },
  { value: 2, label: 'Thành viên hội đồng xét duyệt', isDisabled: false },
]

interface TParam {
  id: string
}

const ManageAuditor = ({ match }: RouteComponentProps<TParam>) => {
  const achievementId = parseInt(match.params.id)
  const [users, setUsers] = useState<AuditorForAchievement[]>([])
  const [open, setOpen] = useState(false)
  const [openFinal, setOpenFinal] = useState(false)
  const [user, setUser] = useState<any[]>([])
  const [defaultUser, setDefaultUser] = useState<any[]>([])
  const [auditor, setAuditor] = useState<any[]>([])
  const [auditorFinal, setAuditorFinal] =
    useState<{ value: number; label: string }>()
  const [displaySelect, setDisplaySelect] = useState(0)
  const [spinner, setSpinner] = useState(false)
  const [lock, setLock] = useState<boolean>(false)
  const [filters, setFilters] = useState({
    search: '',
  })
  const timeoutSearchRef = useRef<any>(null)
  const [messageError, setMessageError] = useState('')

  const history = useHistory()

  const currentUser = useSelector((state: RootState) => state.user)

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await UserApi.verifyLogin()
      } catch {
        history.push('/login')
      }
    }
    async function getStatus() {
      const { lock } = await achievementApi.get(achievementId)
      if (lock !== 'unavailable') setLock(true)
    }
    verifyLogin()
    getStatus()
  }, [achievementId, history])

  useEffect(() => {
    async function getUserAll() {
      try {
        const data = await UserApi.getAll(filters)
        setTimeout(() => {
          setSpinner(false)
        }, 500)
        setUser(
          data.map((res) => ({
            value: res.id,
            label: res.email,
          }))
        )
      } catch (error) {
        console.error(error)
      }
    }
    if (roles.MANAGER.includes(currentUser.role)) {
      getUserAll()
    } else {
      if (currentUser.id !== 0) {
        history.push('loi-truy-cap')
      }
    }
  }, [filters, currentUser.role, currentUser.id, history])
  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await UserApi.verifyLogin()
      } catch {
        history.push('/login')
      }
    }
    async function getAuditor() {
      const data = await AuditorApi.getAuditorsForAchievement(achievementId)
      const auditors = data.reduce((pre: any, val: any) => {
        if (val.isFinal) return pre
        return [
          ...pre,
          {
            value: val.id,
            label: val.email,
          },
        ]
      }, [])
      setDefaultUser(auditors)
      setAuditor(auditors)
    }
    verifyLogin()
    getAuditor()
  }, [achievementId, history])
  const handleChange = (newValue: any, actionMeta: any) => {
    if (actionMeta.action === 'clear') {
      setDisplaySelect(0)
    } else {
      setDisplaySelect(newValue.value)
    }
  }

  const handleInputChange = (value: string) => {
    const temp = value
    if (timeoutSearchRef.current) {
      clearTimeout(timeoutSearchRef.current)
    }

    timeoutSearchRef.current = setTimeout(() => {
      setSpinner(true)
      setFilters({ search: temp || '' })
    }, 1500)
  }

  const handleChangeMulti = (newValue: any, actionMeta: any) =>
    setAuditor(newValue)

  const handleChangeSingle = (newValue: any, actionMeta: any) =>
    setAuditorFinal(newValue)

  const handleSubmitFinal = async () => {
    if (users.length === 0) {
      setMessageError('Vui lòng lập thành viên hội đồng')
      setTimeout(() => {
        setMessageError('')
      }, 3000)
    } else {
      try {
        const response = await achievementApi.setStatus('UNLOCK', achievementId)
        if (response) {
          setOpenFinal(false)
          setLock(true)
        }
      } catch (error: any) {
        if (error?.response.status === 400) {
          setMessageError(error.response.data.message)
          setTimeout(() => {
            setMessageError('')
          }, 3000)
        }
        console.log(error.message)
      }
    }
  }

  const handleSubmit = async () => {
    try {
      if (displaySelect === 1) {
        const achievement = await AuditorApi.updateAuditorsForAchievement(
          achievementId,
          {
            isFinal: true,
            auditor: [auditorFinal],
          }
        )
        setUsers([
          {
            id: achievement.auditorFinal.id,
            name: achievement.auditorFinal.name,
            surName: achievement.auditorFinal.surName,
            email: achievement.auditorFinal?.email || '',
            isFinal: true,
          },
          ...users,
        ])
        setOpen(false)
        setDisplaySelect(0)
      } else {
        const achievement = await AuditorApi.updateAuditorsForAchievement(
          achievementId,
          {
            isFinal: false,
            auditor: auditor,
          }
        )
        const userFinal = users.find((user) => user.isFinal === true)
        if (userFinal)
          setUsers([
            ...achievement.auditors.map((au: any) => ({
              au: au.id,
              name: au.name,
              surName: au.surName,
              email: au.email || '',
              isFinal: false,
            })),
            userFinal,
          ])
        else
          setUsers([
            ...achievement.auditors.map((au: any) => ({
              id: au.id,
              name: au.name,
              surName: au.surName,
              email: au.email || '',
              isFinal: false,
            })),
          ])
        setOpen(false)
        setDisplaySelect(0)
      }
      setMessageError('')
    } catch (error: any) {
      if (error?.response.status === 400) {
        setMessageError(error.response.data.message)
        setTimeout(() => {
          setMessageError('')
        }, 3000)
      }
      console.error(error)
    }
  }

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await UserApi.verifyLogin()
      } catch {
        history.push('/login')
      }
    }
    async function getUsers() {
      try {
        const auditors: AuditorForAchievement[] =
          await AuditorApi.getAuditorsForAchievement(achievementId)
        setUsers(auditors)
      } catch (error) {
        console.error(error)
      }
    }
    verifyLogin()
    getUsers()
  }, [achievementId, history])

  const handleRemove = async (id: any, isFinal: boolean) => {
    const splitUserFinal = users.filter((user) => user.isFinal !== true)
    try {
      if (isFinal) {
        await AuditorApi.updateAuditorsForAchievement(achievementId, {
          isFinal: true,
          auditor: [],
        })
        setUsers(splitUserFinal)
      } else {
        const newUserList = users.filter((user) => user.id !== id)
        await AuditorApi.updateAuditorsForAchievement(achievementId, {
          isFinal: false,
          auditor: splitUserFinal.reduce((pre: any, user: any) => {
            if (user.id !== id) {
              return [...pre, { label: user.email }]
            }
            return pre
          }, []),
        })
        setUsers(newUserList)
      }
    } catch (error: any) {
      console.error(error.message)
    }
  }

  return (
    <>
      {roles.MANAGER.includes(currentUser.role) && (
        <CCard>
          <CCardHeader>
            <strong>LẬP HỘI ĐỒNG XÉT DUYỆT</strong>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol xl='12'>
                {lock || (
                  <CRow className='mt-2 mb-2 mr-1 d-flex justify-content-end'>
                    <CButton color='info' onClick={() => setOpen(true)}>
                      Thêm
                    </CButton>
                    <CButton
                      className='ml-2'
                      color='info'
                      onClick={() => setOpenFinal(true)}>
                      Lập hội đồng
                    </CButton>
                  </CRow>
                )}
              </CCol>
              <CCol xl='12'>
                <CCard>
                  <CCardBody>
                    <CDataTable
                      items={users}
                      fields={fields}
                      noItemsView={{
                        noResults: 'Không có kết quả tìm kiếm',
                        noItems: 'Hội đồng xét duyệt chưa được phân công',
                      }}
                      scopedSlots={{
                        name: (item: AuditorForAchievement) => {
                          return (
                            <td className='text-center'>
                              {item.surName} {item.name}
                            </td>
                          )
                        },
                        email: (item: AuditorForAchievement) => {
                          return (
                            <td className='text-center'>
                              <div className='d-flex justify-content-center align-items-center'>
                                {item.email}
                              </div>
                            </td>
                          )
                        },
                        final: (item: AuditorForAchievement) => {
                          return (
                            <td className='text-center'>
                              {item.isFinal ? (
                                <CButton size='sm' color='info'>
                                  <CIcon size='sm' content={freeSet.cilCheck} />
                                </CButton>
                              ) : (
                                ''
                              )}
                            </td>
                          )
                        },
                        action: (item: AuditorForAchievement) =>
                          lock ? <></> : (
                            <td
                              className='text-center'
                              style={{ cursor: 'pointer' }}>
                              <CButton
                                size='sm'
                                color='danger'
                                onClick={() =>
                                  handleRemove(item.id, item.isFinal)
                                }>
                                <CIcon size='sm' content={freeSet.cilTrash} />
                              </CButton>
                            </td>
                          ),
                      }}
                    />
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
            <CModal
              show={openFinal}
              onClose={() => {
                setOpenFinal(false)
              }}
              size='lg'
              color='warning'>
              <CModalHeader closeButton>
                <CModalTitle>Lập hội đồng xét duyệt</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CRow>
                  <CCol sm='12'>
                    <div style={{ color: 'red', marginBottom: '5px' }}>
                      {messageError}
                    </div>
                  </CCol>
                  <CCol sm='12'>
                    Hội đồng xét duyệt sẽ được thành lập và{' '}
                    <strong> không thể thay đổi </strong> các thành viên trong
                    hội đồng
                  </CCol>
                </CRow>
              </CModalBody>
              <CModalFooter>
                <CButton color='info' onClick={handleSubmitFinal}>
                  Gửi
                </CButton>
              </CModalFooter>
            </CModal>
            <CModal
              show={open}
              onClose={() => {
                setOpen(false)
              }}
              size='lg'
              color='info'>
              <CModalHeader closeButton>
                <CModalTitle>Thêm hội đồng xét duyệt</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CRow>
                  <CCol sm='1'></CCol>
                  <CCol sm='10'>
                    <div style={{ color: 'red', marginBottom: '5px' }}>
                      {messageError}
                    </div>
                    <Select
                      className='mb-3'
                      placeholder='Vui lòng chọn'
                      name='color'
                      isClearable={true}
                      onChange={handleChange}
                      options={selectOptions}
                    />
                  </CCol>
                  <CCol sm='1'></CCol>

                  {displaySelect === 1 ? (
                    <>
                      <CCol sm='1'></CCol>
                      <CCol sm='10'>
                        <Select
                          isSearchable={true}
                          isClearable={true}
                          onChange={handleChangeSingle}
                          onInputChange={handleInputChange}
                          options={user}
                          placeholder='Vui lòng nhập Email để tìm kiếm...'
                        />
                      </CCol>
                      <CCol className='d-flex' sm='1'>
                        {spinner ? (
                          <CSpinner
                            className='align-self-center'
                            color='info'
                            size='sm'
                          />
                        ) : undefined}
                      </CCol>
                    </>
                  ) : undefined}
                  {displaySelect === 2 ? (
                    <>
                      <CCol sm='1'></CCol>
                      <CCol sm='10'>
                        <Select
                          isMulti
                          defaultValue={defaultUser}
                          name='MultiUser'
                          options={user}
                          onInputChange={handleInputChange}
                          onChange={handleChangeMulti}
                          placeholder='Vui lòng nhập Email để tìm kiếm'
                        />
                      </CCol>
                      <CCol className='d-flex' sm='1'>
                        {spinner ? (
                          <CSpinner
                            className='align-self-center'
                            color='info'
                            size='sm'
                          />
                        ) : undefined}
                      </CCol>
                    </>
                  ) : undefined}
                </CRow>
              </CModalBody>
              <CModalFooter>
                <CButton
                  color='info'
                  disabled={displaySelect === 0}
                  onClick={handleSubmit}>
                  Gửi
                </CButton>
              </CModalFooter>
            </CModal>
          </CCardBody>
        </CCard>
      )}
    </>
  )
}

export default ManageAuditor
