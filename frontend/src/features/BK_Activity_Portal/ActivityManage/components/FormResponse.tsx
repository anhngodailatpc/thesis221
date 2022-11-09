import * as React from 'react'
import { Formik, Form, FastField, Field } from 'formik'
import ReactSelect from '../../../../common/input/Cselect/reactSelect'
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
import activityApi from '../../../../api/BKAP/activity'
import CinputField from '../../../../common/input/CInput'
import * as yup from 'yup'

let validationSchema = yup.object().shape({
  status: yup.string().typeError('Bắt buộc nhập').required('Bắt buộc nhập'),
  noteStatus: yup
    .string()
    .when('status', {
      is: 'PASSCONDITION',
      then: yup.string().typeError('vui lòng nhập').required('vui lòng nhập'),
    })
    .when('status', {
      is: 'NOPASS',
      then: yup.string().typeError('vui lòng nhập').required('vui lòng nhập'),
    })
    .nullable(),
})

interface MyFormValues {
  status: string | null
  noteStatus: string | null
}

type Props = {
  isOpen: boolean
  onClose: () => void
  onUpdateResponse: (value: any) => void
  value: { id: number; status: string; noteStatus: string }
}

export const FormResponse: React.FC<Props> = ({
  isOpen,
  onClose,
  onUpdateResponse,
  value,
}) => {
  const [textError, setTextError] = React.useState('')
  const [initialValues, setInitialValues] = React.useState<MyFormValues>({
    status: null,
    noteStatus: null,
  })

  React.useEffect(() => {
    if (!isOpen) setTextError('')
  }, [isOpen])

  React.useEffect(() => {
    setInitialValues({
      status: value.status,
      noteStatus: value.noteStatus,
    })
  }, [value])

  const handleOnSubmit = async (values: any, actions: any) => {
    try {
      await activityApi.updateStatus({ id: value.id, ...values })
      onUpdateResponse({ id: value.id, ...values })
      // end logic submit form
      onClose()
      actions.setSubmitting(false)
    } catch (error: any) {
      if (error?.response.data.statusCode === 400) {
        setTextError(error?.response.data.message)
      } else {
        console.error(error)
      }
    }
  }
  return (
    <CRow>
      <CCol>
        <CCardBody>
          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={handleOnSubmit}>
            {(formikProps) => {
              return (
                <CModal show={isOpen} size='' color='info' onClosed={onClose}>
                  <CModalHeader closeButton>
                    <CModalTitle>Phản hồi hoạt động</CModalTitle>
                  </CModalHeader>
                  <Form>
                    <CModalBody>
                      <CRow>
                        <CCol style={{ color: 'red' }} sm='12'>
                          {textError}
                        </CCol>
                        <CCol sm='12'>
                          <Field
                            name='status'
                            component={ReactSelect}
                            // disabled={user.isUpdatedInformation}
                            values={[
                              { value: 'PASS', label: 'Duyệt' },
                              {
                                value: 'PASSCONDITION',
                                label: 'Duyệt có điều kiện',
                              },
                              { value: 'NOPASS', label: 'Không duyệt' },
                            ]}
                            placeholder='Vui lòng chọn'
                            label='Phản hồi'
                            bold={true}
                          />
                        </CCol>

                        <CCol sm='12'>
                          <FastField
                            name='noteStatus'
                            component={CinputField}
                            placeholder='...'
                            label='Lý do'
                          />
                        </CCol>
                      </CRow>
                    </CModalBody>
                    <CModalFooter>
                      <CButton color='secondary' onClick={onClose}>
                        Hủy bỏ
                      </CButton>
                      <CButton
                        color='info'
                        type='submit'
                        disabled={
                          !formikProps.isValid || formikProps.isSubmitting
                        }
                        onDoubleClick={(e) => e.preventDefault()}>
                        Xác nhận
                      </CButton>
                    </CModalFooter>
                  </Form>
                </CModal>
              )
            }}
          </Formik>
        </CCardBody>
      </CCol>
    </CRow>
  )
}
