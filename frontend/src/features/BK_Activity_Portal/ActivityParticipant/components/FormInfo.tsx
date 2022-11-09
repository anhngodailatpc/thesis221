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
import parse from 'html-react-parser'

type Props = {
  isOpen: boolean
  data: any
  onClose: () => void
}

export const FormInfo: React.FC<Props> = ({ isOpen, data, onClose }) => {
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
                <CCol sm='12'>{parse(data || '')}</CCol>
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
