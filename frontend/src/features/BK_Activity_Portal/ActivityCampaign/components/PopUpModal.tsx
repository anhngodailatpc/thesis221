import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
} from "@coreui/react";
import React from "react";

const PopUpModal = (props: {
  msg: string;
  colorType: "danger" | "success" | "warning" | "info";
  onClose: () => void;
}) => {
  return (
    <CModal show={true} color={props.colorType} onClose={props.onClose}>
      <CModalHeader>Thông báo</CModalHeader>
      <CModalBody>{props.msg}</CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={props.onClose}>
          Đóng
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default PopUpModal;
