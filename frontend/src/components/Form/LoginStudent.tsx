import React, { useEffect, useState } from "react";

import { Formik, Form, FastField, Field } from "formik";
import {
  CButton,
  CCardBody,
  CCol,
  CLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from "@coreui/react";
import CinputField from "../../common/input/CInput";
import CselectField from "../../common/input/Cselect";
import * as yup from "yup";
import UserApi from "../../api/Achievement/userApi";
import DepartmentApi from "../../api/Achievement/departmentApi";
import Department from "../../types/Department";

import { useDispatch } from "react-redux";
import { setUser } from "../../redux/user";
import Toaster from "../../common/toast/LoginToast";
import { useHistory } from "react-router";

let validationSchema = yup.object().shape({
  mssv: yup
    .number()
    .required("Bắt buộc nhập")
    .positive("Mã không hợp lệ")
    .integer("Mã không hợp lệ"),
});

// interface MyFormValues {
//   name: string;
//   mssv: number;
//   gender: string;
//   nation: string;
//   religion: string;
//   birthday: Date;
//   CMND: number;
//   homeTown: string;
//   resident: string;
//   phone: number;
//   placeUnion: string;
//   dateAtUnion: Date;
//   dateAtCommunistParty: Date;
//   placeCommunistParty: string;
// }
interface Props {
  token: string;
}
// function IuseForceUpdate() {
//   const [value, setValue] = useState(0); // integer state
//   return () => setValue((value) => value + 1); // update the state to force render
// }
// const CustomSelectField = (props: any) => {
//   const { field, label, values, placeholder } = props;
//   const { name, value } = field;

//   //console.log("prop:", props);
//   const a = useFormikContext<any>();
//   const forceUpdate = IuseForceUpdate();
//   // console.log("render outside useEffect");
//   useEffect(() => {
//     console.log("select render");
//     forceUpdate();
//   }, [a.values.department]);
//   return (
//     <CFormGroup>
//       <CLabel htmlFor={name}>{label}</CLabel>
//       <select
//         className="form-control"
//         value={null}
//         id={name}
//         {...field}
//         placeholder={placeholder}
//         autoFocus={true}
//       >
//         {values.map((item: { value: string; name: string }, index: number) => (
//           <option
//             key={index}
//             disabled={item.value === ""}
//             selected={item.value === value}
//             value={item.value}
//           >
//             {item.name}
//           </option>
//         ))}
//       </select>
//     </CFormGroup>
//   );
// };

export const LoginStudent: React.FC<Props> = (props) => {
  // const initialValues = {
  //   name: "",
  //   mssv: 0,
  //   gender: "Male",
  //   nation: "",
  //   religion: "",
  //   birthday: Date.now(),
  //   CMND: 0,
  //   homeTown: "",
  //   resident: "",
  //   phone: "",
  //   placeUnion: "",
  //   dateAtUnion: Date.now(),
  //   dateAtCommunistParty: Date.now(),
  //   placeCommunistParty: "",
  // };
  const initialValues = {
    department: "",
  };
  const [depData, setDepData] = useState<Department[]>([]);
  // const handleClose = () => {};
  const dispatch = useDispatch();
  useEffect(() => {
    //console.log("Token in loginStudent:", props.token);
    const getDepData = async () => {
      const data = await DepartmentApi.getAll();
      setDepData(data);
    };
    getDepData();
    //console.log("render");
  }, [props.token]);
  //console.log(depData);
  const history = useHistory();
  const [isToast, setIsToast] = useState(false);
  return (
    <CRow>
      <CCol>
        <CCardBody>
          <CModal show={true} size="lg" className="show d-block" color="info">
            <CModalHeader>
              <CModalTitle>Thông tin cần thiết</CModalTitle>
            </CModalHeader>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={async (values: any, actions) => {
                //console.log({ values, actions });
                //alert(JSON.stringify(values));
                // actions.setSubmitting(true);
                // const res = await UserApi.registerStudent(props.token, values);
                // dispatch(setUser(res.user));
                // //console.log("response in LoginStudent:", res);
                // actions.setSubmitting(false);
                // setIsToast(true);
                // setTimeout(() => {
                //   history.push("/");
                // }, 2500);
              }}
              enableReinitialize
            >
              {(formikProps) => {
                const { values } = formikProps;
                //console.log("value department init: ", values.department);
                return (
                  <Form>
                    <CModalBody>
                      <h2>Thông tin cá nhân</h2>
                      <FastField
                        name="mssv"
                        component={CinputField}
                        placeholder="007"
                        label="Mã số cán bộ/ nhân viên"
                        onChange={formikProps.handleChange}
                      />
                      <FastField
                        name="gender"
                        component={CselectField}
                        values={[
                          { value: "", name: "Vui lòng chọn" },
                          { value: "Male", name: "Nam" },
                          { value: "Female", name: "Nữ" },
                          { value: "Other", name: "Khác" },
                        ]}
                        label="Giới tính"
                      />
                      <FastField
                        name="nation"
                        component={CinputField}
                        placeholder="007"
                        label="Dân tộc"
                        onChange={formikProps.handleChange}
                      />
                      <FastField
                        name="religion"
                        component={CinputField}
                        placeholder="Không, Phật giáo, ..."
                        label="Tôn giáo"
                        onChange={formikProps.handleChange}
                      />
                      <FastField
                        name="birthday"
                        component={CinputField}
                        label="Ngày sinh"
                        type="Date"
                        onChange={formikProps.handleChange}
                      />
                      <FastField
                        name="CMND"
                        component={CinputField}
                        placeholder="007"
                        label="Số CMND"
                        onChange={formikProps.handleChange}
                      />
                      <FastField
                        name="homeTown"
                        component={CinputField}
                        placeholder="Xã/Phường/Thị trấn...., Quận/Huyện...., Tỉnh/TP.... "
                        label="Quê quán"
                        onChange={formikProps.handleChange}
                      />
                      <FastField
                        name="resident"
                        component={CinputField}
                        placeholder="Xã/Phường/Thị trấn...., Quận/Huyện...., Tỉnh/TP.... "
                        label="Thường trú"
                        onChange={formikProps.handleChange}
                      />
                      <FastField
                        name="phone"
                        component={CinputField}
                        placeholder="113"
                        label="Số điện thoại di động"
                        onChange={formikProps.handleChange}
                      />
                      <FastField
                        name="email"
                        component={CinputField}
                        placeholder="abcXYZ@gmail.com"
                        label="Email cá nhân"
                        onChange={formikProps.handleChange}
                      />
                      <h2>Thông tin về Khoa</h2>
                      <CLabel htmlFor={"department"}>Chọn khoa</CLabel>
                      <Field
                        name="department"
                        as="select"
                        onChange={formikProps.handleChange}
                        className="form-control"
                      >
                        <option value="">Vui lòng chọn</option>
                        {depData.map((item) => (
                          <>
                            <option value={item.id}>{item.name}</option>
                          </>
                        ))}
                      </Field>
                      <CLabel htmlFor={"department"}>Chọn Phòng/Ban</CLabel>
                      <Field
                        name="youthBranch"
                        as="select"
                        onChange={formikProps.handleChange}
                        placeholder="Chọn Phòng/Ban"
                        className="form-control"
                      >
                        <option value={0}>Vui lòng chọn</option>
                        {depData.filter(
                          (item) => item.id === parseInt(values.department)
                        ).length > 0 ? (
                          depData
                            .filter(
                              (item) => item.id === parseInt(values.department)
                            )[0]
                            .youthBranch.map((item) => (
                              <option value={item.id}>{item.name}</option>
                            ))
                        ) : (
                          <></>
                        )}
                      </Field>
                      <FastField
                        name="dateAtUnion"
                        component={CinputField}
                        placeholder="abc@hcmut.edu.vn"
                        label="Ngày vào Công Đoàn (nếu có)"
                        type="Date"
                        onChange={formikProps.handleChange}
                      />
                      <FastField
                        name="placeUnion"
                        component={CinputField}
                        placeholder="TAND huyện - tỉnh..."
                        label="Nơi vào Công Đoàn"
                        onChange={formikProps.handleChange}
                      />
                      <FastField
                        name="dateAtCommunistParty"
                        component={CinputField}
                        label="Ngày vào Đảng (nếu có)"
                        type="Date"
                        onChange={formikProps.handleChange}
                      />
                      <FastField
                        name="placeCommunistParty"
                        component={CinputField}
                        // placeholder='abc@hcmut.edu.vn'
                        label="Nơi vào Đảng"
                        onChange={formikProps.handleChange}
                      />
                    </CModalBody>
                    <CModalFooter>
                      <CButton
                        color="info"
                        type="submit"
                        disabled={formikProps.isSubmitting}
                      >
                        Xác nhận
                      </CButton>
                    </CModalFooter>
                    <pre>{JSON.stringify(values, null, 2)}</pre>
                  </Form>
                );
              }}
            </Formik>
          </CModal>
        </CCardBody>
      </CCol>
      <Toaster isShow={isToast} />
    </CRow>
  );
};
