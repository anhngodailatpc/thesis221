import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
} from "@coreui/react";

import React from "react";

interface ActivityGroupExtend {
  id: string;
  name: string;
  maximumActivity: number;
  campaignId: string;
  campaignName: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

const GroupDeleteAlert = (props: {
  item: ActivityGroupExtend | undefined;
  onClose: () => void;
  onDeleteConfirm: (id: string) => void;
}) => {
  return (
    <CModal show={true} color="danger" onClose={props.onClose}>
      <CModalHeader>Xóa nhóm hoạt động</CModalHeader>
      <CModalBody>
        {props.item !== undefined
          ? `Bạn có chắc là mình muốn xóa nhóm hoạt động: ${props.item.name}`
          : "Có lỗi xảy ra"}
      </CModalBody>
      <CModalFooter>
        {props.item !== undefined ? (
          <CButton
            color="danger"
            onClick={() => {
              if (props.item !== undefined)
                props.onDeleteConfirm(props.item.id);
            }}
          >
            Đồng ý
          </CButton>
        ) : (
          <></>
        )}
        <CButton color="secondary" onClick={props.onClose}>
          Hủy bỏ
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default GroupDeleteAlert;
