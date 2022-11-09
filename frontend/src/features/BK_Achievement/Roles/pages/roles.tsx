import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CPagination,
  CRow,
  CSelect,
  CTooltip,
} from '@coreui/react'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import UserApi from '../../../../api/Achievement/userApi'
import RolesList from '../components/rolesList'
import Select from 'react-select'
import InputSearch from '../../../../common/InputFilterSearch'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'

const roles = [
  { value: 'participant', label: 'Người dùng' },
  { value: 'admin', label: 'Quản trị hệ thống' },
  { value: 'manager', label: 'Quản lý hệ thống' },
  { value: 'department', label: 'Phòng/ Ban/ Đơn vị' },
]

const convertNameRoles = (role: string) => {
  switch (role) {
    case 'participant':
      return 'Người dùng'
    case 'admin':
      return 'Quản trị hệ thống'
    case 'manager':
      return 'Quản lý hệ thống'
    case 'department':
      return 'Phòng/ Ban/ Đơn vị'
    default:
      return ''
  }
}

interface Filters {
  limit: number
  page: number
  search: string
  except: string
}

function CoursePage() {
  const [userList, setUserList] = useState<any[]>([])
  const [value, setValue] = useState<{ email: string; role: string }>({
    email: '',
    role: '',
  })
  const [errAdd, setErrAdd] = useState('')
  const history = useHistory()
  const [open, setOpen] = useState(false)

  const [filters, setFilters] = useState<Filters>({
    limit: 10,
    page: 1,
    search: '',
    except: '',
  })
  const [count, setCount] = useState(1)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, count } = await UserApi.getFilter({
          ...filters,
          except: 'participant',
        })

        setUserList(
          data.map((user) => {
            const role = convertNameRoles(user.role)
            return { ...user, role }
          })
        )
        setCount(count)
      } catch (error) {
        console.error(error)
      }
    }

    fetchUser()
  }, [history, filters])

  useEffect(() => {
    if (!open) setValue({ email: '', role: '' })
  }, [open])

  const handleSubmit = async () => {
    const regularEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if (!regularEmail.test(value.email)) {
      setErrAdd('Email không hợp lệ')
    } else if (!value.email.split('@').includes('hcmut.edu.vn')) {
      setErrAdd('Email phải thuộc hcmut.edu.vn')
    } else if (value.role === '') {
      setErrAdd('Vui lòng không để trống')
    } else {
      try {
        const newUser = await UserApi.create(value)

        newUser.role = convertNameRoles(newUser.role)
        setUserList([newUser, ...userList])
        setValue({ email: '', role: '' })
        setOpen(false)
      } catch (error) {
        console.error(error)
      }
    }
  }

  const handleUpdateUser = async (newUser: any) => {
    newUser.role = convertNameRoles(newUser?.role)
    setUserList(
      userList.map((user) => (user.id === newUser.id ? newUser : user))
    )
  }

  const handleDeleteUser = async (id: number) => {
    try {
      setUserList(userList.filter((user) => user.id !== id))
    } catch (error) {
      console.error(error)
    }
  }

  const handleChangeSearch = (formValue: { text: string }) => {
    setFilters({
      ...filters,
      page: 1,
      search: formValue.text,
      except: '',
    })
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <strong>DANH SÁCH QUYỀN TRUY CẬP</strong>
          </CCardHeader>
          <CCardBody>
            <CRow className='mb-2'>
              <CCol sm='4' className='d-flex align-items-center'>
                <CTooltip content={`Tên`}>
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
                sm='2'
                className='d-flex justify-content-end align-items-center'>
                Số lượng/ trang
              </CCol>

              <CCol
                sm='auto'
                className='d-flex justify-content-end align-items-center'>
                <CSelect
                  defaultValue={'10'}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFilters({
                      ...filters,
                      limit: +e.currentTarget.value,
                    })
                  }>
                  <option value='5'>5</option>
                  <option value='10' selected>
                    10
                  </option>
                  <option value='20'>20</option>
                  <option value='50'>50</option>
                </CSelect>
              </CCol>
              <CCol>
                <CButton
                  color='info'
                  size=''
                  style={{ float: 'right', margin: '8px' }}
                  onClick={() => setOpen(true)}
                  className='align-middle justify-content-center'>
                  Thêm
                </CButton>
              </CCol>
            </CRow>
            <RolesList
              courseList={userList}
              handleUpdateUser={handleUpdateUser}
              handleDeleteUser={handleDeleteUser}></RolesList>
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
      </CCol>
      <CCardBody>
        <CModal
          show={open}
          onClose={() => {
            setOpen(false)
          }}
          size='lg'
          color='info'>
          <CModalHeader closeButton>
            <CModalTitle>Thêm quyền truy cập gg</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow>
              <CCol xs='12' style={{ color: 'red' }}>
                {errAdd}
              </CCol>
              <CCol xs={8}>
                <CInput
                  placeholder='abcxyz@hcmut.edu.vn'
                  type='email'
                  required
                  onChange={(e) =>
                    setValue({ email: e.currentTarget.value, role: value.role })
                  }
                />
              </CCol>
              <CCol xs={4}>
                <Select
                  className='mb-3'
                  placeholder='Vui lòng chọn'
                  isClearable={true}
                  onChange={(newValue) =>
                    setValue({
                      email: value.email,
                      role: newValue?.value || '',
                    })
                  }
                  options={roles}
                />
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton color='info' onClick={handleSubmit}>
              Gửi
            </CButton>
          </CModalFooter>
        </CModal>
      </CCardBody>
    </CRow>
  )
}

export default CoursePage
