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
var QRCode = require("qrcode.react");
type Props = {
  manageActivityId: string;
  isOpen: boolean;
  onClose: () => void;
  link: string;
};

export const FormQR: React.FC<Props> = ({
  manageActivityId,
  isOpen,
  onClose,
  link,
}) => {
  return (
    <CRow>
      <CCol>
        <CCardBody>
          <CModal show={isOpen} color="info" onClosed={onClose}>
            <CModalHeader closeButton>
              <CModalTitle>Mã QR</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CRow>
                <CCol sm="12">
                  <QRCode value={link} />
                </CCol>
              </CRow>
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={onClose}>
                Hủy bỏ
              </CButton>
            </CModalFooter>
          </CModal>
        </CCardBody>
      </CCol>
    </CRow>
  );
};
