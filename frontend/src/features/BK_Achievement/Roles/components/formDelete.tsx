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
import UserApi from '../../../../api/Achievement/userApi'

export const FormDelete = (props: any) => {
  const { isOpen, onClose, idDelete, handleDeleteUser } = props
  const handleOnSubmit = async () => {
    try {
      await UserApi.delete(idDelete)
      handleDeleteUser(idDelete)
      onClose()
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <CRow>
      <CCol>
        <CCardBody>
          <CModal show={isOpen} size='lg' color='danger' onClosed={onClose}>
            <CModalHeader closeButton>
              <CModalTitle>Thông tin cần thiết</CModalTitle>
            </CModalHeader>
            <CModalBody>bạn có chắc muốn xóa</CModalBody>
            <CModalFooter>
              <CButton
                color='danger'
                onClick={handleOnSubmit}
                onDoubleClick={(e) => e.preventDefault()}>
                Xác nhận
              </CButton>
            </CModalFooter>
          </CModal>
        </CCardBody>
      </CCol>
    </CRow>
  )
}
