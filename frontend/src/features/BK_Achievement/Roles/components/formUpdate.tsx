import * as React from 'react'

import { Formik, Form, FastField } from 'formik'
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
} from '@coreui/react'
import CinputField from '../../../../common/input/CInput'
import CselectField from '../../../../common/input/Cselect' 
import * as yup from 'yup'
import { useDispatch } from 'react-redux'

let validationSchema = yup.object().shape({
  name: yup.string().required('Bắt buộc nhập'),
  mssv: yup
    .number()
    .required('Bắt buộc nhập')
    .positive('Mã không hợp lệ')
    .integer('Mã không hợp lệ'),
})

interface MyFormValues {
  name: string
  mssv: number
}

export const FormUpdate = (props: any) => {
  const { isOpen, onClose } = props
  const initialValues: MyFormValues = { name: '', mssv: 0 }
  const dispatch = useDispatch()
  const handleOnSubmit = async (values: any, actions: any) => {
    try {
      onClose()
      actions.resetForm()
    } catch (error: any) {
      console.log(error.message)
    }

    actions.setSubmitting(false)
  }
  return (
    <CRow>
      <CCol>
        <CCardBody>
          <CModal show={isOpen} size='lg' color='info' onClosed={onClose}>
            <CModalHeader closeButton>
              <CModalTitle>Thông tin cần thiết</CModalTitle>
            </CModalHeader>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleOnSubmit}>
              {(formikProps) => {
                return (
                  <Form>
                    <CModalBody>
                      <CRow>
                        <CCol xl='7'>
                          <FastField
                            name='email'
                            component={CinputField}
                            placeholder='abc@hcmut.edu.vn'
                            label='Email'
                          />
                        </CCol>
                        <CCol xl='5'>
                          <FastField
                            name='role'
                            label='quyền hạn'
                            component={CselectField}
                            values={[
                              { value: '1', name: 'quản trị viên' },
                              { value: '2', name: 'người dùng' },
                            ]}
                          />
                        </CCol>
                      </CRow>
                    </CModalBody>
                    <CModalFooter>
                      <CButton
                        color='info'
                        type='submit'
                        disabled={
                          !formikProps.isValid ||
                          !formikProps.dirty ||
                          formikProps.isSubmitting
                        }
                        onDoubleClick={(e) => e.preventDefault()}>
                        Xác nhận
                      </CButton>
                    </CModalFooter>
                  </Form>
                )
              }}
            </Formik>
          </CModal>
        </CCardBody>
      </CCol>
    </CRow>
  )
}
