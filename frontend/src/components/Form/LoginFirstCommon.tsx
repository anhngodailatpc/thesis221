import * as React from "react";

import { Formik, Form, FastField } from "formik";
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
import CinputField from "../../common/input/CInput";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import UserApi from '../../api/Achievement/userApi'
import { setUser } from "../../redux/user";
import Toaster from "../../common/toast/LoginToast";
import { useHistory } from "react-router-dom";
import ErrToaster from "../../common/toast/LoginErrorToast";

let validationSchema = yup.object().shape({
  mssv: yup
    .number()
    .required("Bắt buộc nhập")
    .positive("Mã không hợp lệ")
    .integer("Mã không hợp lệ"),
});

interface MyFormValues {
  mssv: number;
}
interface Props {
  token: string;
}
export const LoginFirstCommon: React.FC<Props> = (prop) => {
  const initialValues: MyFormValues = { mssv: 0 };
  // const [open] = React.useState(true);
  const dispatch = useDispatch();
  const [isToast, setIsToast] = React.useState(false);
  const [isToastErr, setIsToastErr] = React.useState(false);
  const history = useHistory();
  const handleOnSubmit = async (values: any, actions: any) => {
    try {
      // actions.setSubmitting(true);
      // // const response = await UserApi.registerTeacher(prop.token, values);
      // dispatch(setUser(response.user));
      // setIsToast(true);
      // setTimeout(() => {
      //   history.push("/");
      // }, 2500);

      actions.setSubmitting(false);
    } catch (error: any) {
      setIsToastErr(true);
      setTimeout(() => {
        history.push("/");
      }, 2500);
    }
  };
  return (
    <CRow>
      <CCol>
        <CCardBody>
          <CModal
            show={true}
            size="lg"
            className={true ? "show d-block" : ""}
            color="info"
          >
            <CModalHeader>
              <CModalTitle>Thông tin cần thiết</CModalTitle>
            </CModalHeader>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleOnSubmit}
            >
              {(formikProps) => {
                return (
                  <Form>
                    <CModalBody>
                      <FastField
                        name="mssv"
                        component={CinputField}
                        placeholder="007"
                        label="Mã số cán bộ"
                        onChange={formikProps.handleChange}
                      />
                    </CModalBody>
                    <CModalFooter>
                      <CButton
                        color="info"
                        type="submit"
                        disabled={
                          !formikProps.isValid ||
                          !formikProps.dirty ||
                          formikProps.isSubmitting
                        }
                        onDoubleClick={(e) => e.preventDefault()}
                      >
                        Xác nhận
                      </CButton>
                    </CModalFooter>
                  </Form>
                );
              }}
            </Formik>
          </CModal>
        </CCardBody>
        <Toaster isShow={isToast} />
        <ErrToaster isShow={isToastErr} />
      </CCol>
    </CRow>
  );
};
