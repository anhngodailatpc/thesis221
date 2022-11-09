import React, { useEffect, useState, useCallback, memo } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CTabPane,
  CTabs,
  CButton,
  CCardHeader,
  CCollapse,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CDataTable,
  CInputCheckbox,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import AuditorApi from '../../../../api/Achievement/auditorApi'
import { freeSet } from '@coreui/icons'
import { RootState } from '../../../../store'
import { setInitCriteria } from '../../../../redux/auditor'
import { useDispatch, useSelector } from 'react-redux'
import UserApi from '../../../../api/Achievement/userApi'
import moment from 'moment'
import Toaster from '../../../../common/toast'
import CardCollapse from './Collapse'
import { useHistory } from 'react-router'
import { AuditorForAchievement } from '../../../../types/Auditor'
import achievementApi from '../../../../api/Achievement/achievementApi'

interface Filters {
  limit: number
  page: number
  search: string
}

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

const SubmissionUsersTest = (props: any) => {
  const { id: achievement, mssv: mssvParam } = props?.match?.params

  const {
    achievementId: achievementIdProps,
    examerId = 7,
    auditorId,
    isFinal,
    seen,
    mssvProp,
  } = props
  const history = useHistory()
  const mssv = mssvParam || mssvProp
  const achievementId = achievement || achievementIdProps
  const [submissModal, setSubmissModal] = useState(false)
  const [users, setUsers] = useState<any[]>([])
  const [data, setData] = useState<any[]>([])
  const [isToast, setIsToast] = useState(false)
  const [isDisable, setIsDisable] = useState(false)
  const userId = useSelector((state: RootState) => state.user.id)
  const auditor = useSelector((state: RootState) => state.auditor)
  const [valCheck, setValCheck] = useState(false)
  const [result, setResult] = useState([])
  const dispatch = useDispatch()
  const [infoUser, setInfoUser] = useState<any>({})
  const [collapseUser, setCollapseUser] = useState(true)
  const [typeObject, setTypeObject] = useState('ACHIEVEMENT')
  const [lockForever, setLockForever] = useState<boolean>(false)
  const [collapseDepartment, setCollapseDepartment] = useState(true)
  const [filters] = useState<Filters>({
    limit: 1,
    page: 1,
    search: mssv,
  })
  const [auditors, setAuditors] = useState<AuditorForAchievement[]>([])
  useEffect(() => {
    async function getUsers() {
      try {
        const auditors: AuditorForAchievement[] =
          await AuditorApi.getAuditorsForAchievement(achievementId)
        if (auditors.length === 0) {
        } else {
          setAuditors(auditors)
        }
      } catch (error: any) {
        console.error(error)
      }
    }
    getUsers()
  }, [achievementId])

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await UserApi.verifyLogin()
      } catch {
        history.push('/login')
      }
    }
    async function getStatus() {
      const { lock, type } = await achievementApi.get(achievementId)
      setTypeObject(type || 'ACHIEVEMENT')
      if (lock === 'forever') setLockForever(true)
    }
    verifyLogin()
    getStatus()
  }, [achievementId, history])

  useEffect(() => {
    async function getUsers() {
      try {
        const { data } = await AuditorApi.getUsers(
          achievementId,
          auditorId,
          filters
        )
        setUsers(data)
      } catch (error: any) {
        console.error(error.message)
      }
    }
    getUsers()
  }, [achievementId, filters, auditorId])

  useEffect(() => {
    async function getInfoUser(mssv: string) {
      try {
        const response = await UserApi.getMssv(mssv)
        setInfoUser(response)
      } catch (error) {
        console.error(error)
      }
    }

    getInfoUser(mssv)
  }, [mssv])

  const getChildNode = useCallback((data: Array<any>, parentNode: any) => {
    return data.filter((item) => parentNode.children.includes(item.idCriteria))
  }, [])

  const handleSubmit = useCallback(async () => {
    const submission = auditor.find((sub) => sub.examerId === infoUser.id)
    try {
      await AuditorApi.createResultOfCriteria(
        submission?.criterias,
        achievementId,
        valCheck,
        infoUser.id
      )
      setIsToast(true)
      setUsers([{ ...users[0], isResult: valCheck ? 'success' : 'failure' }])
      setTimeout(() => {
        setIsToast(false)
      }, 3000)
    } catch (error: any) {
      console.error(error.message)
    }
  }, [achievementId, auditor, valCheck, users, infoUser.id])

  const handleSendSubmission = useCallback(async () => {
    setIsDisable(true)
    setSubmissModal(false)
    await handleSubmit()
    setTimeout(() => setIsDisable(false), 3000)
  }, [handleSubmit])

  const handleClickSubmit = async () => {
    try {
      const response = await AuditorApi.getResult(achievementId, infoUser.id)
      setResult(response)
      setSubmissModal(true)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    async function getSubmissionExamers() {
      try {
        const res = await AuditorApi.getSubmissionExamers(
          achievementId,
          userId,
          users.map((user) => user.id)
        )
        dispatch(setInitCriteria(res))
        setData(res)
      } catch (error: any) {
        console.log(error.message)
      }
    }
    async function getSubmissionWithAuditor(
      achievementId: number,
      auditorId: number
    ) {
      try {
        const res = await AuditorApi.getSubmissionExamers(
          achievementId,
          auditorId,
          users.map((user) => user.id)
        )
        setData(res)
      } catch (error: any) {
        console.error(error.message)
      }
    }

    if (auditorId) {
      getSubmissionWithAuditor(achievementId, auditorId)
    } else {
      getSubmissionExamers()
    }
  }, [achievementId, dispatch, userId, auditorId, users])

  const handleValueInput: any = (value: string | number) => {
    if (!value) return 'Chưa cung cấp'
    if (moment(value).isValid()) return moment(value).format('DD/MM/YYYY')
    return value
  }
  return (
    <>
      <CTabs activeTab={userId}>
        <CCard>
          <CCardHeader>
            <CIcon
              size='lg'
              className='mr-3 mb-2'
              content={freeSet.cilArrowCircleLeft}
              onClick={() =>
                history.push(`/danh-sach-nop-ho-so/${achievementId}`)
              }
            />
          </CCardHeader>

          <CCardBody>
            <CTabPane data-tab={userId}>
              <CTabs activeTab={mssv}>
                <CRow>
                  <CCol className='mt-2 mb-2 d-flex flex-column' xl='3'>
                    <CRow>
                      <CCol sm='12'>
                        <CNav
                          variant='pills'
                          className='flex-column mt-3'
                          role='tablist'>
                          {users.map((user: any) => (
                            <CNavItem key={user?.id}>
                              <CNavLink data-tab={user?.mssv}>
                                <CIcon size='lg' content={freeSet.cilContact} />

                                {` ${user?.surName} ${user?.name} - ${user?.mssv} `}
                                {user.isResult === 'success' && (
                                  <CIcon content={freeSet.cilCheckCircle} />
                                )}
                                {user.isResult === 'failure' && (
                                  <CIcon content={freeSet.cilXCircle} />
                                )}
                                <br />
                                {`Khoa: ${user?.department}`}
                              </CNavLink>
                            </CNavItem>
                          ))}
                          {data[0]?.criterias?.map(
                            (item: any) =>
                              item.isRoot && (
                                <CNavItem key={item?.id}>
                                  <CNavLink data-tab={item?.id}>
                                    {item.nameCriteria}{' '}
                                  </CNavLink>
                                </CNavItem>
                              )
                          )}
                        </CNav>
                      </CCol>
                      {lockForever || (
                        <CCol sm='12' className='d-flex justify-content-center'>
                          <CButton
                            disabled={isDisable}
                            color='success'
                            className='my-2 px-5'
                            onClick={handleClickSubmit}>
                            Gửi bài duyệt
                          </CButton>
                        </CCol>
                      )}
                    </CRow>
                  </CCol>
                  <CCol xl='9'>
                    <CTabContent>
                      <CTabPane data-tab={mssv}>
                        {Object.keys(infoUser).length === 0 ? (
                          'Người dùng chưa cung cấp thông tin'
                        ) : (
                          <>
                            <CCard>
                              <CCardHeader
                                color='secondary'
                                onClick={() => setCollapseUser(!collapseUser)}>
                                <h4>Thông tin cá nhân</h4>
                              </CCardHeader>
                              <CCollapse show={collapseUser}>
                                <CCardBody>
                                  <CRow>
                                    <CCol className='mb-2' sm='3'>
                                      <strong>Họ và tên đệm:</strong>{' '}
                                      {infoUser.surName}
                                    </CCol>
                                    <CCol className='mb-2' sm='2'>
                                      <strong>Tên:</strong> {infoUser.name}
                                    </CCol>
                                    <CCol className='mb-2' sm='2'>
                                      <strong>Giới tính:</strong>{' '}
                                      {infoUser.contactInfoId.gender === 'Male'
                                        ? 'Nam'
                                        : infoUser.contactInfoId.gender ===
                                          'Female'
                                        ? 'Nữ'
                                        : 'Khác'}
                                    </CCol>
                                    <CCol className='mb-2' sm='5'>
                                      <strong>Mã số cán bộ:</strong>{' '}
                                      {infoUser.mssv}
                                    </CCol>
                                    <CCol className='mb-2' sm='5'>
                                      <strong>Email:</strong> {infoUser.email}
                                    </CCol>
                                    <CCol className='mb-2' sm='7'>
                                      <strong>Email cá nhân:</strong>{' '}
                                      {infoUser.contactInfoId.emailPersonal}
                                    </CCol>
                                    <CCol className='mb-2' sm='3'>
                                      <strong>Số CMND/CCCD:</strong>{' '}
                                      {handleValueInput(
                                        infoUser.contactInfoId.CMND
                                      )}
                                    </CCol>

                                    <CCol className='mb-2' sm='9'>
                                      <strong>Số điện thoại:</strong>{' '}
                                      {infoUser.contactInfoId.phone}
                                    </CCol>

                                    <CCol className='mb-2' sm='3'>
                                      <strong>Ngày sinh:</strong>{' '}
                                      {handleValueInput(
                                        infoUser.contactInfoId.birthday
                                      )}
                                    </CCol>
                                    <CCol className='mb-2' sm='2'>
                                      <strong>Dân tộc:</strong>{' '}
                                      {handleValueInput(
                                        infoUser.contactInfoId.nation
                                      )}
                                    </CCol>
                                    <CCol className='mb-2' sm='7'>
                                      <strong>Tôn giáo:</strong>{' '}
                                      {handleValueInput(
                                        infoUser.contactInfoId.religion
                                      )}{' '}
                                    </CCol>
                                    <CCol className='mb-2' sm='12'>
                                      <strong>Quê quán:</strong>{' '}
                                      {handleValueInput(
                                        infoUser.contactInfoId.homeTown
                                      )}
                                    </CCol>
                                    <CCol className='mb-2' sm='12'>
                                      <strong>Thường trú:</strong>{' '}
                                      {handleValueInput(
                                        infoUser.contactInfoId.resident
                                      )}{' '}
                                    </CCol>
                                  </CRow>
                                </CCardBody>
                              </CCollapse>
                            </CCard>
                            <CCard>
                              <CCardHeader
                                color='secondary'
                                onClick={() =>
                                  setCollapseDepartment(!collapseDepartment)
                                }>
                                <h4>Thông tin Phòng/Ban</h4>
                              </CCardHeader>
                              <CCollapse show={collapseDepartment}>
                                <CCardBody>
                                  <CRow>
                                    <CCol className='mb-2' sm='6'>
                                      <strong>Phòng/Ban:</strong>{' '}
                                      {infoUser.department.name}{' '}
                                    </CCol>

                                    <CCol className='mb-2' sm='6'>
                                      <strong>Nơi vào Công Đoàn:</strong>{' '}
                                      {handleValueInput(
                                        infoUser.contactInfoId.placeUnion
                                      )}{' '}
                                    </CCol>
                                    <CCol className='mb-2' sm='6'>
                                      <strong>Ngày vào Công Đoàn:</strong>{' '}
                                      {handleValueInput(
                                        infoUser.contactInfoId.dateAtUnion
                                      )}{' '}
                                    </CCol>

                                    <CCol className='mb-2' sm='6'>
                                      <strong>Nơi vào Đảng:</strong>{' '}
                                      {handleValueInput(
                                        infoUser.contactInfoId
                                          .placeCommunistParty
                                      )}{' '}
                                    </CCol>
                                    <CCol className='mb-2' sm='6'>
                                      <strong>Ngày vào Đảng:</strong>{' '}
                                      {handleValueInput(
                                        infoUser.contactInfoId
                                          .dateAtCommunistParty
                                      )}{' '}
                                    </CCol>
                                    <CCol className='mb-2' sm='6'>
                                      <strong>Ngày vào Hội Luật gia:</strong>{' '}
                                      {handleValueInput(
                                        infoUser.contactInfoId
                                          .studentAssociation
                                      )}
                                    </CCol>
                                    <CCol className='mb-2' sm='4'></CCol>
                                  </CRow>
                                </CCardBody>
                              </CCollapse>
                            </CCard>
                          </>
                        )}
                      </CTabPane>
                      {data[0]?.criterias?.map((item: any) =>
                        item.isRoot ? (
                          <CTabPane key={item?.id} data-tab={item?.id}>
                            <CardCollapse
                              typeOb={typeObject}
                              key={item.id}
                              isRoot={true}
                              achievementId={achievementId}
                              isFinal={
                                auditors.find(
                                  (auditor) =>
                                    auditor.id === userId && auditor.isFinal
                                )
                                  ? true
                                  : false
                              }
                              seen={seen}
                              getChildren={getChildNode}
                              data={item}
                              dataTotal={data[0].criterias}
                              examerId={infoUser.id}
                            />
                          </CTabPane>
                        ) : undefined
                      )}
                    </CTabContent>
                  </CCol>
                </CRow>
              </CTabs>
            </CTabPane>
          </CCardBody>
        </CCard>
      </CTabs>
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
            // disabled={
            //   isDisable ||
            //   moment().diff(moment(achievement?.endAt), 'days') <= 0
            // }
            color='info'
            onClick={handleSendSubmission}>
            Xác nhận
          </CButton>
        </CModalFooter>
      </CModal>
      <Toaster isShow={isToast} />
    </>
  )
}

export default memo(SubmissionUsersTest)
