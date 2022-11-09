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
import * as yup from 'yup'
import YouthBranchApi from '../../../../api/Achievement/youthBranchApi'

let validationSchema = yup.object().shape({
  name: yup
    .string()
    .required('Bắt buộc nhập')
    .min(2, 'tối thiểu 2 ký tự')
    .max(150, 'tối thiểu 150 ký tự'),
})

interface MyFormValues {
  name: string
}

type Props = {
  isOpen: boolean
  onClose: () => void
  isAdd: boolean
  onAddDepartment: (value: any) => void
  onUpdateDepartment: (value: any) => void
  value: { id: string; code: string; name: string }
}

export const FormYouthBranch: React.FC<Props> = ({
  isOpen,
  onClose,
  isAdd,
  onAddDepartment,
  onUpdateDepartment,
  value,
}) => {
  const [textError, setTextError] = React.useState('')
  const [initialValues, setInitialValues] = React.useState<MyFormValues>({
    name: value.name,
  })

  React.useEffect(() => {
    if (!isOpen) setTextError('')
  }, [isOpen])

  React.useEffect(() => {
    setInitialValues({
      name: value.name,
    })
  }, [value])

  const handleOnSubmit = async (values: any, actions: any) => {
    try {
      if (isAdd) {
        const newDepartment = await YouthBranchApi.create(value.code, {
          name: values.name,
        })
        onAddDepartment(newDepartment)
      } else {
        const updateDepartment = await YouthBranchApi.update(
          value.code,
          value.id,
          {
            name: values.name,
          }
        )
        onUpdateDepartment(updateDepartment)
      }

      // end logic submit form
      onClose()
      actions.resetForm()
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
          <CModal show={isOpen} color='info' onClosed={onClose}>
            <CModalHeader closeButton>
              <CModalTitle>
                {isAdd ? 'Thêm đơn vị nhỏ hơn' : 'Cập nhập đơn vị nhỏ hơn'}
              </CModalTitle>
            </CModalHeader>
            <Formik
              initialValues={initialValues}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={handleOnSubmit}>
              {(formikProps) => {
                return (
                  <Form>
                    <CModalBody>
                      <CRow>
                        <CCol style={{ color: 'red' }} sm='12'>
                          {textError}
                        </CCol>
                        <CCol sm='12'>
                          <FastField
                            name='name'
                            component={CinputField}
                            placeholder='...'
                            label='Tên đơn vị/ đội'
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
                )
              }}
            </Formik>
          </CModal>
        </CCardBody>
      </CCol>
    </CRow>
  )
}
