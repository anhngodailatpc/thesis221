import { freeSet } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
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
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import InputSearch from '../../../../common/InputFilterSearch'
import ActivityCampaign from '../../../../types/ActivityCampaign'
import activityCampaignApi from '../../../../api/BKAP/activityCampaignApi'
import CampaignAdd from '../components/CampaignAdd'
import CampaignModify from '../components/CampaignModify'
import 'moment/locale/vi'
import CampaignDeleteAlert from '../components/CampaignDeleteAlert'
import PopUpModal from '../components/PopUpModal'

interface ActivityCampaignExtend {
  id: string
  name: string
  planStartDay: Date | null
  planEndDay: Date | null
  startDay: Date | null
  endDay: Date | null
  createdAt: Date | null
  updatedAt: Date | null
}

interface Filters {
  limit: number
  page: number
  search: string
}

const CampaignPage = () => {
  //add form

  const [openAddForm, setOpenAddForm] = useState(false)
  //modify form
  const [openModifyForm, setOpenModifyForm] = useState(false)
  const [modifyItem, setModifyItem] = useState<ActivityCampaignExtend>()
  //pop up
  const [openPopUp, setOpenPopup] = useState(false)
  const [popUpMsg, setPopUpMsg] = useState('')
  const [PopUpColorType, setPopUpColorType] = useState<
    'danger' | 'success' | 'warning' | 'info'
  >('info')
  //delete
  const [DeleteModal, setDeleteModal] = useState(false)
  const [deleteItem, setDeleteItem] = useState<ActivityCampaignExtend>()
  //filter
  const [Filter, setFilter] = useState<Filters>({
    limit: 10,
    page: 1,
    search: '',
  })
  const [count, setCount] = useState(0)
  //display data
  const [data, setData] = useState<ActivityCampaignExtend[]>([])

  useEffect(() => {
    const getData = async () => {
      const { data, count } = await activityCampaignApi.getAllWithFilter(Filter)
      setData(data)
      setCount(count)
    }
    getData()
  }, [Filter])
  const fields = [
    {
      key: 'stt',
      label: 'STT',
      _style: { textAlign: 'center' },
    },
    {
      key: 'name',
      label: 'Tên đợt hoạt động',
      _style: { textAlign: 'start' },
    },
    {
      key: 'planStartDay',
      label: 'Nộp kế hoạch từ',
      sorter: false,
      filter: false,
      _style: { width: '14%', textAlign: 'center' },
    },
    {
      key: 'planEndDay',
      label: 'Kết thúc nộp kế hoạch',
      sorter: false,
      filter: false,
      _style: { width: '14%', textAlign: 'center' },
    },
    {
      key: 'startDay',
      label: 'Thời gian bắt đầu tổ chức',
      sorter: false,
      filter: false,
      _style: { width: '14%', textAlign: 'center' },
    },
    {
      key: 'endDay',
      label: 'Thời gian kết thúc tổ chức',
      sorter: false,
      filter: false,
      _style: { width: '14%', textAlign: 'center' },
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

  const onDeleteConfirm = async (id: string) => {
    const res = await activityCampaignApi.delete(id)
    if (res.status === 200) {
      setData(data.filter((item) => item.id !== id))
      setPopUpMsg('Xóa thành công')
      setPopUpColorType('success')
      setDeleteModal(false)
      setOpenPopup(true)
    } else if (res.status === 403) {
      setPopUpMsg('Không thể xóa đợt hoạt động này')
      setPopUpColorType('warning')
      setDeleteModal(false)
      setOpenPopup(true)
    } else {
      setPopUpMsg('Đã có lỗi xảy ra')
      setPopUpColorType('danger')
      setDeleteModal(false)
      setOpenPopup(true)
    }
  }

  const handleChangeSearch = (formValue: { text: string }) => {
    setFilter({
      ...Filter,
      page: 1,
      search: formValue.text,
    })
  }

  const addNewCampaign = (item: any) => {
    if (item.id) {
      setData([item, ...data])
      setPopUpMsg('Thêm đợt hoạt động thành công')
      setPopUpColorType('success')
      setOpenPopup(true)
    } else {
      setPopUpMsg('Đã có lỗi xảy ra')
      setPopUpColorType('danger')
      setOpenPopup(true)
    }
  }

  const updateNewCampaign = (item: any) => {
    if (item.id) {
      const idx = data.findIndex((cp) => cp.id === item.id)
      const items = [...data]
      items[idx] = item
      setData(items)
      setPopUpMsg('Chỉnh sửa đợt hoạt động thành công')
      setPopUpColorType('success')
      setOpenPopup(true)
    } else {
      setPopUpMsg('Đã có lỗi xảy ra')
      setPopUpColorType('danger')
      setOpenPopup(true)
    }
  }
  return (
    <CCard>
      <CCardHeader>
        <strong>QUẢN LÝ ĐỢT HOẠT ĐỘNG</strong>
      </CCardHeader>
      <CCardBody>
        <CRow className='mb-2'>
          <CCol sm='4' className='d-flex align-items-center py-1'>
            <CTooltip content={`Tên đợt hoạt động`}>
              <CIcon className='mr1' size='lg' content={freeSet.cilFilter} />
            </CTooltip>
            <InputSearch onSubmit={handleChangeSearch} />
          </CCol>

          <CCol
            sm='8'
            className='d-flex justify-content-end align-items-center'>
            <div>Số lượng/ trang:</div>
            <CSelect
              defaultValue={'10'}
              style={{ width: '70px', float: 'right', margin: '0 10px' }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFilter({ ...Filter, limit: +e.currentTarget.value })
              }>
              <option value='5'>5</option>
              <option value='10' selected>
                10
              </option>
              <option value='20'>20</option>
              <option value='50'>50</option>
            </CSelect>
            <CButton
              color='primary'
              onClick={() => {
                setOpenAddForm(true)
              }}>
              Thêm mới
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
            stt: (item: ActivityCampaign, index: number) => {
              return <td className='align-middle text-center'>{index + 1}</td>
            },
            name: (item: ActivityCampaign) => {
              return (
                <td className='align-middle'>
                  <div> {item.name} </div>
                </td>
              )
            },
            planStartDay: (item: ActivityCampaignExtend) => {
              return (
                <td className='align-middle text-center'>
                  {moment(item.planStartDay).format('DD/MM/YYYY')}
                </td>
              )
            },
            planEndDay: (item: ActivityCampaignExtend) => {
              return (
                <td className='align-middle text-center'>
                  {moment(item.planEndDay).format('DD/MM/YYYY')}
                </td>
              )
            },
            startDay: (item: ActivityCampaign) => {
              return (
                <td className='align-middle text-center'>
                  {moment(item.startDay).format('DD/MM/YYYY')}
                </td>
              )
            },
            endDay: (item: ActivityCampaignExtend) => {
              return (
                <td className='align-middle text-center'>
                  {moment(item.endDay).format('DD/MM/YYYY')}
                </td>
              )
            },
            updatedAt: (item: ActivityCampaignExtend) => {
              return (
                <td className='align-middle text-center'>
                  {moment(item.updatedAt).format('DD/MM/YYYY')}
                </td>
              )
            },
            action: (item: ActivityCampaignExtend) => {
              return (
                <td className='align-middle text-center'>
                  <CTooltip content='Chỉnh sửa'>
                    <CButton
                      size='sm'
                      color='info'
                      className='ml-1'
                      onClick={() => {
                        setModifyItem(item)
                        //console.log(modifyItem);

                        setOpenModifyForm(true)
                      }}>
                      <CIcon size='sm' content={freeSet.cilSettings} />
                    </CButton>
                  </CTooltip>
                  <CTooltip content='Xóa'>
                    <CButton
                      size='sm'
                      color='danger'
                      className='ml-1'
                      onClick={() => {
                        setDeleteItem(item)
                        setDeleteModal(true)
                      }}>
                      <CIcon size='sm' content={freeSet.cilTrash} />
                    </CButton>
                  </CTooltip>
                </td>
              )
            },
          }}></CDataTable>
        <div className={'mt-2 d-flex justify-content-center'}>
          <CPagination
            activePage={Filter.page}
            className='align-middle text-center'
            pages={Math.ceil(count / Filter.limit)}
            onActivePageChange={(i: number) =>
              setFilter({ ...Filter, page: i })
            }></CPagination>
        </div>
        {openAddForm ? (
          <CampaignAdd
            onClose={() => {
              setOpenAddForm(false)
            }}
            addNewCampaign={addNewCampaign}
          />
        ) : (
          <></>
        )}
        {openModifyForm ? (
          <CampaignModify
            onClose={() => {
              setOpenModifyForm(false)
            }}
            item={modifyItem}
            updateNewCampaign={updateNewCampaign}
          />
        ) : (
          <></>
        )}
        {DeleteModal ? (
          <CampaignDeleteAlert
            onClose={() => {
              setDeleteModal(false)
            }}
            item={deleteItem}
            onDeleteConfirm={onDeleteConfirm}
          />
        ) : (
          <></>
        )}
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
      </CCardBody>
    </CCard>
  )
}

export default CampaignPage
