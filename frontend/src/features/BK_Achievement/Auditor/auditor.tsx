import {
  CButton,
  CCol,
  CContainer,
  CFormGroup,
  CLabel,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
  CTextarea,
  CModalFooter,
  CInputCheckbox,
  CDataTable,
  CCard,
  CCardBody,
} from '@coreui/react'
import React, { useCallback, useEffect, useState, memo } from 'react'
import Card from './components/Collapse'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import AuditorApi from '../../../api/Achievement/auditorApi'
import Toaster from '../../../common/toast'
import achievementApi from '../../../api/Achievement/achievementApi'
import moment from 'moment'
import UserApi from '../../../api/Achievement/userApi'
import { useHistory } from 'react-router-dom'
import Loading from '../../../assets/images/loading.gif'

const fields = [
  {
    key: 'name',
    label: 'Tên người duyệt',
    sorter: false,
    filter: false,
    _style: { textAlign: 'center' },
  },
  {
    key: 'email',
    label: 'email',
    sorter: false,
    filter: false,
    _style: { width: '20%', textAlign: 'center' },
  },
  {
    key: 'result',
    label: 'kết quả',
    sorter: false,
    filter: false,
    _style: { textAlign: 'center' },
  },
]

const well = {
  boxShadow: '0px 4px 4px 4px rgba(23,28,255,0.24)',
}

