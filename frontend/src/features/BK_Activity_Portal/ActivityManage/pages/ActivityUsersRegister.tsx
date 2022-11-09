import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CPagination,
  CRow,
  CSelect,
  CTooltip,
} from '@coreui/react'
import 'moment/locale/vi'
import CIcon from '@coreui/icons-react'

import { freeSet } from '@coreui/icons'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../store'
import { useEffect, useState } from 'react'
import { roles } from '../../../../common/roles'
import { FormApprovalUser } from '../components/FormApprovalUser'
import InputSearch from '../../../../common/InputFilterSearch'
import Spinner from '../../../../common/Spinner'
import UserApi from '../../../../api/Achievement/userApi'
import { RouteComponentProps } from 'react-router-dom'
import Toaster from '../../../../common/toast/indexCommon'
import activityRegistrationApi from '../../../../api/BKAP/activityRegistration'

const fields = [
  {
    key: 'stt',
    label: 'STT',
    _style: { textAlign: 'center' },
  },
  {
    key: 'register',
    label: 'Lần đầu đăng ký',
    _style: { textAlign: 'center' },
  },
  {
    key: 'mssv',
    label: 'MSCB',
    sorter: false,
    filter: false,
    _style: { textAlign: 'center' },
  },
  {
    key: 'surname',
    label: 'Họ và tên lót',
    sorter: false,
    filter: false,
    _style: { textAlign: 'center' },
  },
  {
    key: 'name',
    label: 'Tên',
    sorter: false,
    filter: false,
    _style: { textAlign: 'center' },
  },
  {
    key: 'email',
    label: 'Email',
    sorter: false,
    filter: false,
    _style: { textAlign: 'center' },
  },
  {
    key: 'phone',
    label: 'Số điện thoại',
    sorter: false,
    filter: false,
    _style: { textAlign: 'center' },
  },
  {
    key: 'department',
    label: 'Đơn vị',
    sorter: false,
    filter: false,
    _style: { textAlign: 'center' },
  },
  {
    key: 'action',
    label: 'Thao tác',
    _style: { width: '10%', textAlign: 'center' },
    sorter: false,
    filter: false,
  },
]

interface Filters {
  limit: number
  page: number
  search: string
}

interface TParam {
  id: string
}

