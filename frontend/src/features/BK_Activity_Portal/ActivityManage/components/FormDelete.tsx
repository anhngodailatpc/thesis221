import * as React from "react";
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
} from "@coreui/react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onDeleteConfirm: () => void;
};

export const FormDelete: React.FC<Props> = ({
  isOpen,
  onClose,
  onDeleteConfirm,
}) => {
  return (
    <CRow>
      <CCol>
        <CCardBody>
          <CModal show={isOpen} size="lg" color="danger" onClosed={onClose}>
            <CModalHeader closeButton>
              <CModalTitle>Xóa hoạt động</CModalTitle>
            </CModalHeader>
            <CModalBody>Bạn có chắc chắn muốn xóa</CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={onClose}>
                Hủy bỏ
              </CButton>
              <CButton color="danger" onClick={onDeleteConfirm} type="submit">
                Xác nhận
              </CButton>
            </CModalFooter>
          </CModal>
        </CCardBody>
      </CCol>
    </CRow>
  );
};
