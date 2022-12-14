import {
  CCol,
  CContainer,
  CRow,
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { FaCheck } from 'react-icons/fa'
import { Submission } from '../../../../types/Submission'
import { Criteria } from '../../../../types/TieuChi'
import Select from 'react-select'
import {
  updatePoint,
  updateBin,
  updateFile,
  updateStudentComment,
  updateStudentSelect,
} from '../../../../redux/submission'
import { useDispatch } from 'react-redux'
import { extname } from 'path'
import FileData from '../../../../types/FileData'
// import { isTemplateTail } from "typescript";

const DefaultSubmission1: Submission = {
  id: -1,
  userId: 2,
  achievementId: 3,
  criteriaID: 'none',
  file: '',
  point: 0,
  binary: false,
  description: '',
  studentComment: '',
  studentSelect: '',
}
const DefaultSubmission2: Submission = {
  id: -1,
  userId: 2,
  achievementId: 3,
  criteriaID: 'cant find',
  file: '',
  point: 0,
  binary: false,
  description: '',
  studentComment: '',
  studentSelect: '',
}
const SubCrit = (prop: {
  typeOb: string
  parentid: number | string
  item: Criteria
  submitData: Submission[]
  cancelSubmit: () => void
  activateSubmit: () => void
  onShowClk: (s: string) => void
  addSaveFile: (s: FileData) => void
  onPreviewClk: (s: string) => void
}) => {
  const dispatch = useDispatch()
  // const [collapse, setCollapse] = useState(true);

  const subItem =
    prop.submitData.length > 0
      ? prop.submitData.filter((sub) => sub.criteriaID === prop.item.id)
          .length > 0
        ? prop.submitData.filter((sub) => sub.criteriaID === prop.item.id)[0]
        : DefaultSubmission2
      : DefaultSubmission1

  //console.log("Subitem binary value: ", subItem.binary);
  const [point, setPoint] = useState(subItem.point.toString())
  const [bin, setBin] = useState(subItem.binary)
  const [showAddFile, setShowAddFile] = useState<boolean>(subItem.file === '')
  const [studentComment, setStudentComment] = useState(subItem.studentComment)
  const [studentSelect, setStudentSelect] = useState(subItem.studentSelect)
  const [isBigFile, setIsBigFile] = useState(false)
  const [isWrongType, setIsWrongType] = useState(false)
  const [isDisableReviewButton, setIsDisableReviewButton] = useState(false)

  useEffect(() => {
    //console.log("Sub crit Reload");
    setPoint(subItem.point.toString())
    setBin(subItem.binary)
    setStudentComment(subItem.studentComment)
    setStudentSelect(subItem.studentSelect)
    setShowAddFile(subItem.file === '')
    setIsBigFile(false)
  }, [prop.submitData, subItem])
  //console.log("binary value: ", bin);

  const onFileChange = (e: any, fuckingid: string | number) => {
    // console.log("get in here");
    // console.log(fuckingid);
    var file = e.target.files
    if (file[0] !== undefined) {
      const fileExtName = extname(file[0].name)
      if (
        ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx', '.zip'].includes(
          fileExtName
        )
      ) {
        const fileData: FileData = {
          file: file[0],
          fileName: `${prop.item.id.toString()}${fileExtName}`,
        }
        setIsWrongType(false)
        prop.addSaveFile(fileData)
        if (file !== null) {
          const maxAllowedSize = 1 * 1024 * 1024
          if (file[0].size < maxAllowedSize) {
            if (subItem.file === '') {
              setIsDisableReviewButton(true)

              const fileExtName = extname(file[0].name)
              const payload = {
                subId: subItem.id,
                file: `${prop.item.id.toString()}${fileExtName}`,
              }
              //console.log(showAddFile);
              dispatch(updateFile(payload))
            }
            //console.log(file[0]);
            setShowAddFile(false)
            setIsBigFile(false)
          } else {
            setIsBigFile(true)
          }
        }
      } else {
        // console.log("set is wrong type to true");
        setIsBigFile(false)
        setIsWrongType(true)
      }
    }
  }
  // console.log("item:", prop.item);
  // console.log("Submit data:", prop.submitData);
  return (
    <CCard style={{ boxShadow: '0px 4px 4px 4px rgba(23,28,255,0.24)' }}>
      <CCardHeader color='light'>
        <CContainer>
          <CRow>
            <CCol className='px-0 d-flex align-items-center'>
              <strong> {prop.item.name} </strong>
            </CCol>
          </CRow>
        </CContainer>
      </CCardHeader>
      <CCardBody>
        <CContainer>
          {prop.item.note !== '' ? (
            <CRow>
              <CCol xl='12' className='pb-1'>
                <span style={{ color: 'red' }}>*</span>L??u ??: {prop.item.note}
              </CCol>
            </CRow>
          ) : (
            <></>
          )}
          {prop.item.content !== '' ? (
            <CRow>
              <CCol xl='12' className='pb-1'>
                N???i dung: {prop.item.content}
              </CCol>
            </CRow>
          ) : (
            <></>
          )}
          {prop.item.method === 'point' ? (
            <>
              <CRow className='mb-1'>
                <CCol xl='12'>
                  <strong>Ng?????i n???p h??? s?? nh???p ??i???m m??nh ?????t ???????c</strong>
                </CCol>
              </CRow>
              <CRow>
                <CCol xl='12' className='mb-1'>
                  {prop.item.upperSign !== '' ? (
                    prop.item.upperPoint > prop.item.lowerPoint ? (
                      <>
                        {' '}
                        ??i???u ki???n :{' '}
                        {prop.item.lowerSign === '>'
                          ? 'L???n h??n'
                          : 'L???n h??n ho???c b???ng'}{' '}
                        {prop.item.upperPoint} V??{' '}
                        {prop.item.upperSign === '<'
                          ? 'B?? h??n'
                          : 'B?? h??n ho???c b???ng'}{' '}
                        {prop.item.lowerPoint}
                      </>
                    ) : (
                      <>
                        ??i???u ki???n :
                        {prop.item.lowerSign === '>'
                          ? 'L???n h??n'
                          : 'L???n h??n ho???c b???ng'}{' '}
                        {prop.item.lowerPoint} Ho???c{' '}
                        {prop.item.upperSign === '<'
                          ? 'B?? h??n'
                          : 'B?? h??n ho???c b???ng'}{' '}
                        {prop.item.upperPoint}
                      </>
                    )
                  ) : (
                    <>
                      <>
                        ??i???u ki???n:{' '}
                        {prop.item.lowerSign === '>'
                          ? 'L???n h??n'
                          : prop.item.lowerSign === '>='
                          ? 'L???n h??n ho???c b???ng'
                          : prop.item.lowerSign === '<'
                          ? 'B?? h??n'
                          : 'B?? h??n ho???c b???ng'}{' '}
                        {prop.item.lowerPoint}
                      </>
                    </>
                  )}
                </CCol>
              </CRow>
            </>
          ) : prop.item.method === 'binary' ? (
            <>
              <CRow className='mb-1'>
                <CCol xl='12'>
                  <strong>Ng?????i n???p h??? s?? t??? ????nh gi?? ?????t hay kh??ng ?????t</strong>
                </CCol>
              </CRow>
            </>
          ) : prop.item.method === 'comment' ? (
            <>
              {' '}
              <CRow className='mb-1'>
                <CCol xl='12'>
                  <strong>Ng?????i n???p h??? s?? t??? ????nh gi??</strong>
                </CCol>
              </CRow>
            </>
          ) : (
            <>
              <CRow className='mb-1'>
                <CCol xl='12'>
                  <strong>
                    Ng?????i n???p h??? s?? ch???n m???t trong s??? c??c l???a ch???n c?? s???n
                  </strong>
                </CCol>
              </CRow>
            </>
          )}
          {prop.submitData.length > 0 ? (
            prop.item.method === 'point' ? (
              <>
                <CRow>
                  <CCol sm='2' className='py-1 d-flex align-items-center pr-0'>
                    Nh???p ??i???m:
                  </CCol>
                  <CCol md='2' className='py-1 d-flex align-items-center pl-0'>
                    <input
                      className='form-control'
                      type='number'
                      value={point}
                      onChange={(e) => {
                        // console.log("change to: " + e.target.value);
                        setPoint(e.target.value)
                        if (
                          e.target.value === '' ||
                          isNaN(e.target.value as any)
                        ) {
                          prop.cancelSubmit()
                        } else {
                          const payload = {
                            subId: subItem.id,
                            point: Number(e.target.value),
                          }
                          dispatch(updatePoint(payload))
                          prop.activateSubmit()
                        }
                      }}
                    />
                  </CCol>

                  {prop.item.evidence ? (
                    <>
                      <CCol
                        md='auto'
                        className='py-1 d-flex align-items-center'>
                        {subItem.file === '' ? (
                          'Minh ch???ng'
                        ) : (
                          <>
                            Minh ch???ng :
                            <FaCheck color={'green'} className='ml-2' /> ???? nh???n
                          </>
                        )}
                      </CCol>
                      <CCol md='4' className='py-1 d-flex align-items-center'>
                        {showAddFile ? (
                          <>
                            <label
                              htmlFor={subItem.id.toString()}
                              className='custom-file-upload'>
                              N???p File
                            </label>
                            <input
                              id={subItem.id.toString()}
                              type='file'
                              onChange={(e: any) => {
                                onFileChange(e, subItem.id)
                              }}
                            />
                          </>
                        ) : (
                          <>
                            {!isDisableReviewButton ? (
                              <CButton
                                color='info'
                                onClick={() => {
                                  prop.onShowClk(subItem.file)
                                }}
                                disabled={isDisableReviewButton}
                                className='mr-3'>
                                Xem
                              </CButton>
                            ) : (
                              <CButton
                                color='info'
                                onClick={() => {
                                  prop.onPreviewClk(subItem.file)
                                }}
                                className='mr-3'>
                                Xem l???i
                              </CButton>
                            )}
                            <CButton
                              color='info'
                              onClick={() => {
                                const payload = {
                                  subId: subItem.id,
                                  file: '',
                                }
                                dispatch(updateFile(payload))
                                setShowAddFile(true)
                              }}>
                              H???y
                            </CButton>
                          </>
                        )}
                      </CCol>{' '}
                    </>
                  ) : (
                    <></>
                  )}
                </CRow>
                {isBigFile ? (
                  <CRow>
                    <CCol
                      xl='12'
                      className='ml-0 py-1'
                      style={{ color: 'red' }}>
                      T???p tin ph???i c?? k??ch th?????c b?? h??n 1MB
                    </CCol>
                  </CRow>
                ) : (
                  <></>
                )}
                {isWrongType ? (
                  <CRow>
                    <CCol
                      xl='12'
                      className='ml-0 py-1'
                      style={{ color: 'red' }}>
                      T???p tin ph???i c?? ?????nh d???ng
                      .jpg,.jpeg,.png,.doc,.docx,.pdf,.zip
                    </CCol>
                  </CRow>
                ) : (
                  <></>
                )}
                {prop.typeOb === 'COMPETITION' && (
                  <>
                    <CRow>
                      <CCol
                        sm='2'
                        className='py-1 d-flex align-items-center pr-0'>
                        Nh???n x??t:
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol xl='12' className=''>
                        <textarea
                          rows={10}
                          className='form-control'
                          style={{
                            backgroundColor: '#e8edf2',
                          }}
                          value={studentComment}
                          onChange={(e) => {
                            setStudentComment(e.target.value)
                            const payload = {
                              subId: subItem.id,
                              studentComment: e.target.value,
                            }
                            dispatch(updateStudentComment(payload))
                          }}></textarea>
                      </CCol>
                    </CRow>
                  </>
                )}
              </>
            ) : prop.item.method === 'binary' ? (
              <>
                <CRow>
                  <CCol sm='2' className='py-1 d-flex align-items-center pr-0'>
                    ????nh gi??:
                  </CCol>
                  <CCol md='2' className='py-1 d-flex align-items-center pl-0'>
                    <input
                      type='checkbox'
                      checked={bin}
                      style={{ marginTop: '0.5vh', marginLeft: '0.5vw' }}
                      onChange={() => {
                        setBin(!bin)
                        const payload = {
                          subId: subItem.id,
                          bin: !bin,
                        }
                        dispatch(updateBin(payload))
                      }}
                    />
                    <label style={{ marginBottom: '0', marginLeft: '1vw' }}>
                      ?????t
                    </label>
                  </CCol>
                  {prop.item.evidence ? (
                    <>
                      <CCol
                        md='auto'
                        className='py-1 d-flex align-items-center'>
                        {subItem.file === '' ? (
                          'Minh ch???ng'
                        ) : (
                          <>
                            Minh ch???ng :
                            <FaCheck color={'green'} className='ml-2' /> ???? nh???n
                          </>
                        )}
                      </CCol>
                      <CCol md='4' className='py-1 d-flex align-items-center'>
                        {showAddFile ? (
                          <>
                            <label
                              htmlFor={subItem.id.toString()}
                              className='custom-file-upload'>
                              N???p File
                            </label>
                            <input
                              id={subItem.id.toString()}
                              type='file'
                              onChange={(e: any) => {
                                onFileChange(e, subItem.id)
                              }}
                            />
                          </>
                        ) : (
                          <>
                            <CCol
                              md='auto'
                              className='py-1 d-flex align-items-center'>
                              {!isDisableReviewButton ? (
                                <CButton
                                  color='info'
                                  onClick={() => {
                                    prop.onShowClk(subItem.file)
                                  }}
                                  disabled={isDisableReviewButton}
                                  className='mr-3'>
                                  Xem
                                </CButton>
                              ) : (
                                <CButton
                                  color='info'
                                  onClick={() => {
                                    prop.onPreviewClk(subItem.file)
                                  }}
                                  className='mr-3'>
                                  Xem l???i
                                </CButton>
                              )}
                            </CCol>
                            <CCol
                              md='auto'
                              className='py-1 d-flex align-items-center'>
                              <CButton
                                color='info'
                                onClick={() => {
                                  const payload = {
                                    subId: subItem.id,
                                    file: '',
                                  }
                                  dispatch(updateFile(payload))
                                  setShowAddFile(true)
                                }}>
                                H???y
                              </CButton>
                            </CCol>
                          </>
                        )}
                      </CCol>
                    </>
                  ) : (
                    <></>
                  )}
                </CRow>
                {isBigFile ? (
                  <CRow>
                    <CCol
                      xl='12'
                      className='ml-0 py-1'
                      style={{ color: 'red' }}>
                      T???p tin ph???i c?? k??ch th?????c b?? h??n 1MB
                    </CCol>
                  </CRow>
                ) : (
                  <></>
                )}
                {isWrongType ? (
                  <CRow>
                    <CCol
                      xl='12'
                      className='ml-0 py-1'
                      style={{ color: 'red' }}>
                      T???p tin ph???i c?? ?????nh d???ng
                      .jpg,.jpeg,.png,.doc,.docx,.pdf,.zip
                    </CCol>
                  </CRow>
                ) : (
                  <></>
                )}
              </>
            ) : prop.item.method === 'comment' ? (
              <CContainer>
                <CRow>
                  {prop.item.evidence ? (
                    <>
                      <CCol
                        md='auto'
                        className='py-1 px-0 pr-3 d-flex align-items-center'>
                        {subItem.file === '' ? (
                          'Minh ch???ng'
                        ) : (
                          <>
                            Minh ch???ng :{' '}
                            <FaCheck color={'green'} className='ml-2' /> ???? nh???n
                          </>
                        )}
                      </CCol>
                      <CCol
                        md='4'
                        className='py-1 px-0 d-flex align-items-center'>
                        {showAddFile ? (
                          <>
                            <label
                              htmlFor={subItem.id.toString()}
                              className='custom-file-upload'>
                              N???p File
                            </label>
                            <input
                              id={subItem.id.toString()}
                              type='file'
                              onChange={(e: any) => {
                                onFileChange(e, subItem.id)
                              }}
                            />
                          </>
                        ) : (
                          <>
                            {!isDisableReviewButton ? (
                              <CButton
                                color='info'
                                onClick={() => {
                                  prop.onShowClk(subItem.file)
                                }}
                                disabled={isDisableReviewButton}
                                className='mr-3'>
                                Xem
                              </CButton>
                            ) : (
                              <CButton
                                color='info'
                                onClick={() => {
                                  prop.onPreviewClk(subItem.file)
                                }}
                                className='mr-3'>
                                Xem l???i
                              </CButton>
                            )}
                            <CButton
                              color='info'
                              onClick={() => {
                                const payload = {
                                  subId: subItem.id,
                                  file: '',
                                }
                                dispatch(updateFile(payload))
                                setShowAddFile(true)
                              }}>
                              H???y
                            </CButton>
                          </>
                        )}
                      </CCol>{' '}
                    </>
                  ) : (
                    <></>
                  )}
                </CRow>
                {isBigFile ? (
                  <CRow>
                    <CCol
                      xl='12'
                      className='ml-0 py-1'
                      style={{ color: 'red' }}>
                      T???p tin ph???i c?? k??ch th?????c b?? h??n 1MB
                    </CCol>
                  </CRow>
                ) : (
                  <></>
                )}
                {isWrongType ? (
                  <CRow>
                    <CCol
                      xl='12'
                      className='ml-0 py-1'
                      style={{ color: 'red' }}>
                      T???p tin ph???i c?? ?????nh d???ng
                      .jpg,.jpeg,.png,.doc,.docx,.pdf,.zip
                    </CCol>
                  </CRow>
                ) : (
                  <></>
                )}

                <CRow>
                  <CCol
                    sm='2'
                    className='py-1 px-0 d-flex align-items-center pr-0'>
                    Nh???n x??t:
                  </CCol>
                </CRow>
                <CRow>
                  <CCol xl='12' className='px-0'>
                    <textarea
                      rows={10}
                      className='form-control'
                      style={{
                        backgroundColor: '#e8edf2',
                      }}
                      value={studentComment}
                      onChange={(e) => {
                        setStudentComment(e.target.value)
                        const payload = {
                          subId: subItem.id,
                          studentComment: e.target.value,
                        }
                        dispatch(updateStudentComment(payload))
                      }}></textarea>
                  </CCol>
                </CRow>
              </CContainer>
            ) : (
              <CContainer>
                <CRow>
                  <CCol
                    sm='2'
                    className='py-1 px-0 d-flex align-items-center pr-0'>
                    T??? ????nh gi??:
                  </CCol>
                  <CCol
                    md='auto'
                    className='py-1 px-0 d-flex align-items-center pr-0'>
                    <Select
                      id={subItem.id.toString() + '-select'}
                      value={
                        studentSelect !== ''
                          ? {
                              value: studentSelect,
                              label: studentSelect,
                            }
                          : null
                      }
                      options={prop.item.valueListString
                        .split(',')
                        .map((ele) => ele.trim())
                        .map((ele) => {
                          return { value: ele, label: ele }
                        })}
                      placeholder={'T??? ????nh gi??'}
                      onChange={(e: any) => {
                        const payload = {
                          subId: subItem.id,
                          studentSelect: e.value,
                        }
                        dispatch(updateStudentSelect(payload))
                        setStudentSelect(e.value)
                        //console.log(e.value);
                      }}
                    />
                  </CCol>
                  {prop.item.evidence ? (
                    <>
                      <CCol
                        md='auto'
                        className='py-1 d-flex align-items-center'>
                        {subItem.file === '' ? (
                          'Minh ch???ng'
                        ) : (
                          <>
                            Minh ch???ng :
                            <FaCheck color={'green'} className='ml-2' /> ???? nh???n
                          </>
                        )}
                      </CCol>
                      <CCol md='4' className='py-1 d-flex align-items-center'>
                        {showAddFile ? (
                          <>
                            <label
                              htmlFor={subItem.id.toString()}
                              className='custom-file-upload'>
                              N???p File
                            </label>
                            <input
                              id={subItem.id.toString()}
                              type='file'
                              onChange={(e: any) => {
                                onFileChange(e, subItem.id)
                              }}
                            />
                          </>
                        ) : (
                          <>
                            {!isDisableReviewButton ? (
                              <CButton
                                color='info'
                                onClick={() => {
                                  prop.onShowClk(subItem.file)
                                }}
                                disabled={isDisableReviewButton}
                                className='mr-3'>
                                Xem
                              </CButton>
                            ) : (
                              <CButton
                                color='info'
                                onClick={() => {
                                  prop.onPreviewClk(subItem.file)
                                }}
                                className='mr-3'>
                                Xem l???i
                              </CButton>
                            )}
                            <CButton
                              color='info'
                              onClick={() => {
                                const payload = {
                                  subId: subItem.id,
                                  file: '',
                                }
                                dispatch(updateFile(payload))
                                setShowAddFile(true)
                              }}>
                              H???y
                            </CButton>
                          </>
                        )}
                      </CCol>{' '}
                    </>
                  ) : (
                    <></>
                  )}
                </CRow>
                {isBigFile ? (
                  <CRow>
                    <CCol
                      xl='12'
                      className='ml-0 py-1'
                      style={{ color: 'red' }}>
                      T???p tin ph???i c?? k??ch th?????c b?? h??n 1MB
                    </CCol>
                  </CRow>
                ) : (
                  <></>
                )}
                {isWrongType ? (
                  <CRow>
                    <CCol
                      xl='12'
                      className='ml-0 py-1'
                      style={{ color: 'red' }}>
                      T???p tin ph???i c?? ?????nh d???ng
                      .jpg,.jpeg,.png,.doc,.docx,.pdf,.zip
                    </CCol>
                  </CRow>
                ) : (
                  <></>
                )}
              </CContainer>
            )
          ) : (
            <></>
          )}
        </CContainer>
      </CCardBody>
    </CCard>
  )
}

export default SubCrit
