import React, { useState, useEffect } from "react";
import {
  CCardBody,
  CCol,
  CForm,
  CFormGroup,
  CInput,
  CLabel,
  CTextarea,
} from "@coreui/react";
import moment from "moment";
import Modal from "../../../../common/Modal";
import achievementApi from "../../../../api/Achievement/achievementApi";
import Achievement from "../../../../types/Achievement";
import { useHistory } from "react-router";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import vi from "date-fns/locale/vi";
registerLocale("vi", vi);

export const CompetitionAdd = (props: any) => {
  const {
    isOpen,
    handleClose,
    title,
    handleSubmit,
    btnSubmit,
    colorBtnSubmit,
  } = props;
  const history = useHistory();
  const [data, setData] = useState({
    name: "",
    description: "",
    type: "COMPETITION",
    startAt: null,
    endAt: null,
  });
  const [messageError, setMessageError] = useState("");

  const handleChange = (event: any) =>
    setData({ ...data, [event.target.name]: event.target.value });

  const handleSubmitForm = async () => {
    try {
      if (data.name.trim() === "") setMessageError("Lỗi");
      else if (data.name.length > 300)
        setMessageError("Tên thi đua không thể quá dài");
      else if (data.startAt === null || data.endAt === null)
        setMessageError("Cần thiết lập thời gian");
      else if (moment(data.startAt).diff(moment(data.endAt), "days") > 0)
        setMessageError("Lỗi thời gian");
      else {
        const achievement: Achievement = await achievementApi.add(data);
        handleSubmit(achievement);
      }
    } catch (error: any) {
      if (error?.response.status === 400) {
        setMessageError(error.response.data.message);
        setTimeout(() => {
          setMessageError("");
        }, 3000);
      } else {
        console.log(error?.message);
        history.push("/loi-truy-cap");
      }
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setData((data) => ({
        name: "",
        description: "",
        type: "COMPETITION",
        startAt: null,
        endAt: null,
      }));
      setMessageError("");
    }
  }, [isOpen]);

  const handleChangeDateStart = (startAt: any) =>
    setData((data) => ({ ...data, startAt }));
  const handleChangeDateEnd = (endAt: any) =>
    setData((data) => ({ ...data, endAt }));
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

  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleClose}
      title={title}
      btnSubmit={btnSubmit}
      colorBtnSubmit={colorBtnSubmit}
      handleSubmit={handleSubmitForm}
    >
      <CCardBody>
        <CForm action="" method="post">
          <div style={{ color: "red" }}>{messageError}</div>
          <CFormGroup>
            <CLabel>Thi đua</CLabel>
            <CInput
              id="name"
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Nhập tên thi đua"
            />
          </CFormGroup>
          <CFormGroup row>
            <CCol xs="6">
              <CLabel htmlFor="date-input">Ngày bắt đầu</CLabel>
              <DatePicker
                selected={data.startAt}
                minDate={moment().toDate()}
                onChange={handleChangeDateStart}
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
              <CLabel htmlFor="date-input">Ngày kết thúc</CLabel>
              <DatePicker
                selected={data.endAt}
                minDate={moment()
                  .add(moment(data.startAt).diff(moment(), "days") + 1, "days")
                  .toDate()}
                onChange={handleChangeDateEnd}
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
          <CFormGroup>
            <CLabel>Mô tả</CLabel>
            <CTextarea
              name="description"
              id="description"
              value={data.description}
              onChange={handleChange}
              placeholder="Mô tả cho thi đua"
            />
          </CFormGroup>
        </CForm>
      </CCardBody>
    </Modal>
  );
};