function ActivityUsersRegister({ match }: RouteComponentProps<TParam>) {
  const history = useHistory()
  const user = useSelector((state: RootState) => state.user)
  const isSpinner = useSelector((state: RootState) => state.spinner)
  const [modalApproval, setModalApproval] = useState({
    open: false,
    id: '',
  })
  const [count, setCount] = useState(1)
  const [notify, setNotify] = useState(false)
  const [textError, setTextError] = useState('')
  const [data, setData] = useState<any[]>([])
  const [filters, setFilters] = useState<Filters>({
    limit: 10,
    page: 1,
    search: '',
  })

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await UserApi.verifyLogin()
      } catch {
        history.push('/login')
      }
    }
    async function get() {
      try {
        const { data, count } = await activityRegistrationApi.getRegistered(
          filters,
          match.params.id
        )
        setCount(count)
        setData(data)
      } catch (error) {
        console.error(error)
      }
    }
    verifyLogin()
    get()
  }, [filters, count, history, match.params.id])

  const handleChangeSearch = (formValue: { text: string }) => {
    setFilters({
      ...filters,
      page: 1,
      search: formValue.text,
    })
  }

  const handleAction = async (status: string, registrationId: string) => {
    try {
      await activityRegistrationApi.updateRegistered(
        status,
        registrationId,
        match.params.id
      )
      setData(
        data.map((item) => {
          if (item.registrationid === registrationId) {
            return {
              ...item,
              status: status,
            }
          }
          return item
        })
      )
    } catch (error: any) {
      if (error?.response.data.statusCode === 400) {
        setTextError(error?.response.data.message)
        console.log('voday')
        setNotify(true)
        setTimeout(() => {
          setNotify(false)
        }, 3000)
      } else {
        console.error(error)
      }
    }
  }

  const handleApproveExcel = (dataExcel: string[]) => {
    setData(
      data.map((item) => {
        if (dataExcel.includes(item.registrationid))
          return {
            ...item,
            status: 'PASS',
          }
        return item
      })
    )
  }

  if (isSpinner) return <Spinner />
  return (
    <>
      <CCard>
        <CCardHeader>Danh sách cán bộ đăng ký</CCardHeader>
        <CCardBody>
          <CRow className='mb-2'>
            <CCol sm='4' className='d-flex align-items-center'>
              <CTooltip content={`Mssv,Họ và tên đệm,Tên,Email,Sđt,Đơn vị`}>
                <CIcon className='mr-1' size='lg' content={freeSet.cilFilter} />
              </CTooltip>
              <InputSearch onSubmit={handleChangeSearch} />
            </CCol>
            <CCol sm='2' className='d-flex align-items-center'>
              {data[0] && (
                <div>
                  Duyệt đăng ký:{' '}
                  {data.filter((item) => item.status === 'PASS').length}/
                  {data[0]?.max}
                </div>
              )}
            </CCol>
            <CCol
              sm='6'
              className='d-flex justify-content-end align-items-center'>
              <div>Số lượng/ trang:</div>
              <CSelect
                defaultValue={'10'}
                style={{ width: '65px', float: 'right', margin: '0 10px' }}
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
              <CButton
                size=''
                color='info'
                className='mr-2'
                onClick={() =>
                  setModalApproval({
                    ...modalApproval,
                    open: true,
                    id: match.params.id,
                  })
                }>
                Duyệt,Xuất dữ liệu
              </CButton>
            </CCol>
          </CRow>
          <CDataTable
            items={data}
            fields={fields}
            hover
            noItemsView={{
              noResults: 'Không có kết quả tìm kiếm',
              noItems: 'Không có dữ liệu',
            }}
            scopedSlots={{
              stt: (item: any, index: number) => {
                return <td className='align-middle text-center'>{index + 1}</td>
              },
              register: (item: any) => {
                return (
                  <td className='align-middle text-center'>Lần đầu đăng ký</td>
                )
              },
              mssv: (item: any) => {
                return <td className='align-middle text-center'>{item.mssv}</td>
              },
              surname: (item: any) => {
                return (
                  <td className='align-middle text-center'>{item.surname}</td>
                )
              },
              name: (item: any) => {
                return <td className='align-middle text-center'>{item.name}</td>
              },
              email: (item: any) => {
                return (
                  <td className='align-middle text-center'>{item.email}</td>
                )
              },
              phone: (item: any) => {
                return (
                  <td className='align-middle text-center'>{item.phone}</td>
                )
              },
              department: (item: any) => {
                return (
                  <td className='align-middle text-center'>
                    {item.departmentName}
                  </td>
                )
              },

              action: (item: any) => {
                return (
                  <>
                    <td className='align-middle text-center'>
                      {data.filter((item) => item.status === 'PASS').length <
                        data[0]?.max &&
                        item.status === 'REGISTERED' && (
                          <CButton
                            size='sm'
                            color='light'
                            onClick={() =>
                              handleAction('PASS', item.registrationid)
                            }>
                            Chưa duyệt
                          </CButton>
                        )}
                      {item.status === 'PASS' && (
                        <CButton
                          size='sm'
                          color='danger'
                          onClick={() =>
                            handleAction('REGISTERED', item.registrationid)
                          }>
                          Hủy
                        </CButton>
                      )}
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
      <FormApprovalUser
        isOpen={modalApproval.open}
        id={modalApproval.id}
        data={data}
        handleApproveExcel={handleApproveExcel}
        onClose={() =>
          setModalApproval((data) => ({
            ...data,
            open: false,
          }))
        }
      />
      {notify && (
        <Toaster
          title='Duyệt hồ sơ sinh viên'
          content={textError}
          timer={3000}
        />
      )}
    </>
  )
}

export default ActivityUsersRegister
