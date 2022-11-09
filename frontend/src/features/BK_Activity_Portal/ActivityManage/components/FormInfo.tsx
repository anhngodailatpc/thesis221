import * as React from 'react'
import {
  CButton,
  CCardBody,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import moment from 'moment'
import parse from 'html-react-parser'

type Props = {
  isOpen: boolean
  data: any
  maximumDepartment: number
  onClose: () => void
}

export const FormInfo: React.FC<Props> = ({
  isOpen,
  data,
  onClose,
  maximumDepartment,
}) => {
  const {
    activityGroup,
    campaign,
    content,
    departments,
    endDay,
    link,
    maximumCTXH,
    maximumParticipant,
    name,
    registerEndDay,
    registerStartDay,
    startDay,
  } = data

  return (
    <CRow>
      <CCol>
        <CCardBody>
          <CModal show={isOpen} size='lg' color='info' onClosed={onClose}>
            <CModalHeader closeButton>
              <CModalTitle>Thông tin hoạt động</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CRow>
                <CCol sm='12'>
                  <strong>Tên hoạt động:</strong>
                  {name}{' '}
                </CCol>

                <CCol sm='12'>
                  <strong>Số lượng cán bộ tối đa:</strong>
                  {maximumParticipant}{' '}
                </CCol>
                <CCol sm='12'>
                  <strong>Chỉ tiêu hoàn thành tối đa:</strong>
                  {maximumCTXH}{' '}
                </CCol>
                <CCol sm='12'>
                  <strong>Hoạt động:</strong>
                  {campaign?.name + ' '}
                  (Nộp kế hoạch:{' '}
                  {campaign?.planStartDay &&
                    moment(campaign?.planStartDay).format('DD/MM/YYYY')}
                  -
                  {campaign?.planStartDay &&
                    moment(campaign?.planStartDay).format('DD/MM/YYYY')}
                  ) (Diễn ra:{' '}
                  {campaign?.startDay &&
                    moment(campaign?.startDay).format('DD/MM/YYYY')}
                  -
                  {campaign?.endDay &&
                    moment(campaign?.endDay).format('DD/MM/YYYY')}
                  )
                </CCol>
                <CCol sm='12'>
                  <strong>Nhóm hoạt động:</strong> {activityGroup?.name}{' '}
                </CCol>
                <CCol sm='12'>
                  <strong>Thời gian đăng ký:</strong>
                  {registerStartDay &&
                    moment(registerStartDay).format('DD/MM/YYYY')}{' '}
                  -
                  {registerEndDay &&
                    moment(registerEndDay).format('DD/MM/YYYY')}
                </CCol>
                <CCol sm='12'>
                  <strong>Thời gian diễn ra hoạt động:</strong>
                  {startDay && moment(startDay).format('DD/MM/YYYY')} -
                  {endDay && moment(endDay).format('DD/MM/YYYY')}
                </CCol>
                <CCol sm='12'>
                  <strong>Các đơn vị tham gia hoạt động:</strong>
                  {departments && departments.length === maximumDepartment
                    ? 'Tất cả'
                    : departments?.map((item: any) => item.name).join()}
                </CCol>
                <CCol sm='12'>
                  <strong>Nội dung hoạt động:</strong>
                  {/* <br /> */}
                  <hr />
                  {parse(content || '')}
                  <hr />
                </CCol>
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
