import React, { useState } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { Formik, Form, FastField, Field } from 'formik'
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
import moment from 'moment'
import Select from 'react-select'
import DepartmentApi from '../../../../api/Achievement/departmentApi'
import activityApi from '../../../../api/BKAP/activity'
import InputDatePicker from '../../../../common/input/CInput/InputDatePicker'
import ReactSelect from '../../../../common/input/Cselect/reactSelect'
import activityCampaignApi from '../../../../api/BKAP/activityCampaignApi'
import activityGroupApi from '../../../../api/BKAP/activityGroupApi'
import ActivityCampaignExtend from '../../../../types/ActivityCampaign'
import ActivityGroupExtend from '../../../../types/ActivityGroup'
import DepartmentNotYouthBranch from '../../../../types/Department'
import { formatTime } from '../../../../common/formatTime'

let validationSchema = yup.object().shape({
  name: yup
    .string()
    .typeError('Bắt buộc nhập')
    .required('Bắt buộc nhập')
    .min(2, 'tối thiểu 2 ký tự')
    .max(150, 'tối thiểu 150 ký tự'),
  maximumParticipant: yup
    .number()
    .typeError('vui lòng nhập số')
    .required('vui lòng nhập số')
    .positive('phải là số dương'),
  maximumCTXH: yup
    .number()
    .typeError('vui lòng nhập số')
    .required('vui lòng nhập số')
    .positive('phải là số dương'),
  campaign: yup.string().typeError('Bắt buộc nhập').required('Bắt buộc nhập'),
  activityGroup: yup
    .string()
    .typeError('Bắt buộc nhập')
    .required('Bắt buộc nhập'),
  registerStartDay: yup
    .date()
    .typeError('Bắt buộc nhập')
    .required('Bắt buộc nhập'),
  registerEndDay: yup
    .date()
    .typeError('Bắt buộc nhập')
    .required('Bắt buộc nhập'),
  startDay: yup.date().typeError('Bắt buộc nhập').required('Bắt buộc nhập'),
  endDay: yup.date().typeError('Bắt buộc nhập').required('Bắt buộc nhập'),
})

interface MyFormValues {
  name: string
  maximumParticipant: number
  campaign: string
  activityGroup: string
  maximumCTXH: number
  registerStartDay: Date | null
  registerEndDay: Date | null
  startDay: Date | null
  endDay: Date | null
  link: string
}

type Props = {
  isOpen: boolean
  onClose: () => void
  isAdd: boolean
  onActionActivity: () => void
  maximumDepartment: number
  value: {
    id: string
    name: string
    maximumParticipant: number
    campaign: any
    activityGroup: any
    maximumCTXH: number
    registerStartDay: Date | null
    registerEndDay: Date | null
    startDay: Date | null
    endDay: Date | null
    departments: any
    link: string
    content: string
  }
}

