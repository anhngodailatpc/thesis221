import {
  CCard,
  CCardBody,
  CCol,
  CDataTable,
  CPagination,
  CTooltip,
  CRow,
  CSelect,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import 'moment/locale/vi'
import React, { useEffect, useState } from 'react'
import achievementApi from '../../../../api/Achievement/achievementApi'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../store'
import { roles } from '../../../../common/roles'
import InputSearch from '../../../../common/InputFilterSearch'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import Moment from 'react-moment'
import { CSVLink } from 'react-csv'
import 'moment/locale/vi'
import UserApi from '../../../../api/Achievement/userApi'

const fields = [
  {
    key: 'stt',
    label: 'STT',
    _style: { textAlign: 'center' },
  },
  {
    key: 'mssv',
    label: 'Mã số cán bộ',
    _style: { width: '10%', textAlign: 'center' },
  },
  {
    key: 'name',
    label: 'Họ và tên',
    sorter: false,
    filter: false,
    _style: { textAlign: 'center' },
  },
  {
    key: 'email',
    label: 'Email',
    _style: { width: '25%', textAlign: 'center' },
  },
  {
    key: 'department',
    label: 'Phòng/Ban',
    _style: { width: '25%', textAlign: 'center' },
  },
  {
    key: 'status',
    label: 'Tình trạng',
    _style: { textAlign: 'center' },
  },
  {
    key: 'updatedAt',
    label: 'Cập nhật lần cuối',
    sorter: false,
    filter: false,
    _style: { textAlign: 'center' },
  },
  {
    key: 'action',
    label: 'Thao tác',
    _style: { textAlign: 'center' },
    sorter: false,
    filter: false,
  },
]

const headers = [
  { label: 'Mã số cán bộ', key: 'mssv' },
  { label: 'Họ và đệm', key: 'surname' },
  { label: 'Tên', key: 'name' },
  { label: 'Email', key: 'email' },
  { label: 'Phòng/Ban', key: 'department' },
]

interface TParam {
  id: string
}

interface Filters {
  limit: number
  page: number
  search: string
}

const UserSubmission = ({ match }: RouteComponentProps<TParam>) => {
  const achievementId = parseInt(match.params.id)
  const [data, setData] = useState<any[]>([])
  const [achievement, setAchievement] = useState<any>()
  const [count, setCount] = useState(1)
  const [lockModal, setLockModal] = useState(false)
  const [powerModal, setPowerModal] = useState(false)
  const [lock, setLock] = useState<boolean>()
  const [textError, setTextError] = useState('')
  const [lockForever, setLockForever] = useState<boolean>(false)
  const [dataCSV, setDataCSV] = useState<any[]>([])
  const [filters, setFilters] = useState<Filters>({
    limit: 10,
    page: 1,
    search: '',
  })
  const history = useHistory()
  const currentUser = useSelector((state: RootState) => state.user)

  useEffect(() => {
    achievementApi
      .getUserSubmission(achievementId, { limit: 9999, page: 1, search: '' })
      .then(({ data: users }) => {
        setDataCSV(users)
      })
      .catch((error: any) => {
        console.error(error.message)
        history.push('/loi-truy-cap')
      })
  }, [achievementId, history])

  useEffect(() => {
    async function getAchievement(id: number) {
      const response = await achievementApi.get(id)
      setAchievement({
        ...response,
        auditorFinalId: response?.auditorFinal?.id || -999,
        auditorsListId: response?.auditors?.map((auditor) => auditor.id) || [],
      })
    }
    getAchievement(achievementId)
  }, [achievementId])

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await UserApi.verifyLogin()
      } catch {
        history.push('/login')
      }
    }
    async function getUserSubmission(id: number) {
      try {
        const { data: users, count } = await achievementApi.getUserSubmission(
          id,
          filters
        )
        setCount(count)

        setData(users)
      } catch (error: any) {
        console.error(error.message)
        history.push('/loi-truy-cap')
      }
    }
    if ([roles.MANAGER, roles.PARTICIPANT].includes(currentUser.role)) {
      getUserSubmission(achievementId)
    } else {
      verifyLogin()
      if (currentUser.id !== 0) {
        history.push('/loi-truy-cap')
      }
    }
  }, [achievementId, currentUser.role, currentUser.id, history, filters])

  const handleChangeSearch = (formValue: { text: string }) => {
    setFilters({
      ...filters,
      page: 1,
      search: formValue.text,
    })
  }

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
      if (lock === 'temporary') setLock(true)
      else if (lock === 'forever') setLockForever(true)
      setLock(false)
    }
    verifyLogin()
    getStatus()
  }, [achievementId, history])
  useEffect(() => {
    if (!lockModal || !powerModal) setTextError('')
  }, [lockModal, powerModal])
  const handleUnLock = async () => {
    try {
      await achievementApi.setStatus('UNLOCK', achievementId)
      setLock(false)
    } catch (error: any) {
      if (error?.response.data.statusCode === 400)
        setTextError(error?.response.data.message)
      else {
        console.error(error)
      }
    }
  }
  const handleLock = async (status: string) => {
    try {
      if (status === 'TEMPORARY') {
        await achievementApi.setStatus(status, achievementId)
        setLock(true)
        setLockModal(false)
      } else if (status === 'FOREVER') {
        const result = await achievementApi.setStatus(status, achievementId)
        if (result) setLockForever(true)
        setPowerModal(false)
      }
    } catch (error: any) {
      if (error?.response.data.statusCode === 400)
        setTextError(error?.response.data.message)
      else {
        console.error(error)
      }
    }
  }

  return (
    <>
      {[roles.MANAGER, roles.PARTICIPANT, roles.DEPARTMENT].includes(currentUser.role) && (
        <CCard>
          <CCardBody>
            <CRow className='mb-2'>
              <CCol sm='4' className='d-flex align-items-center'>
                <CTooltip content={`Mssv,Tên,Email,Khoa`}>
                  <CIcon
                    className='mr-1'
                    size='lg'
                    content={freeSet.cilFilter}
                  />
                </CTooltip>
                <InputSearch onSubmit={handleChangeSearch} />
              </CCol>
              <CCol sm='2'></CCol>
              <CCol
                sm='6'
                className='d-flex justify-content-end align-items-center'>
                <div>Số lượng/ trang:</div>
                <CSelect
                  defaultValue={'10'}
                  style={{ width: '70px', float: 'right', margin: '0 10px' }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFilters({ ...filters, limit: +e.currentTarget.value })
                  }>
                  <option value='5'>5</option>
                  <option value='10' selected>
                    10
                  </option>
                  <option value='20'>20</option>
                  <option value='50'>50</option>
                </CSelect>

                {[roles.MANAGER].includes(currentUser.role) && (<CButton
                  color='info'
                  size=''
                  style={{ float: 'right' }}
                  className=''>
                  <CSVLink
                    data={dataCSV}
                    headers={headers}
                    filename={'danh-sach-nguoi-nop-ho-so.csv'}
                    style={{ color: 'white' }}>
                    Xuất dữ liệu
                  </CSVLink>
                </CButton>)}

                {lockForever ||
                  ![achievement?.auditorFinalId].includes(currentUser.id) ||
                  (lock ? (
                    <>
                      <CButton
                        size='sm'
                        className='ml-1 d-fex align-items-center'
                        color='secondary'
                        onClick={handleUnLock}>
                        <CIcon
                          className='mr-1'
                          size='sm'
                          content={freeSet.cilLockLocked}
                        />
                        Khóa tạm thời (khóa)
                      </CButton>
                    </>
                  ) : (
                    <CButton
                      className='ml-1 d-fex align-items-center'
                      size='sm'
                      color='light'
                      onClick={() => setLockModal(true)}>
                      <CIcon
                        className='mr-1'
                        size='sm'
                        content={freeSet.cilLockUnlocked}
                      />
                      Khóa tạo thời (mở)
                    </CButton>
                  ))}
                {lockForever ||
                  ![achievement?.auditorFinalId].includes(currentUser.id) || (
                    <CButton
                      style={{ cursor: 'pointer' }}
                      size='sm'
                      className='ml-1 align-middle d-fex align-items-center'
                      color='danger'
                      onClick={() => setPowerModal(true)}>
                      <CIcon
                        className='mr-1'
                        size='sm'
                        content={freeSet.cilPowerStandby}
                      />
                      Kết thúc thẩm định
                    </CButton>
                  )}
              </CCol>
            </CRow>

            <CDataTable
              items={data}
              fields={fields}
              noItemsView={{
                noResults: 'Không có kết quả tìm kiếm',
                noItems: 'Không có dữ liệu',
              }}
              scopedSlots={{
                stt: (item: any, index: number) => {
                  return (
                    <td className='align-middle text-center'>{index + 1}</td>
                  )
                },
                mssv: (item: any) => {
                  return (
                    <td className='align-middle text-center'>{item.mssv}</td>
                  )
                },
                name: (item: any) => {
                  return (
                    <td className='align-middle'>
                      {item.surname + ' ' + item.name}
                    </td>
                  )
                },
                email: (item: any) => {
                  return <td className='align-middle'>{item.email}</td>
                },
                department: (item: any) => {
                  return <td className='align-middle'>{item.department}</td>
                },
                status: (item: any) => {
                  return (
                    <td className='align-middle text-center'>
                      {item.result === 'success'
                        ? 'Đạt'
                        : item.result === 'failure'
                        ? 'Không đạt'
                        : 'Hồ sơ chưa duyệt'}
                    </td>
                  )
                },
                updatedAt: (item: any) => {
                  return (
                    <td className='align-middle text-center'>
                      <Moment fromNow local locale='vi'>
                        {item.updatedAt}
                      </Moment>
                    </td>
                  )
                },
                action: (item: any) => {
                  return (
                    <>
                      <td className='d-flex justify-content-start'>
                        <>
                          {[roles.MANAGER, roles.PARTICIPANT].includes(
                            currentUser.role
                          ) &&
                            [
                              achievement?.auditorFinalId,
                              ...achievement?.auditorsListId,
                            ].includes(currentUser.id) && (
                              <CTooltip content='Duyệt hồ sơ'>
                                <CButton
                                  size='sm'
                                  color='info'
                                  className='ml-1 mt-1'
                                  onClick={() =>
                                    history.push(
                                      `/duyet-ho-so/${achievement.id}/${item.mssv}`
                                    )
                                  }>
                                  <CIcon
                                    size='sm'
                                    content={freeSet.cilColorBorder}
                                  />
                                </CButton>
                              </CTooltip>
                            )}
                        </>
                      </td>
                    </>
                  )
                },
              }}></CDataTable>
            <div className={'mt-2 d-flex justify-content-center'}>
              <CPagination
                activePage={filters.page}
                className='align-middle text-center'
                pages={Math.ceil(count / filters.limit)}
                onActivePageChange={(i: number) =>
                  setFilters({ ...filters, page: i })
                }></CPagination>
            </div>
          </CCardBody>
        </CCard>
      )}

      <CModal
        show={lockModal}
        className='mt-5'
        onClose={() => setLockModal(false)}
        color='warning'>
        <CModalHeader closeButton>
          <CModalTitle>Khóa tạm thời</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div style={{ color: 'red', marginBottom: '10px' }}>{textError}</div>
          Thành viên hội đồng xét duyệt sẽ <b>
            {' '}
            không thể thẩm định hồ sơ{' '}
          </b>{' '}
          cho tới khi khóa được mở
        </CModalBody>

        <CModalFooter>
          <CButton color='info' onClick={() => handleLock('TEMPORARY')}>
            Xác nhận
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal
        show={powerModal}
        className='mt-5'
        onClose={() => setPowerModal(false)}
        color='danger'>
        <CModalHeader closeButton>
          <CModalTitle>Kết thúc thẩm định hồ sơ</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div style={{ color: 'red', marginBottom: '10px' }}>{textError}</div>
          Thẩm định hồ sơ sẽ <b> kết thúc ngay lập tức </b>
        </CModalBody>

        <CModalFooter>
          <CButton color='info' onClick={() => handleLock('FOREVER')}>
            Xác nhận
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default UserSubmission
