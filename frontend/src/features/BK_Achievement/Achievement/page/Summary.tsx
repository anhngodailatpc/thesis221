import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CDataTable,
  CPagination,
  CTooltip,
  CRow,
  CSelect,
} from '@coreui/react'
import { CChart } from '@coreui/react-chartjs'
import React, { useEffect, useState } from 'react'
import achievementApi from '../../../../api/Achievement/achievementApi'
import { CSVLink } from 'react-csv'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../store'
import { roles } from '../../../../common/roles'
import InputSearch from '../../../../common/InputFilterSearch'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import SummaryDepartment from '../components/SummaryDepartment'
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
    label: 'Phòng/ Ban',
    _style: { width: '25%', textAlign: 'center' },
  },
  {
    key: 'result',
    label: 'Kết quả',
    sorter: false,
    filter: false,
    _style: { width: '10%', textAlign: 'center' },
  },
]

const headers = [
  { label: 'Mã số cán bộ', key: 'mssv' },
  { label: 'Họ và tên đệm', key: 'surname' },
  { label: 'Tên', key: 'name' },
  { label: 'Email', key: 'email' },
  { label: 'Phòng/Ban', key: 'department' },
  { label: 'Kết quả', key: 'result' },
]

interface TParam {
  id: string
}

interface Filters {
  limit: number
  page: number
  search: string
}

const Summary = ({ match }: RouteComponentProps<TParam>) => {
  const achievementId = parseInt(match.params.id)
  const [data, setData] = useState<any[]>([])
  const [count, setCount] = useState(1)
  const [dataCSV, setDataCSV] = useState<any[]>([])
  const [filters, setFilters] = useState<Filters>({
    limit: 10,
    page: 1,
    search: '',
  })
  const [pie, setPie] = useState({
    labels: ['không đạt', 'đạt'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  })
  const history = useHistory()
  const currentUser = useSelector((state: RootState) => state.user)

  useEffect(() => {
    achievementApi
      .getResult(achievementId, { limit: 9999, page: 1, search: '' })
      .then(({ data: users }) => {
        let success = 0,
          failed = 0
        const dataFormat = users.map((res: any) => {
          res.result ? success++ : failed++
          return {
            ...res,
            result: res.result ? 'Đạt' : 'Không Đạt',
          }
        })
        setDataCSV(dataFormat)
      })
      .catch((error: any) => {
        console.error(error.message)
        history.push('/loi-truy-cap')
      })
  }, [achievementId, history])

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await UserApi.verifyLogin()
      } catch {
        history.push('/login')
      }
    }
    async function getResult(id: number) {
      try {
        const { data: users, count } = await achievementApi.getResult(
          id,
          filters
        )
        setCount(count)
        let success = 0,
          failed = 0
        setData(
          users.map((res: any,index) => {
            res.result ? success++ : failed++
            return {
              ...res,
              result: res.result ? 'Đạt' : 'Không Đạt',
            }
          })
        )

        setPie({
          labels: ['không đạt', 'đạt'],
          datasets: [
            {
              data: [failed, success],
              backgroundColor: ['#FF6384', '#36A2EB'],
              hoverBackgroundColor: ['#FF6384', '#36A2EB'],
            },
          ],
        })
      } catch (error) {
        console.error(error)
        history.push('/loi-truy-cap')
      }
    }
    if (roles.MANAGER.includes(currentUser.role)) {
      getResult(achievementId)
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

  return (
    <>
      {roles.MANAGER.includes(currentUser.role) && (
        <CCard>
          <CCardBody>
            <CRow>
              <CCol sm='4'>
                <h4>
                  <strong>BIỂU ĐỒ TỔNG KẾT</strong>
                </h4>
                <div className='chart-wrapper'>
                  <CChart
                    type='pie'
                    datasets={pie.datasets}
                    labels={pie.labels}
                  />
                </div>
              </CCol>
              <CCol sm='8'>
                <h4>
                  <strong>
                    KHẢO SÁT TỔNG KẾT THEO PHÒNG/BAN
                  </strong>
                </h4>
                <SummaryDepartment achievementId={achievementId} />
              </CCol>
            </CRow>
            <hr />
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
                <CButton
                  color='info'
                  size=''
                  style={{ float: 'right' }}
                  className='align-middle justify-content-center ml-3'>
                  <CSVLink
                    data={dataCSV}
                    headers={headers}
                    filename={'thong-ke-danh-hieu-giai-thuong.csv'}
                    style={{ color: 'white' }}
                    >
                    Xuất dữ liệu
                  </CSVLink>
                </CButton>
              </CCol>
              <CCol sm='4'></CCol>
            </CRow>

            <CDataTable
              items={data}
              fields={fields}
              noItemsView={{
                noResults: 'Không có kết quả tìm kiếm',
                noItems: 'Không có dữ liệu',
              }}
              scopedSlots={{
                stt: (item: any,index:number) => {
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
                  return (
                    <td className='align-middle text-center'>{item.email}</td>
                  )
                },
                department: (item: any) => {
                  return (
                    <td className='align-middle text-center'>
                      {item.department}
                    </td>
                  )
                },
                result: (item: any) => {
                  return (
                    <td className='align-middle text-center'>{item.result}</td>
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
    </>
  )
}

export default Summary