export const FormAdd: React.FC<Props> = ({
  isOpen,
  onClose,
  isAdd,
  onActionActivity,
  maximumDepartment,
  value,
}) => {
  const [textError, setTextError] = useState('')
  const [content, setContent] = useState<string>(value.content || '')
  const [dataCampaign, setCampaign] = useState<ActivityCampaignExtend[]>([])
  const [dataGroup, setGroup] = useState<ActivityGroupExtend[]>([])
  const [dataDepartment, setDepartment] = useState<DepartmentNotYouthBranch[]>(
    []
  )
  const [departments, setDepartments] = useState<any>([])
  const [initialValues, setInitialValues] = useState<MyFormValues>({
    name: value.name,
    maximumParticipant: value.maximumParticipant,
    campaign: value.campaign,
    activityGroup: value.activityGroup,
    maximumCTXH: value.maximumCTXH,
    registerStartDay: value.registerStartDay
      ? moment(value.registerStartDay).toDate()
      : null,
    registerEndDay: value.registerEndDay
      ? moment(value.registerEndDay).toDate()
      : null,
    startDay: value.startDay ? moment(value.startDay).toDate() : null,
    endDay: value.endDay ? moment(value.endDay).toDate() : null,
    link: value.link,
  })

  React.useEffect(() => {
    if (!isOpen) setTextError('')
  }, [isOpen])

  React.useEffect(() => {
    async function get() {
      const [response1, response2, response3] = await Promise.all([
        activityCampaignApi.getAll(),
        activityGroupApi.getAllLimitActive(),
        DepartmentApi.get({
          limit: 10000,
          page: 1,
          search: '',
        }),
      ])
      setCampaign(response1)
      setGroup(response2)
      setDepartment(response3.data)
    }
    get()
  }, [])

  React.useEffect(() => {
    setInitialValues({
      name: value.name,
      maximumParticipant: value.maximumParticipant,
      campaign: String(value?.campaign?.id),
      activityGroup: String(value?.activityGroup?.id),
      maximumCTXH: value.maximumCTXH,
      registerStartDay: value.registerStartDay
        ? moment(value.registerStartDay).toDate()
        : null,
      registerEndDay: value.registerEndDay
        ? moment(value.registerEndDay).toDate()
        : null,
      startDay: value.startDay ? moment(value.startDay).toDate() : null,
      endDay: value.endDay ? moment(value.endDay).toDate() : null,
      link: value.link,
    })

    maximumDepartment === value.departments.length
      ? setDepartments([{ value: 100000, label: 'Tất cả' }])
      : setDepartments(
          value.departments.map((item: any) => ({
            value: +item.id,
            label: item.name,
          }))
        )
  }, [value, maximumDepartment])

  const handleOnSubmit = async (values: any, actions: any) => {
    try {
      const selectDepartment = departments.find(
        (item: any) => item.value === 100000
      )
        ? dataDepartment.map((item: DepartmentNotYouthBranch) => ({
            value: item.id,
            label: item.name,
          }))
        : departments
      if (isAdd) {
        await activityApi.add({
          ...values,
          startDay: formatTime(values.startDay, 0 + 24 - 7, 0, 0),
          endDay: formatTime(values.endDay, 23 + 24 - 7, 59, 59),
          registerStartDay: formatTime(
            values.registerStartDay,
            0 + 24 - 7,
            0,
            0
          ),
          registerEndDay: formatTime(
            values.registerEndDay,
            23 + 24 - 7,
            59,
            59
          ),
          departments: selectDepartment,
          content,
        })
      } else {
        await activityApi.update(
          {
            ...values,
            startDay: formatTime(values.startDay, 0 + 24 - 7, 0, 0),
            endDay: formatTime(values.endDay, 23 + 24 - 7, 59, 59),
            registerStartDay: formatTime(
              values.registerStartDay,
              0 + 24 - 7,
              0,
              0
            ),
            registerEndDay: formatTime(
              values.registerEndDay,
              23 + 24 - 7,
              59,
              59
            ),
            departments: selectDepartment,
            content,
          },
          value.id
        )
      }

      onActionActivity()
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
          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={handleOnSubmit}>
            {(formikProps) => {
              const { values, resetForm } = formikProps
              return (
                <CModal
                  show={isOpen}
                  size='lg'
                  color='info'
                  onClosed={() => {
                    onClose()
                    resetForm()
                  }}>
                  <CModalHeader closeButton>
                    <CModalTitle>
                      {isAdd ? 'Thêm hoạt động' : 'Cập nhật hoạt động'}
                    </CModalTitle>
                  </CModalHeader>
                  <Form>
                    <CModalBody>
                      <CRow>
                        <CCol style={{ color: 'red' }} sm='12'>
                          {textError}
                        </CCol>
                        <CCol sm='12'>
                          <FastField
                            name='name'
                            required='*'
                            component={CinputField}
                            placeholder='...'
                            label='Tên hoạt động'
                          />
                        </CCol>
                        <CCol sm='6'>
                          <FastField
                            name='maximumParticipant'
                            required='*'
                            type='number'
                            component={CinputField}
                            placeholder='...'
                            label='Số lượng cán bộ tối đa'
                          />
                        </CCol>
                        <CCol sm='6'>
                          <FastField
                            name='maximumCTXH'
                            required='*'
                            type='number'
                            component={CinputField}
                            placeholder='...'
                            label='Chỉ tiêu hoàn thành tối đa'
                          />
                        </CCol>
                        <CCol sm='12'>
                          <Field
                            name='campaign'
                            required='*'
                            component={ReactSelect}
                            // disabled={user.isUpdatedInformation}
                            values={dataCampaign.map(
                              (item: ActivityCampaignExtend) => ({
                                value: item.id,
                                label: `${item.name} (Nộp kế hoạch: ${moment(
                                  item.planStartDay
                                ).format('DD/MM/YYYY')} - ${moment(
                                  item.planEndDay
                                ).format('DD/MM/YYYY')}) (Diễn ra: ${moment(
                                  item.startDay
                                ).format('DD/MM/YYYY')} - ${moment(
                                  item.endDay
                                ).format('DD/MM/YYYY')})`,
                              })
                            )}
                            placeholder='Vui lòng chọn'
                            label='Hoạt động'
                          />
                        </CCol>
                        <CCol sm='12'>
                          <Field
                            name='activityGroup'
                            component={ReactSelect}
                            required='*'
                            // disabled={user.isUpdatedInformation}
                            values={dataGroup.reduce(
                              (pre: any, item: ActivityGroupExtend) => {
                                if (values.campaign === item.campaignId)
                                  return [
                                    ...pre,
                                    {
                                      value: item.id,
                                      label: `${item.name} (Số hoạt động tối đa cho cán bộ đăng ký: ${item.maximumActivity})`,
                                    },
                                  ]
                                return pre
                              },
                              []
                            )}
                            placeholder='Vui lòng chọn'
                            label=' Nhóm hoạt động'
                          />
                        </CCol>

                        <CCol sm='6'>
                          <FastField
                            name='startDay'
                            required='*'
                            component={InputDatePicker}
                            placeholder='Ngày/Tháng/Năm'
                            // minDate={moment().toDate()}
                            label='Ngày bắt đầu diễn ra hoạt động'
                            type='Date'
                            onChange={formikProps.handleChange}
                          />
                        </CCol>
                        <CCol sm='6'>
                          <FastField
                            name='endDay'
                            required='*'
                            component={InputDatePicker}
                            placeholder='Ngày/Tháng/Năm'
                            // minDate={moment().toDate()}
                            label='Ngày kết thúc diễn ra hoạt động'
                            type='Date'
                            onChange={formikProps.handleChange}
                          />
                        </CCol>
                        <CCol sm='6'>
                          <FastField
                            name='registerStartDay'
                            required='*'
                            component={InputDatePicker}
                            placeholder='Ngày/Tháng/Năm'
                            // minDate={moment().toDate()}
                            label='Ngày bắt đầu đăng ký'
                            type='Date'
                            onChange={formikProps.handleChange}
                          />
                        </CCol>
                        <CCol sm='6'>
                          <FastField
                            name='registerEndDay'
                            required='*'
                            component={InputDatePicker}
                            placeholder='Ngày/Tháng/Năm'
                            // minDate={moment().toDate()}
                            label='Ngày kết thúc đăng ký'
                            type='Date'
                            onChange={formikProps.handleChange}
                          />
                        </CCol>
                        <CCol sm='12'>
                          <div>
                            Các đơn vị tham gia hoạt động{' '}
                            <p style={{ color: 'red', display: 'inline' }}>*</p>{' '}
                          </div>
                          <div
                            style={{ marginBottom: '16px', marginTop: '8px' }}>
                            <Select
                              isMulti
                              defaultValue={
                                maximumDepartment === value.departments.length
                                  ? [{ value: 100000, label: 'Tất cả' }]
                                  : value.departments.map((item: any) => ({
                                      value: +item.id,
                                      label: item.name,
                                    }))
                              }
                              name='MultiUser'
                              options={[
                                { value: 100000, label: 'Tất cả' },
                                ...dataDepartment.map(
                                  (item: DepartmentNotYouthBranch) => ({
                                    value: +item.id,
                                    label: item.name,
                                  })
                                ),
                              ]}
                              onChange={(newValue: any) =>
                                setDepartments(newValue)
                              }
                              placeholder='Vui lòng chọn'
                            />
                          </div>
                        </CCol>
                        <CCol sm='12'>
                          <FastField
                            name='link'
                            component={CinputField}
                            placeholder='https://www.link.com'
                            label='Link đính kèm kế hoạch hoạt động'
                          />
                        </CCol>

                        <CCol sm='12'>
                          <div>Nội dung hoạt động</div>
                          <div
                            style={{ marginBottom: '16px', marginTop: '8px' }}>
                            <CKEditor
                              editor={ClassicEditor}
                              data={content}
                              onChange={(event: any, editor: any) =>
                                setContent(editor.getData())
                              }
                            />
                          </div>
                        </CCol>
                      </CRow>
                    </CModalBody>
                    <CModalFooter>
                      <CButton
                        color='secondary'
                        onClick={() => {
                          onClose()
                          resetForm()
                        }}>
                        Hủy bỏ
                      </CButton>
                      <CButton
                        color='info'
                        type='submit'
                        disabled={
                          !formikProps.isValid ||
                          formikProps.isSubmitting ||
                          departments.length === 0
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
