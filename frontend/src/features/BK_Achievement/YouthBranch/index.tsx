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
import { RootState } from '../../../store'
import { useEffect, useState } from 'react'
import { roles } from '../../../common/roles'
import { FormYouthBranch } from './components/FormYouthBranch'
import { FormDeleteYouthBranch } from './components/FormDeleteYouthBranch'
import InputSearch from '../../../common/InputFilterSearch'
import Spinner from '../../../common/Spinner'
import YouthBranchApi from '../../../api/Achievement/youthBranchApi'
import { RouteComponentProps } from 'react-router-dom'
import UserApi from '../../../api/Achievement/userApi'

const fields = [
  {
    key: 'name',
    label: 'Tên đơn vị/ đội',
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

interface Filters {
  code: string
  limit: number
  page: number
  search: string
}
interface TParam {
  id: string
}

function YouthBranch({ match }: RouteComponentProps<TParam>) {
  // const { achievementList, handleCourseUpdate, handleCourseDelete } = props
  const history = useHistory()
  const user = useSelector((state: RootState) => state.user)
  const isSpinner = useSelector((state: RootState) => state.spinner)
  const [modalDelete, setModalDelete] = useState(false)
  const [modal, setModal] = useState({
    open: false,
    isAdd: true,
    value: {
      code: match.params.id,
      id: '',
      name: '',
    },
  })
  const [count, setCount] = useState(1)
  const [data, setData] = useState<any[]>([])
  const [filters, setFilters] = useState<Filters>({
    code: match.params.id,
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
    async function getDepartmentAndYouthBranch() {
      try {
        const { data, count } = await YouthBranchApi.get(filters)
        setCount(count)
        setData(data)
      } catch (error) {
        console.error(error)
        history.push('/loi-truy-cap')
      }
    }
    verifyLogin()
    getDepartmentAndYouthBranch()
  }, [filters, count, history])

  const handleChangeSearch = (formValue: { text: string }) => {
    setFilters({
      ...filters,
      page: 1,
      search: formValue.text,
    })
  }

  const handleAddDepartment = (department: any) => {
    setData((data) => [department, ...data])
  }

  const handleUpdateDepartment = (department: any) => {
    setData((data) =>
      data.map((item) => (department.id === item.id ? department : item))
    )
  }

  if (isSpinner) return <Spinner />
  return (
    <>
      <CCard>
        <CCardHeader>
          <strong> QUẢN LÍ ĐƠN VỊ/ ĐỘI </strong>
        </CCardHeader>
        <CCardBody>
          <CRow className='mb-2'>
            <CCol sm='4' className='d-flex align-items-center'>
              <CTooltip content={`Tên ĐƠN VỊ/ ĐỘI`}>
                <CIcon className='mr-1' size='lg' content={freeSet.cilFilter} />
              </CTooltip>
              <InputSearch onSubmit={handleChangeSearch} />
            </CCol>
            <CCol sm='5'></CCol>
            <CCol
              sm='3'
              className='d-flex justify-content-end align-items-center'>
              <div>Số lượng/ trang:</div>
              <CSelect
                defaultValue={'10'}
                style={{ width: '60px', float: 'right', margin: '0 10px' }}
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
              <CTooltip content='Thêm'>
                <CButton
                  size='sm'
                  color='info'
                  className='mr-2'
                  onClick={() =>
                    setModal((modal) => ({
                      ...modal,
                      open: true,
                      isAdd: true,
                      value: { code: match.params.id, id: '', name: '' },
                    }))
                  }>
                  <CIcon size='lg' content={freeSet.cilNoteAdd} />
                </CButton>
              </CTooltip>
            </CCol>
            <CCol sm='4'></CCol>
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
              name: (item: any) => {
                return <td className='align-middle text-center'>{item.name}</td>
              },
              action: (item: any) => {
                return (
                  <>
                    {roles.ADMIN.includes(user.role) && (
                      <>
                        <td className='text-center'>
                          <CButton
                            size='sm'
                            color='info'
                            className='ml-1 mt-1'
                            onClick={() =>
                              setModal((modal) => ({
                                ...modal,
                                isAdd: false,
                                open: true,
                                value: {
                                  code: match.params.id,
                                  id: item.id,
                                  name: item.name,
                                },
                              }))
                            }>
                            <CIcon size='sm' content={freeSet.cilSettings} />
                          </CButton>
                          {/* <CButton
                            size='sm'
                            color='danger'
                            className='ml-1 mt-1'
                            onClick={() => setModalDelete(true)}>
                            <CIcon size='sm' content={freeSet.cilTrash} />
                          </CButton> */}
                        </td>
                      </>
                    )}
                  </>
                )
              },
            }}></CDataTable>
          <div className={'mt-2 d-flex justify-content-center'}>
            <CPagination
              activePage={filters.page}
              className='align-middle text-center'
              pages={Math.ceil(count / filters.limit)}
              onActivePageChange={(i: number) => {
                setFilters({ ...filters, page: i })
              }}></CPagination>
          </div>
        </CCardBody>
      </CCard>

      <FormYouthBranch
        value={modal.value}
        onAddDepartment={handleAddDepartment}
        onUpdateDepartment={handleUpdateDepartment}
        isOpen={modal.open}
        isAdd={modal.isAdd}
        onClose={() =>
          setModal((data) => ({
            ...data,
            open: false,
          }))
        }
      />
      <FormDeleteYouthBranch
        isOpen={modalDelete}
        onClose={() => setModalDelete(false)}
      />
    </>
  )
}

export default YouthBranch
