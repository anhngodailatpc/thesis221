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
} from "@coreui/react";
import DatePicker, { registerLocale } from "react-datepicker";
import React, { useState } from "react";
import moment, { min } from "moment";
import { v4 as uuid } from "uuid";
import "react-datepicker/dist/react-datepicker.css";
import vi from "date-fns/locale/vi";
import activityCampaignApi from "../../../../api/BKAP/activityCampaignApi";
registerLocale("vi", vi);

type DataType = {
  name: any;
  planStartDay: any;
  planEndDay: any;
  startDay: any;
  endDay: any;
};
const Input = (pros: any) => {
  const { onChange, placeholder, value, id, onClick } = pros;
  return (
    <CInput
      onChange={onChange}
      placeholder={placeholder}
      value={value}
      id={id}
      onClick={onClick}
    />
  );
};

const CampaignAdd = (props: {
  onClose: () => void;
  addNewCampaign: (item: any) => void;
}) => {
  const [data, setData] = useState<DataType>({
    name: "",
    planStartDay: null,
    planEndDay: null,
    startDay: null,
    endDay: null,
  });
  const [errorMsg, setErrorMsg] = useState("");
  const handleSubmitForm = async () => {
    if (data.name === "") {
      setErrorMsg("Tên không được để trống");
    } else if (data.planStartDay === null) {
      setErrorMsg("Thời gian không được để trống");
    } else if (data.planEndDay === null) {
      setErrorMsg("Thời gian không được để trống");
    } else if (data.startDay === null) {
      setErrorMsg("Thời gian không được để trống");
    } else if (data.endDay === null) {
      setErrorMsg("Thời gian không được để trống");
    } else if (
      moment(data.planStartDay).diff(moment(data.planEndDay), "days") >= 0
    ) {
      setErrorMsg("Thiết lập thời gian cho việc nộp kế hoạch không hợp lệ");
    } else if (moment(data.startDay).diff(moment(data.endDay), "days") >= 0) {
      setErrorMsg("Thiết lập thời gian đợt hoạt động không hợp lệ ");
    } else if (
      moment(data.planStartDay).diff(moment(data.startDay), "days") >= 0
    ) {
      setErrorMsg(
        "Ngày đợt hoạt động diễn ra phải từ sau ngày Các cấp Ủy bắt đầu nộp kế hoạch"
      );
    } else if (moment(data.planEndDay).diff(moment(data.endDay), "days") >= 0) {
      setErrorMsg(
        "Ngày kết thúc đợt hoạt động phải từ sau ngày Các cấp Ủy kết thúc nộp kế hoạch"
      );
    } else {
      const newCampaign = {
        ...data,
        id: uuid(),
        planEndDay: moment(data.planEndDay).add(1439, "minutes").toDate(),
        endDay: moment(data.endDay).add(1439, "minutes").toDate(),
      };
      const res = await activityCampaignApi.add(newCampaign);
      props.addNewCampaign(res);
      props.onClose();
    }
  };
  return (
    <>
      <CRow>
        <CCol>
          <CCardBody>
            <CModal show={true} size="lg" color="info" onClose={props.onClose}>
              <CModalHeader>
                <CModalTitle>Thêm đợt hoạt động</CModalTitle>
              </CModalHeader>
              <CForm>
                <CModalBody>
                  <CFormGroup>
                    <CLabel>Nhập tên đợt hoạt động</CLabel>
                    <CInput
                      id="name"
                      name="name"
                      value={data.name}
                      onChange={(e: any) => {
                        setData({ ...data, [e.target.name]: e.target.value });
                      }}
                      placeholder="Nhập tên đợt hoạt động"
                    />
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol xs="6">
                      <CLabel htmlFor="planDay-input">
                        Ngày bắt đầu nộp kế hoạch
                      </CLabel>
                      <DatePicker
                        selected={data.planStartDay}
                        // minDate={moment().toDate()}
                        onChange={(e: any) => {
                          setData({ ...data, planStartDay: e });
                        }}
                        locale="vi"
                        customInput={<Input />}
                        placeholderText="Ngày/Tháng/Năm"
                        dateFormat="dd/MM/yyyy"
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                      />
                    </CCol>
                    <CCol xs="6">
                      <CLabel htmlFor="planDay-input">
                        Ngày kết thúc nộp kế hoạch
                      </CLabel>
                      <DatePicker
                        selected={data.planEndDay}
                        // minDate={moment()
                        //   .add(
                        //     moment(moment(data.planStartDay)).diff(
                        //       moment(),
                        //       "days"
                        //     ),
                        //     "days"
                        //   )
                        //   .toDate()}
                        onChange={(e: any) => {
                          console.log(e);

                          setData({
                            ...data,
                            planEndDay: e,
                          });
                        }}
                        locale="vi"
                        customInput={<Input />}
                        placeholderText="Ngày/Tháng/Năm"
                        dateFormat="dd/MM/yyyy"
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                      />
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol xs="6">
                      <CLabel htmlFor="day-input">
                        Ngày bắt đầu diễn ra đợt hoạt động
                      </CLabel>
                      <DatePicker
                        id="planStartDay"
                        name="planStartDay"
                        selected={data.startDay}
                        // minDate={moment().toDate()}
                        onChange={(e: any) => {
                          setData({ ...data, startDay: e });
                        }}
                        locale="vi"
                        customInput={<Input />}
                        placeholderText="Ngày/Tháng/Năm"
                        dateFormat="dd/MM/yyyy"
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                      />
                    </CCol>
                    <CCol xs="6">
                      <CLabel htmlFor="day-input">
                        Ngày kết thúc diễn ra đợt hoạt động
                      </CLabel>
                      <DatePicker
                        selected={data.endDay}
                        // minDate={moment()
                        //   .add(
                        //     moment(moment(data.startDay)).diff(
                        //       moment(),
                        //       "days"
                        //     ),
                        //     "days"
                        //   )
                        //   .toDate()}
                        onChange={(e: any) => {
                          setData({
                            ...data,
                            endDay: e,
                          });
                        }}
                        locale="vi"
                        customInput={<Input />}
                        placeholderText="Ngày/Tháng/Năm"
                        dateFormat="dd/MM/yyyy"
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                      />
                    </CCol>
                  </CFormGroup>
                  {errorMsg !== "" ? (
                    <div style={{ color: "red" }}>{errorMsg}</div>
                  ) : (
                    <></>
                  )}
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

export default CampaignAdd;
