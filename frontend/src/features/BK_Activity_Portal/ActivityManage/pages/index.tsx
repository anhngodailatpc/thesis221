import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CPagination,
  CRow,
  CLink,
  CSelect,
  CTooltip,
} from '@coreui/react'
import 'moment/locale/vi'
import Moment from 'react-moment'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../store'
import { useEffect, useState } from 'react'
import { roles } from '../../../../common/roles'
import { FormAdd } from '../components/FormAdd'
import { FormInfo } from '../components/FormInfo'
import { FormQR } from '../components/FormQR'
import { FormResponse } from '../components/FormResponse'
import { FormDelete } from '../components/FormDelete'
import { ModalResponse } from '../components/ModalResponse'
import InputSearch from '../../../../common/InputFilterSearch'
import Spinner from '../../../../common/Spinner'
import UserApi from '../../../../api/Achievement/userApi'
import activityApi from '../../../../api/BKAP/activity'
import PopUpModal from '../../ActivityCampaign/components/PopUpModal'

const fields = [
  {
    key: 'stt',
    label: 'STT',
    _style: { textAlign: 'center' },
  },
  {
    key: 'name',
    label: 'Tên hoạt động',
  },
  {
    key: 'status',
    label: 'Tình trạng',
    sorter: false,
    filter: false,
    _style: { textAlign: 'center' },
  },
  {
    key: 'link',
    label: 'Link đính kèm',
    sorter: false,
    filter: false,
    _style: { textAlign: 'center' },
  },
  {
    key: 'detail',
    label: 'Chi tiết',
    sorter: false,
    filter: false,
    _style: { textAlign: 'center' },
  },
  {
    key: 'updatedAt',
    label: 'Lần cập nhật cuối',
    sorter: false,
    filter: false,
    _style: { textAlign: 'center' },
  },
  {
    key: 'response',
    label: 'Phản hồi',
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
  limit: number
  page: number
  search: string
}

function Department(props: any) {
  const history = useHistory()
  const user = useSelector((state: RootState) => state.user)
  const isSpinner = useSelector((state: RootState) => state.spinner)
  const [modalDelete, setModalDelete] = useState(false)
  const [maximumDepartment, setMaximumDepartment] = useState(0)
  const [modal, setModal] = useState({
    open: false,
    isAdd: true,
    value: {
      id: '',
      name: '',
      maximumParticipant: 0,
      campaign: '',
      activityGroup: '',
      maximumCTXH: 0,
      registerStartDay: null,
      registerEndDay: null,
      startDay: null,
      endDay: null,
      departments: [],
      link: '',
      content: '',
    },
  })
  const [modalResponse, setModalResponse] = useState({
    open: false,
    value: {
      id: 0,
      status: '',
      noteStatus: '',
    },
  })
  const [modalResponseContent, setModalResponseContent] = useState({
    open: false,
    value: {
      data: '',
    },
  })
  const [modalInfo, setModalInfo] = useState({
    open: false,
    data: {},
  })
  const [modalQR, setModalQR] = useState({
    open: false,
    id: 'uuid',
  })
  const [count, setCount] = useState(1)
  const [data, setData] = useState<any[]>([])
  const [filters, setFilters] = useState<Filters>({
    limit: 10,
    page: 1,
    search: '',
  })

  useEffect(() => {
    if (user.role === roles.DEPARTMENT)
      fields.map((item,index) => {
        if (item.key === 'response') delete fields[index]
        return item
      })
  }, [user.role])

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await UserApi.verifyLogin()
      } catch {
        history.push('/login')
      }
    }
    async function getActivity() {
      try {
        const {
          data,
          count,
          maximumDepartment: countDepartment,
        } = await activityApi.get(filters)
        setCount(count)
        setData(data)
        setMaximumDepartment(countDepartment)
      } catch (error) {
        console.error(error)
      }
    }
    verifyLogin()
    getActivity()
  }, [filters, count, history])

  const handleChangeSearch = (formValue: { text: string }) => {
    setFilters({
      ...filters,
      page: 1,
      search: formValue.text,
    })
  }

  const handleActivity = async () => {
    try {
      const {
        data,
        count,
        maximumDepartment: countDepartment,
      } = await activityApi.get(filters)
      setCount(count)
      setData(data)
      setMaximumDepartment(countDepartment)
    } catch (error) {
      console.error(error)
    }
  }
  const onUpdateResponse = (value: any) => {
    setData(
      data.map((item) => {
        if (item.id === value.id) {
          item.status = value.status
          item.noteStatus = value.noteStatus
          return item
        }
        return item
      })
    )
  }
  //pop up
  const [openPopUp, setOpenPopup] = useState(false)
  const [popUpMsg, setPopUpMsg] = useState('')
  const [PopUpColorType, setPopUpColorType] = useState<
    'danger' | 'success' | 'warning' | 'info'
  >('info')

  //delete
  const [deleteId, setDeleteId] = useState('')

  const onDeleteConfirm = async () => {
    const res = await activityApi.delete(deleteId)
    if (res.status === 200) {
      setPopUpMsg('Xóa thành công')
      setPopUpColorType('success')
      setModalDelete(false)
      setDeleteId('')
      setOpenPopup(true)
    } else if (res.status === 403) {
      setPopUpMsg('Không thể xóa đợt hoạt động này')
      setPopUpColorType('warning')
      setModalDelete(false)
      setDeleteId('')
      setOpenPopup(true)
    } else {
      setPopUpMsg('Đã có lỗi xảy ra')
      setPopUpColorType('danger')
      setModalDelete(false)
      setDeleteId('')
      setOpenPopup(true)
    }
  }
  if (isSpinner) return <Spinner />
  return (
    <>
      <CCard>
        <CCardHeader>Quản lý hoạt động</CCardHeader>
        <CCardBody>
          <CRow className='mb-2'>
            <CCol sm='4' className='d-flex align-items-center'>
              <CTooltip content={`Tên hoạt động`}>
                <CIcon className='mr-1' size='lg' content={freeSet.cilFilter} />
              </CTooltip>
              <InputSearch onSubmit={handleChangeSearch} />
            </CCol>
            <CCol
              sm='8'
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
                  setModal((modal) => ({
                    ...modal,
                    open: true,
                    isAdd: true,
                    value: {
                      id: '',
                      name: '',
                      maximumParticipant: 0,
                      campaign: '',
                      activityGroup: '',
                      maximumCTXH: 0,
                      registerStartDay: null,
                      registerEndDay: null,
                      startDay: null,
                      endDay: null,
                      departments: [],
                      link: '',
                      content: '',
                    },
                  }))
                }>
                <CIcon size='' className='mr-2' content={freeSet.cilNoteAdd} />
                Thêm
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
              code: (item: any) => {
                return <td className='align-middle text-center'>{item.code}</td>
              },
              detail: (item: any) => {
                return (
                  <td className='align-middle text-center'>
                    <CButton
                      size='sm'
                      color='light'
                      className='ml-1 mt-1'
                      onClick={() =>
                        setModalInfo((modal) => ({
                          ...modal,
                          open: true,
                          data: item,
                        }))
                      }>
                      Chi tiết
                    </CButton>
                  </td>
                )
              },
              status: (item: any) => {
                let status = 'Chưa cập nhật'
                switch (item.status) {
                  case 'CREATED':
                    status = 'Chưa duyệt'
                    break
                  case 'PASS':
                    status = 'Đã duyệt'
                    break
                  case 'PASSCONDITION':
                    status = 'Duyệt có điều kiện'
                    break
                  case 'NOPASS':
                    status = 'Không được duyệt'
                    break
                  default:
                    break
                }
                return (
                  <td className='align-middle text-center'>
                    <CButton
                      size='sm'
                      color='light'
                      className='ml-1 mt-1'
                      onClick={() =>
                        setModalResponseContent((modal) => ({
                          ...modal,
                          open: true,
                          value: {
                            data: item.noteStatus,
                          },
                        }))
                      }>
                      {status}
                    </CButton>
                  </td>
                )
              },
              name: (item: any) => {
                return <td className='align-middle'>{item.name}</td>
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
              link: (item: any) => {
                return (
                  <td className='align-middle text-center'>
                    {item.link && (
                      <CLink href={item.link} target='_blank'>
                        link
                      </CLink>
                    )}
                  </td>
                )
              },
              response: (item: any) => {
                return (
                  <td className='align-middle text-center'>
                    <CButton
                      size='sm'
                      color='light'
                      className='ml-1 mt-1'
                      onClick={() =>
                        setModalResponse((modal) => ({
                          ...modal,
                          open: true,
                          value: {
                            id: item.id,
                            status: item.status,
                            noteStatus: item.noteStatus,
                          },
                        }))
                      }>
                      Phản hồi hoạt động
                    </CButton>
                  </td>
                )
              },
              action: (item: any) => {
                return (
                  <>
                    <td className='align-middle text-center'>
                      {['NOPASS', 'CREATED'].includes(item.status) || (
                        <>
                          <CTooltip content='Danh sách cán bộ đăng ký'>
                            <CButton
                              size='sm'
                              color='warning'
                              className='ml-1 mt-1'
                              onClick={() =>
                                history.push(
                                  `/hoat-dong/danh-sach-dang-ky/${item.id}`
                                )
                              }>
                              <CIcon size='sm' content={freeSet.cilList} />
                            </CButton>
                          </CTooltip>
                          <CTooltip content='Mã QR'>
                            <CButton
                              size='sm'
                              color='light'
                              className='ml-1 mt-1'
                              onClick={() =>
                                setModalQR((modal) => ({
                                  ...modal,
                                  open: true,
                                  id: item.id,
                                }))
                              }>
                              <CIcon size='sm' content={freeSet.cilQrCode} />
                            </CButton>
                          </CTooltip>
                        </>
                      )}

                      {['PASS', 'PASSCONDITION'].includes(item.status) || (
                        <>
                          <CTooltip content='Chỉnh sửa'>
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
                                    ...item,
                                  },
                                }))
                              }>
                              <CIcon size='sm' content={freeSet.cilSettings} />
                            </CButton>
                          </CTooltip>
                          <CTooltip content='Xóa'>
                            <CButton
                              size='sm'
                              color='danger'
                              className='ml-1 mt-1'
                              onClick={() => {
                                setDeleteId(item.id)
                                setModalDelete(true)
                              }}>
                              <CIcon size='sm' content={freeSet.cilTrash} />
                            </CButton>
                          </CTooltip>
                        </>
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
      {modal.open && (
        <FormAdd
          value={modal.value}
          onActionActivity={handleActivity}
          maximumDepartment={maximumDepartment}
          isOpen={modal.open}
          isAdd={modal.isAdd}
          onClose={() =>
            setModal((data) => ({
              ...data,
              open: false,
            }))
          }
        />
      )}
      {modalResponse.open && (
        <FormResponse
          value={modalResponse.value}
          onUpdateResponse={onUpdateResponse}
          isOpen={modalResponse.open}
          onClose={() =>
            setModalResponse((data) => ({
              ...data,
              open: false,
            }))
          }
        />
      )}

      {modalResponseContent.open && (
        <ModalResponse
          data={modalResponseContent.value.data}
          isOpen={modalResponseContent.open}
          onClose={() =>
            setModalResponseContent((data) => ({
              ...data,
              open: false,
            }))
          }
        />
      )}

      <FormInfo
        isOpen={modalInfo.open}
        data={modalInfo.data}
        maximumDepartment={maximumDepartment}
        onClose={() =>
          setModalInfo((data) => ({
            ...data,
            open: false,
          }))
        }
      />
      <FormQR
        manageActivityId={modalQR.id}
        isOpen={modalQR.open}
        onClose={() =>
          setModalQR((data) => ({
            ...data,
            open: false,
          }))
        }
        link={`http://tuyenduong.tuoitrebachkhoa.edu.vn/qr-reg/${modalQR.id}`}
      />
      <FormDelete
        isOpen={modalDelete}
        onClose={() => setModalDelete(false)}
        onDeleteConfirm={onDeleteConfirm}
      />
      {openPopUp ? (
        <PopUpModal
          msg={popUpMsg}
          colorType={PopUpColorType}
          onClose={() => {
            setOpenPopup(false)
          }}
        />
      ) : (
        <></>
      )}
    </>
  )
}

export default Department
