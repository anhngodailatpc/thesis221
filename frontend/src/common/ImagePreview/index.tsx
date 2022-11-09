import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
} from "@coreui/react";
import React, { useState } from "react";

const ImageViewer = (prop: {
  file: any;
  show: boolean;
  imgViewClose: () => void;
}) => {
  const [rotation, setRotation] = useState(0);
  const RRotate = () => {
    let newRotation = rotation + 90;
    if (newRotation >= 360) {
      newRotation = -360;
    }
    setRotation(newRotation);
  };
  const LRotate = () => {
    let newRotation = rotation - 90;
    if (newRotation >= 360) {
      newRotation = -360;
    }
    setRotation(newRotation);
  };
  return (
    <CModal show={prop.show} onClose={prop.imgViewClose} size="xl">
      <CModalHeader closeButton>
        <strong>Xem lại</strong>
      </CModalHeader>
      <CModalBody>
        {/* <input onClick={LRotate} type="button" value="left" />
        <div>
          <img
            style={{ transform: `rotate(${rotation}deg)` }}
            src={prop.file}
            alt="preview"
          />
        </div> */}
        <div>
          <object
            style={{ height: "60vh" }}
            data={prop.file}
            width="100%"
            height="100%"
          >
            alt
          </object>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={prop.imgViewClose}>
          Đóng
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ImageViewer;
