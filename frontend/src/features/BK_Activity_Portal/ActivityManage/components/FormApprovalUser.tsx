import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCallout,
  CCardBody,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import Select from 'react-select'
import { CSVLink } from 'react-csv'
import SheetApp from '../../../../common/SheetApp/'
import activityRegistrationApi from '../../../../api/BKAP/activityRegistration'

type Props = {
  isOpen: boolean
  onClose: () => void
  handleApproveExcel: (data: string[]) => void
  data: any
  id: string
}

const headers = [
  { label: 'STT', key: 'stt' },
  { label: 'Lần đầu đăng ký', key: 'register' },
  { label: 'mscb', key: 'mssv' },
  { label: 'Họ và tên lót', key: 'surname' },
  { label: 'Tên', key: 'name' },
  { label: 'Email', key: 'email' },
  { label: 'Số điện thoại', key: 'phone' },
  { label: 'Đơn vị', key: 'departmentName' },
  { label: 'Kết quả', key: 'status' },
]

export const FormApprovalUser: React.FC<Props> = ({
  isOpen,
  onClose,
  id,
  data: dataParent,
  handleApproveExcel,
}) => {
  const [option, setOption] = useState<any>('')
  const [textError, setTextError] = useState('')
  const [dataCSV, setDataCSV] = useState<any[]>([])
  const handleSubmitFile = async (data: any) => {
    const listId = data[0].reduce((pre: string[], cur: any) => {
      const findMssv = dataParent.find((item: any) => +item.mssv === cur[0])
      return findMssv ? [...pre, findMssv.registrationid] : pre
    }, [])

    try {
      await activityRegistrationApi.updateRegisteredExcel(listId, id)
      onClose()
      handleApproveExcel(listId)
    } catch (error: any) {
      if (error?.response.data.statusCode === 400) {
        setTextError(error?.response.data.message)
      } else {
        alert('không đúng định dạng file')
        console.error(error)
      }
    }
  }

  const handleSubmitSeries = async () => {
    const max = dataParent[0]?.max
    if (max) {
      const listRegistrationId = dataParent.reduce(
        (pre: string[], cur: any) => {
          if (cur.status === 'PASS') return pre
          return [...pre, cur.registrationid]
        },
        []
      )
      const formatRegistrationId = listRegistrationId.slice(0, max)
      try {
        await activityRegistrationApi.updateRegisteredExcel(
          formatRegistrationId,
          id
        )
        onClose()
        handleApproveExcel(formatRegistrationId)
      } catch (error: any) {
        if (error?.response.data.statusCode === 400) {
          setTextError(error?.response.data.message)
        } else {
          console.error(error)
        }
      }
    }
  }

  useEffect(() => {
    async function exportData() {
      if (option.value === 'export') {
        const { data: dataCSV } = await activityRegistrationApi.getRegistered(
          { limit: 1000000, page: 1, search: '' },
          id
        )
        setDataCSV(
          dataCSV.map((item: any, index: number) => {
            return {
              ...item,
              stt: index + 1,
              status: item.status === 'PASS' ? 'Thành công' : 'Thất bại',
            }
          })
        )
      }
    }
    exportData()
  }, [option.value, id])

  return (
    <CRow>
      <CCol>
        <CCardBody>
          <CModal show={isOpen} size='' color='info' onClosed={onClose}>
            <CModalHeader closeButton>
              <CModalTitle>Duyệt hoạt động</CModalTitle>
            </CModalHeader>

            <CModalBody>
              <CRow>
                <CCol style={{ color: 'red' }} sm='12'>
                  {textError}
                </CCol>
                <CCol sm='12'>
                  <Select
                    name='Option'
                    options={[
                      { value: 'series', label: 'Duyệt hàng loạt' },
                      { value: 'excel', label: 'Duyệt bằng file excel' },
                      { value: 'export', label: 'Xuất ra file csv' },
                    ]}
                    onChange={(newValue: any) => setOption(newValue)}
                    placeholder='Vui lòng chọn'
                  />
                </CCol>
                {option.value === 'excel' && (
                  <>
                    <CCol sm='12' className='mt-2'>
                      <CCallout color='info' className={'bg-white'}>
                        <small className='text-muted'>Lưu ý</small>
                        <br />
                        <strong className='h5'>
                          File gồm 1 cột mscb và không có tiêu đề
                          <hr />
                        </strong>
                      </CCallout>
                    </CCol>
                    <CCol sm='12' className='mt-2'>
                      <SheetApp handleSubmitFile={handleSubmitFile} />
                    </CCol>
                  </>
                )}
                {option.value === 'series' && (
                  <>
                    <CCol sm='6' className='d-flex justify-content-end mt-2'>
                      <CButton color='primary' onClick={handleSubmitSeries}>
                        Duyệt
                      </CButton>
                    </CCol>

                    <CCol sm='6' className='mt-2'>
                      <CButton color='danger' onClick={onClose}>
                        Không duyệt
                      </CButton>
                    </CCol>
                  </>
                )}
                {option.value === 'export' && (
                  <CCol sm='12' className='mt-2'>
                    <CButton
                      color='info'
                      size=''
                      className='align-middle justify-content-center ml-1'>
                      <CSVLink
                        data={dataCSV}
                        headers={headers}
                        filename={'danh-sach-dang-ky-hoat-dong.csv'}
                        style={{ color: 'white' }}>
                        Xuất dữ liệu
                      </CSVLink>
                    </CButton>
                  </CCol>
                )}
              </CRow>
            </CModalBody>
            <CModalFooter>
              <CButton color='secondary' onClick={onClose}>
                Hủy bỏ
              </CButton>
            </CModalFooter>
          </CModal>
        </CCardBody>
      </CCol>
    </CRow>
  )
}
