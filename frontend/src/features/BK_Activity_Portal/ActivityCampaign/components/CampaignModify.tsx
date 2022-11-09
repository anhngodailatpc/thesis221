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
import React, { useEffect, useState } from "react";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import vi from "date-fns/locale/vi";
import activityCampaignApi from "../../../../api/BKAP/activityCampaignApi";
registerLocale("vi", vi);

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
const CampaignModify = (props: {
  onClose: () => void;
  item: ActivityCampaignExtend | undefined;
  updateNewCampaign: (item: any) => void;
}) => {
  const [data, setData] = useState<ActivityCampaignExtend>({
    id: "",
    name: "",
    planStartDay: null,
    planEndDay: null,
    startDay: null,
    endDay: null,
    createdAt: null,
    updatedAt: null,
  });
  useEffect(() => {
    if (props.item !== undefined) {
      setData(props.item);
    }
  }, [props.item]);
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

        planEndDay: moment(data.planEndDay).add(1439, "minutes").toDate(),
        endDay: moment(data.endDay).add(1439, "minutes").toDate(),
      };
      const res = await activityCampaignApi.modify(newCampaign);
      props.updateNewCampaign(res);
      props.onClose();
    }
  };
  return (
    <>
      <CRow>
        <CCol>
          <CCardBody>
            <CModal
              show={true}
              size="lg"
              color={props.item !== undefined ? "info" : "danger"}
              onClose={props.onClose}
            >
              <CModalHeader>
                <CModalTitle>Chỉnh sửa đợt hoạt động</CModalTitle>
              </CModalHeader>
              {props.item !== undefined && data.name !== "" ? (
                <>
                  <CForm>
                    <CModalBody>
                      <CFormGroup>
                        <CLabel>Tên đợt hoạt động</CLabel>
                        <CInput
                          id="name"
                          name="name"
                          value={data.name}
                          onChange={(e: any) => {
                            setData({
                              ...data,
                              [e.target.name]: e.target.value,
                            });
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
                            selected={moment(data.planStartDay).toDate()}
                            minDate={moment().toDate()}
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
                            selected={moment(data.planEndDay).toDate()}
                            minDate={moment()
                              .add(
                                moment(moment(data.planStartDay)).diff(
                                  moment(),
                                  "days"
                                ) + 1,
                                "days"
                              )
                              .toDate()}
                            onChange={(e: any) => {
                              setData({ ...data, planEndDay: e });
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
                            selected={moment(data.startDay).toDate()}
                            minDate={moment().toDate()}
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
                            selected={moment(data.endDay).toDate()}
                            minDate={moment()
                              .add(
                                moment(moment(data.startDay)).diff(
                                  moment(),
                                  "days"
                                ) + 1,
                                "days"
                              )
                              .toDate()}
                            onChange={(e: any) => {
                              setData({ ...data, endDay: e });
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
                      Cập nhật
                    </CButton>
                    <CButton color="secondary" onClick={props.onClose}>
                      Đóng
                    </CButton>
                  </CModalFooter>
                </>
              ) : (
                <CModalBody>Đã có lỗi xảy ra</CModalBody>
              )}
            </CModal>
          </CCardBody>
        </CCol>
      </CRow>
    </>
  );
};

export default CampaignModify;
