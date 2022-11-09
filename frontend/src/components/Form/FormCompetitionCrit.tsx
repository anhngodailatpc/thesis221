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
import CselectField from "../../common/input/Cselect";

import { v4 as uuid } from "uuid";

let validationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Bắt buộc nhập")
    .min(5, "tối thiểu 5 ký tự")
    .max(150, "tối thiểu 150 ký tự"),
  standardPoint: yup.number(),
});

interface MyFormValues {
  name: string;
  isCriteria: string;
  standardPoint: number;
  note: string;
}

export const FormCommpetitionCriteria = (props: any) => {
  const { isOpen, onClose, onSubmit, parentId, item, onAddSuccess, cNumber } =
    props;
  const [initialValues, setInitialValues] = React.useState<MyFormValues>({
    name: "",
    isCriteria: "",
    standardPoint: 0,
    note: "",
  });
  React.useEffect(() => {
    if (item !== undefined) {
      setInitialValues({
        name: item.name,
        isCriteria: item.isCriteria ? "true" : "false",
        standardPoint: item.standardPoint,
        note: "",
      });
    }
  }, [item]);
  const handleFormatData = (values: any) => {
    const standardPoint = Number(values.standardPoint);
    const isCriteria: boolean = values.isCriteria === "true" ? true : false;
    const id = uuid();
    const note = values.note;
    return {
      parentId: parentId,
      item: {
        ...values,
        standardPoint,
        id,
        isCriteria,
        soft: 0,
        note,
        children: [],
      },
    };
  };

  const handleOnSubmit = async (values: any, actions: any) => {
    // start logic submit form
    const Criteria = handleFormatData(values);
    onSubmit(Criteria);
    // end logic submit form
    actions.resetForm();
    actions.setSubmitting(false);
    onClose();
  };
  return (
    <CRow>
      <CCol>
        <CCardBody>
          <CModal show={isOpen} size="lg" color="info" onClosed={onClose}>
            <CModalHeader closeButton>
              <CModalTitle>Thêm tiêu chí</CModalTitle>
            </CModalHeader>
            <Formik
              initialValues={initialValues}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={handleOnSubmit}
            >
              {(formikProps) => {
                const { values } = formikProps;
                return (
                  <Form>
                    <CModalBody>
                      <FastField
                        name="isCriteria"
                        component={CselectField}
                        values={[
                          { value: "", name: "Vui lòng chọn" },
                          { value: "true", name: "Tiêu chí" },
                          { value: "false", name: "Tập tiêu chí" },
                        ]}
                        label="Loại tiêu chí"
                      />
                      {values.isCriteria === "true" && (
                        <>
                          <FastField
                            name="name"
                            component={CinputField}
                            placeholder="Hồ sơ dân sự"
                            label="Tên tiêu chí"
                          />
                          <FastField
                            name="standardPoint"
                            component={CinputField}
                            label="Nhập số bên"
                            placeholder="0,1,,2..."
                          />
                          <FastField
                            name="note"
                            component={CinputField}
                            label="Nhập ghi chú"
                            placeholder="Ghi chú...."
                          />
                        </>
                      )}
                      {values.isCriteria === "false" && (
                        <>
                          <FastField
                            name="name"
                            component={CinputField}
                            placeholder="Hồ sơ dân sự"
                            label="Tên tiêu chí"
                          />
                          <FastField
                            name="note"
                            component={CinputField}
                            label="Nhập ghi chú"
                            placeholder="Ghi chú...."
                          />
                        </>
                      )}
                    </CModalBody>
                    <CModalFooter>
                      <CButton color="secondary" onClick={onClose}>
                        Hủy bỏ
                      </CButton>
                      <CButton
                        color="info"
                        type="submit"
                        disabled={
                          !formikProps.isValid || formikProps.isSubmitting
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
      </CCol>
    </CRow>
  );
};
