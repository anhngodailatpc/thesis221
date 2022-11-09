import {
  CButton,
  CCardBody,
  CCol,
  CForm,
  CFormGroup,
  CInput,
  CLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSelect,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import activityCampaignApi from "../../../../api/BKAP/activityCampaignApi";
import activityGroupApi from "../../../../api/BKAP/activityGroupApi";

interface ActivityCampaignExtend {
  id: string;
  name: string;
  planStartDay: Date | null;
  planEndDay: Date | null;
  startDay: Date | null;
  endDay: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

const GroupAdd = (props: {
  onClose: () => void;
  addNewGroup: (item: any) => void;
}) => {
  const [data, setData] = useState({
    name: "",
    maximumActivity: 0,
    campaignId: "",
  });
  const [ErrorMsg, setErrorMsg] = useState("");
  const handleSubmitForm = async () => {
    if (data.name === "") {
      setErrorMsg("Tên không được để trống");
    } else if (data.maximumActivity <= 0 || isNaN(data.maximumActivity)) {
      setErrorMsg("Lỗi định dạng số hoạt động tối đa");
    } else if (data.campaignId === "") {
      setErrorMsg("Vui lòng chọn đợt hoạt động");
    } else {
      const newGroup = { ...data, id: uuid(), name: data.name.trim() };
      const res = await activityGroupApi.add(newGroup);
      props.addNewGroup(res);
      props.onClose();
    }
  };
  const [campaignData, setCampaignData] = useState<ActivityCampaignExtend[]>(
    []
  );

  useEffect(() => {
    const getData = async () => {
      const result = await activityCampaignApi.getAllActive();

      if (Object.prototype.toString.call(result) === "[object Array]") {
        setCampaignData(result);
      } else {
        setCampaignData([]);
      }
    };
    getData();
  }, []);

  return (
    <>
      <CRow>
        <CCol>
          <CCardBody>
            <CModal show={true} size="lg" color="info" onClose={props.onClose}>
              <CModalHeader>
                <CModalTitle>Thêm nhóm hoạt động</CModalTitle>
              </CModalHeader>
              <CForm>
                <CModalBody>
                  <CFormGroup>
                    <CLabel>Nhập tên nhóm hoạt động</CLabel>
                    <CInput
                      id="name"
                      name="name"
                      value={data.name}
                      onChange={(e: any) => {
                        setData({ ...data, [e.target.name]: e.target.value });
                      }}
                      placeholder="Nhập tên nhóm hoạt động"
                    />
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel>Số lượng hoạt động tối đa</CLabel>
                    <CInput
                      id="maximumActivity"
                      name="maximumActivity"
                      type="number"
                      value={data.maximumActivity}
                      onChange={(e: any) => {
                        if (!isNaN(e.target.value)) {
                          setData({
                            ...data,
                            maximumActivity: parseInt(e.target.value),
                          });
                        }
                      }}
                      placeholder="Số lượng hoạt động tối đa"
                    />
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel>Nhóm thuộc về đợt hoạt động</CLabel>
                    <CSelect
                      onChange={(e: any) => {
                        setData({
                          ...data,
                          campaignId: e.target.value,
                        });
                      }}
                    >
                      <option value="">Vui lòng chọn</option>
                      {campaignData.map((item) => (
                        <option value={item.id}>{item.name}</option>
                      ))}
                    </CSelect>
                  </CFormGroup>
                  <div style={{ color: "red" }}>{ErrorMsg}</div>
                </CModalBody>
              </CForm>
              <CModalFooter>
                <CButton color="primary" onClick={handleSubmitForm}>
                  Thêm mới
                </CButton>
                <CButton color="secondary" onClick={props.onClose}>
                  Đóng
                </CButton>
              </CModalFooter>
            </CModal>
          </CCardBody>
        </CCol>
      </CRow>
    </>
  );
};

export default GroupAdd;
