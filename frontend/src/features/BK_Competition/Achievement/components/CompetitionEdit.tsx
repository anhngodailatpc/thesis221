import React, { useEffect, useState } from 'react'
import {
  CCardBody,
  CCol,
  CForm,
  CFormGroup,
  CInput,
  CLabel,
  CTextarea,
} from '@coreui/react'
import Modal from '../../../../common/Modal'
import moment from 'moment'
import achievementApi from '../../../../api/Achievement/achievementApi'
import Achievement from '../../../../types/Achievement'
import { useHistory } from 'react-router'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
registerLocale('vi', vi)

export const CompetitionEdit = (props: any) => {
  const {
    isOpen,
    handleClose,
    title,
    handleSubmit,
    item,
    btnSubmit,
    colorBtnSubmit,
  } = props
  const [data, setData] = useState({
    id: 0,
    name: '',
    description: '',
    type: 'COMPETITION',
    startAt: null,
    endAt: null,
  })
  const [textErr, setTextErr] = useState('')
  const history = useHistory()

  useEffect(() => setData(item), [item])

  const handleChange = (event: any) =>
    setData({ ...data, [event.target.name]: event.target.value })

  const handleSubmitForm = async () => {
    if (data.name.trim() === '') setTextErr('Lỗi')
    else if (data.name.length > 300)
      setTextErr('Tên thi đua không thể quá dài')
    else if (data.startAt === null || data.endAt === null)
      setTextErr('Cần thiết lập thời gian')
    else if (moment(data.startAt).diff(moment(data.endAt), 'days') > 0)
      setTextErr('Lỗi thời gian')
    // else {
    try {
      const updateAchievement: Achievement = await achievementApi.update(
        data.id.toString(),
        data
      )
      handleSubmit(data.id, updateAchievement)
    } catch (error: any) {
      console.log(error.message)
      history.push('/loi-truy-cap')
    }
    // }
  }

  useEffect(() => {
    if (!isOpen) {
      setData((data) => ({
        id: 0,
        name: '',
        description: '',
        type: 'COMPETITION',
        startAt: null,
        endAt: null,
      }))
      setTextErr('')
    }
  }, [isOpen])

  const handleChangeDateStart = (startAt: any) =>
    setData((data) => ({ ...data, startAt }))
  const handleChangeDateEnd = (endAt: any) =>
    setData((data) => ({ ...data, endAt }))
  const Input = (pros: any) => {
    const { onChange, placeholder, value, id, onClick } = pros
    return (
      <CInput
        onChange={onChange}
        placeholder={placeholder}
        value={value}
        id={id}
        onClick={onClick}
      />
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleClose}
      title={title}
      btnSubmit={btnSubmit}
      colorBtnSubmit={colorBtnSubmit}
      handleSubmit={handleSubmitForm}>
      <CCardBody>
        <h4 style={{ color: 'red' }}>{textErr}</h4>
        <CForm action='' method='post'>
          <CFormGroup>
            <CLabel>Thi đua</CLabel>
            <CInput
              id='name'
              name='name'
              value={data.name}
              onChange={handleChange}
              placeholder='Nhập tên thi đua'
            />
          </CFormGroup>
          <CFormGroup row>
            <CCol xs='6'>
              <CLabel htmlFor='date-input'>Ngày bắt đầu</CLabel>
              <DatePicker
                selected={data.startAt && moment(data.startAt).toDate()}
                // minDate={moment().toDate()}
                onChange={handleChangeDateStart}
                locale='vi'
                customInput={<Input />}
                placeholderText='Ngày/Tháng/Năm'
                dateFormat='dd/MM/yyyy'
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode='select'
              />
            </CCol>
            <CCol xs='6'>
              <CLabel htmlFor='date-input'>Ngày kết thúc</CLabel>
              <DatePicker
                selected={data.endAt && moment(data.endAt).toDate()}
                minDate={moment()
                  .add(moment(data.startAt).diff(moment(), 'days') + 1, 'days')
                  .toDate()}
                onChange={handleChangeDateEnd}
                locale='vi'
                customInput={<Input />}
                placeholderText='Ngày/Tháng/Năm'
                dateFormat='dd/MM/yyyy'
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode='select'
              />
            </CCol>
          </CFormGroup>
          
          <CFormGroup>
            <CLabel>Mô tả</CLabel>
            <CTextarea
              name='description'
              id='description'
              value={data.description}
              onChange={handleChange}
              placeholder='Mô tả cho thi đua'
            />
          </CFormGroup>
        </CForm>
      </CCardBody>
    </Modal>
  )
}
