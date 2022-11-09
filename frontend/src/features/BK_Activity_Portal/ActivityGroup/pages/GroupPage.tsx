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

import React, { useEffect, useState } from 'react'
import InputSearch from '../../../../common/InputFilterSearch'
import ActivityGroup from '../../../../types/ActivityGroup'
import activityGroupApi from '../../../../api/BKAP/activityGroupApi'
import GroupAdd from '../components/GroupAdd'
import GroupModify from '../components/GroupModify'
import GroupDeleteAlert from '../components/GroupDeleteAlert'
import ActivityGroupExtend from '../../../../types/ActivityGroupExtend'
import PopUpModal from '../../ActivityCampaign/components/PopUpModal'
import moment from 'moment'

interface Filters {
  limit: number
  page: number
  search: string
}

const GroupPage = () => {
  //add form
  const [openAddForm, setOpenAddForm] = useState(false)
  //modify form
  const [OpenModifyForm, setOpenModifyForm] = useState(false)
  const [ModifyItem, setModifyItem] = useState<ActivityGroupExtend>()
  //delete
  const [DeleteModal, setDeleteModal] = useState(false)
  const [deleteItem, setDeleteItem] = useState<ActivityGroupExtend>()
  //popup
  const [openPopUp, setOpenPopup] = useState(false)
  const [popUpMsg, setPopUpMsg] = useState('')
  const [PopUpColorType, setPopUpColorType] = useState<
    'danger' | 'success' | 'warning' | 'info'
  >('info')
  //display data
  const [data, setData] = useState<ActivityGroupExtend[]>([])
  //filter
  const [Filter, setFilter] = useState<Filters>({
    limit: 10,
    page: 1,
    search: '',
  })
  const [count, setCount] = useState(0)
  useEffect(() => {
    const getData = async () => {
      const { data, count } = await activityGroupApi.getAllWithFilter(Filter)
      setData(data)
      setCount(count)
    }
    getData()
  }, [Filter])
  const fields = [
    {
      key: 'stt',
      label: 'STT',
      _style: { width: '5%', textAlign: 'center' },
    },
    {
      key: 'name',
      label: 'Tên nhóm hoạt động',
      _style: { width: '30%', textAlign: 'start' },
    },
    {
      key: 'maximumActivity',
      label: 'Số hoạt động tối đa',
      _style: { width: '15%', textAlign: 'start' },
    },
    {
      key: 'campaignId',
      label: 'Nhóm thuộc về đợt hoạt động',
      _style: { width: '25%', textAlign: 'start' },
    },
    {
      key: 'updatedAt',
      label: 'Cập nhật lần cuối',
      _style: { width: '15%', textAlign: 'center' },
    },
    {
      key: 'action',
      label: 'Thao tác',
      _style: { width: '10%', textAlign: 'center' },
    },
  ]

  const onDeleteConfirm = async (id: string) => {
    const res = await activityGroupApi.delete(id)
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

  const addNewGroup = (item: any) => {
    if (item.id) {
      setData([item, ...data])
      setPopUpMsg('Thêm nhóm hoạt động thành công')
      setPopUpColorType('success')
      setOpenPopup(true)
    } else {
      setPopUpMsg('Đã có lỗi xảy ra')
      setPopUpColorType('danger')
      setOpenPopup(true)
    }
  }

  const updateNewGroup = (item: any) => {
    if (item.id) {
      const idx = data.findIndex((cp) => cp.id === item.id)
      const items = [...data]
      items[idx] = item
      setData(items)
      setPopUpMsg('Chỉnh sửa nhóm hoạt động thành công')
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
        <strong>QUẢN LÝ NHÓM HOẠT ĐỘNG</strong>
      </CCardHeader>
      <CCardBody>
        <CRow className='mb-2'>
          <CCol sm='4' className='d-flex align-items-center py-1'>
            <CTooltip content={`Tên đợt hoạt động`}>
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
            stt: (item: ActivityGroupExtend, index: number) => {
              return <td className='align-middle text-center'>{index + 1}</td>
            },
            name: (item: ActivityGroup) => {
              return (
                <td className='align-middle'>
                  <div> {item.name} </div>
                </td>
              )
            },
            maximumActivity: (item: ActivityGroupExtend) => {
              return (
                <td className='align-middle'>
                  <div> {item.maximumActivity} </div>
                </td>
              )
            },
            campaignId: (item: ActivityGroupExtend) => {
              return (
                <td className='align-middle'>
                  <div> {item.campaignName} </div>
                </td>
              )
            },
            updatedAt: (item: ActivityGroupExtend) => {
              return (
                <td className='align-middle text-center'>
                  {moment(item.updatedAt).format('DD/MM/YYYY')}
                </td>
              )
            },
            action: (item: ActivityGroupExtend) => {
              return (
                <td className='align-middle text-center'>
                  <CTooltip content='Chỉnh sửa'>
                    <CButton
                      size='sm'
                      color='info'
                      className='ml-1'
                      onClick={() => {
                        setModifyItem(item)
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
          <GroupAdd
            onClose={() => {
              setOpenAddForm(false)
            }}
            addNewGroup={addNewGroup}
          />
        ) : (
          <></>
        )}
        {OpenModifyForm ? (
          <GroupModify
            onClose={() => {
              setOpenModifyForm(false)
            }}
            item={ModifyItem}
            updateNewGroup={updateNewGroup}
          />
        ) : (
          <></>
        )}
        {DeleteModal ? (
          <GroupDeleteAlert
            item={deleteItem}
            onClose={() => {
              setDeleteModal(false)
            }}
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

export default GroupPage
