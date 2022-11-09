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

type Props = {
  isOpen: boolean
  data: any
  onClose: () => void
}

export const ModalResponse: React.FC<Props> = ({ isOpen, data, onClose }) => {
  return (
    <CRow>
      <CCol>
        <CCardBody>
          <CModal show={isOpen} size='lg' color='info' onClosed={onClose}>
            <CModalHeader closeButton>
              <CModalTitle>Nội dung phản hồi hoạt động</CModalTitle>
            </CModalHeader>
            <CModalBody>{data && 'Không có'} </CModalBody>
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