const Auditor = (props: any) => {
  const {
    typeOb,
    handleSubmissionSuccess,
    dataParent,
    dataSubmission,
    achievementId,
    examerId,
    isFinal,
    lockForever,
    seen,
  } = props
  const [data, setData] = useState<any[]>([])
  const [isToast, setIsToast] = useState(false)
  const [isDisable, setIsDisable] = useState(false)
  const [review, setReview] = useState(false)
  const [valCheck, setValCheck] = useState(false)
  const [result, setResult] = useState([])
  const [submissModal, setSubmissModal] = useState(false)
  const [achievement, setAchievement] = useState<any>()
  const auditor = useSelector((state: RootState) => state.auditor)
  const history = useHistory()
  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await UserApi.verifyLogin()
      } catch {
        history.push('/login')
      }
    }
    verifyLogin()
    setData(dataSubmission?.criterias || [])
  }, [dataSubmission, history])

  useEffect(() => {
    async function getAchievement(id: number) {
      const achievement = await achievementApi.get(id)
      setAchievement(achievement)
    }
    getAchievement(achievementId)
  }, [achievementId])

  const handleSubmit = useCallback(async () => {
    const submission = auditor.find((sub) => sub.examerId === examerId)
    try {
      await AuditorApi.createResultOfCriteria(
        submission?.criterias,
        achievementId,
        valCheck,
        examerId
      )
      setIsToast(true)
      handleSubmissionSuccess(examerId, valCheck)
      setTimeout(() => setIsToast(false), 3000)
    } catch (error: any) {
      console.error(error.message)
    }
  }, [achievementId, auditor, examerId, valCheck, handleSubmissionSuccess])

  const getChildNode = useCallback((data: Array<any>, parentNode: any) => {
    return data.filter((item) => parentNode.children.includes(item.idCriteria))
  }, [])

  const handleSendSubmission = useCallback(async () => {
    setIsDisable(true)
    setSubmissModal(false)
    await handleSubmit()
    setTimeout(() => setIsDisable(false), 3000)
  }, [handleSubmit])

  const handleClickSubmit = async () => {
    try {
      const response = await AuditorApi.getResult(achievementId, examerId)
      setResult(response)
      setSubmissModal(true)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <CContainer>
      <CRow style={{ height: '100%' }}>
        {dataParent ? (
          <>
            <CCol
              xl='12'
              className='mt-2 d-flex justify-content-between align-items-center'>
              <div>
                {dataParent.soft
                  ? `Phải đạt ít nhất ${dataParent.soft} tiêu chí`
                  : `Phải đạt tất cả tiêu chí`}
              </div>
              <CButton color='primary' onClick={() => setReview(true)}>
                Xem nhận xét
              </CButton>
            </CCol>
            <CCol xl='12' className='mt-2'>
              {}
              {dataParent.criterias.map((item: any) =>
                item.isRoot ? (
                  <Card
                    typeOb={typeOb}
                    key={item.id}
                    isRoot={true}
                    getChildren={getChildNode}
                    data={item}
                    disabled={true}
                    dataTotal={dataParent.criterias}
                  />
                ) : undefined
              )}
              {dataParent.criterias.map((item: any) =>
                item.description ? (
                  <div style={{ visibility: 'hidden' }} key={item.id}>
                    <CFormGroup>
                      <CLabel htmlFor={item.id}>{item.name}</CLabel>
                      <CTextarea
                        name={item.name}
                        id={item.id}
                        disabled={true}
                        value={item.description}
                      />
                    </CFormGroup>
                  </div>
                ) : undefined
              )}
            </CCol>
            <CModal
              show={review}
              className='mt-5'
              size='lg'
              onClose={() => setReview(false)}
              color='info'>
              <CModalHeader closeButton>
                <CModalTitle>Xem nhận xét</CModalTitle>
              </CModalHeader>
              <CModalBody>
                {dataParent.criterias.map((item: any) =>
                  item.description ? (
                    <CFormGroup key={item.id}>
                      <CLabel htmlFor={item.id}>{item.nameCriteria}</CLabel>
                      <CTextarea
                        name={item.nameCriteria}
                        id={item.id}
                        disabled={true}
                        value={item.description}
                      />
                    </CFormGroup>
                  ) : undefined
                )}
              </CModalBody>
            </CModal>
          </>
        ) : data.length === 0 ? (
          <CCol
            xl='12'
            className='mt-2 d-flex align-items-center justify-content-center'>
            <img src={Loading} alt='Girl in a jacket' />
          </CCol>
        ) : (
          <>
            <CCol xl='12' className='mt-2 d-flex align-items-center'>
              <div>
                {dataSubmission?.soft
                  ? `Phải đạt ít nhất ${dataSubmission?.soft} tiêu chí`
                  : `Phải đạt tất cả tiêu chí`}
              </div>
            </CCol>
            <CCol xl='12' className='mt-2'>
              {data.map((item: any) =>
                item.isRoot ? (
                  <Card
                    typeOb={typeOb}
                    key={item.id}
                    isRoot={true}
                    achievementId={achievementId}
                    isFinal={isFinal}
                    seen={seen}
                    getChildren={getChildNode}
                    data={item}
                    dataTotal={data}
                    examerId={examerId}
                  />
                ) : undefined
              )}
              {lockForever ||
                moment().diff(moment(achievement?.endAt), 'hours') <= 0 || (
                  <div className='float-right'>
                    <CButton
                      color='primary'
                      disabled={isDisable}
                      className=''
                      onClick={handleClickSubmit}>
                      <div className='m-0 p-0'>Gửi bài chấm</div>
                    </CButton>
                  </div>
                )}
            </CCol>
            <Toaster isShow={isToast} />
          </>
        )}
      </CRow>
      <CModal
        show={submissModal}
        className='mt-5'
        size='lg'
        onClose={() => setSubmissModal(false)}
        color='info'>
        <CModalHeader closeButton>
          <CModalTitle>Đánh giá hồ sơ</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {result.length > 0 && (
            <CDataTable
              items={result}
              fields={fields}
              noItemsView={{
                noResults: 'Không có kết quả tìm kiếm',
                noItems: 'Người thẩm định hồ sơ chưa duyệt',
              }}
              scopedSlots={{
                name: (item: any) => (
                  <td className='align-middle text-center'>
                    {item.surName} {item.name}
                  </td>
                ),
                email: (item: any) => (
                  <td className='align-middle text-center'>{item.email}</td>
                ),
                result: (item: any) => {
                  return (
                    <td className='align-middle text-center'>
                      {item.result ? 'Đạt' : 'Không Đạt'}
                    </td>
                  )
                },
              }}></CDataTable>
          )}
          <CCard style={well}>
            <CCardBody className='d-flex'>
              <div className='d-flex ml-3'>
                <div> Kết quả thẩm định hồ sơ</div>
                <CInputCheckbox
                  checked={valCheck}
                  onChange={(e) => setValCheck(e.currentTarget.checked)}
                />
              </div>
            </CCardBody>
          </CCard>
        </CModalBody>

        <CModalFooter>
          <CButton
            disabled={
              isDisable ||
              moment().diff(moment(achievement?.endAt), 'days') <= 0
            }
            color='info'
            onClick={handleSendSubmission}>
            Xác nhận
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}

export default memo(Auditor)
