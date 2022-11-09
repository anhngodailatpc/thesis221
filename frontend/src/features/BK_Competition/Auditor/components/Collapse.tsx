import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCollapse,
  CFormGroup,
  CInputCheckbox,
  CLabel,
  CDataTable,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CTextarea,
  CModalFooter,
} from '@coreui/react'
import React, { useEffect, useState, useCallback, memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AuditorApi from '../../../../api/Achievement/auditorApi'
import { updateCriteria } from '../../../../redux/auditor'
import { MapInteractionCSS } from 'react-map-interaction'
import { extname } from 'path'
import { RootState } from '../../../../store'
import submissionApi from '../../../../api/Achievement/submissionApi'
import PdfViewer from '../../../../common/PdfPreview'

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

const styleHeader = {
  // backgroundColor: '#dbd9d9',
}

const Collapse = (props: any) => {
  const {
    data,
    dataTotal,
    getChildren,
    examerId,
    disabled,
    isFinal,
    achievementId,
    seen,
  } = props
  const [collapse, setCollapse] = useState(true)
  // const auditor = useSelector((state: RootState) => state.auditor)
  const user = useSelector((state: RootState) => state.user)
  const [isChecked, setIsChecked] = useState(false)
  const [stPdfFile, setStPdfFile] = useState<any>('')
  const [pdfShow, setPdfShow] = useState(false)
  // const [fileNotSupported, setFileNotSupported] = useState(false)
  const [textDescription, setTextDescription] = useState<string>('')
  const [isDescription, setIsDescription] = useState<boolean>(false)
  const [isEvidence, setIsEvidence] = useState<boolean>(false)
  const [pathImage, setPathImage] = useState<string>('')
  const [isResult, setIsResult] = useState<boolean>(false)
  const [result, setResult] = useState()

  useEffect(() => {
    setIsChecked(data.result)
    if (data.isCriteria) setTextDescription(data.description)
  }, [data.result, data.isCriteria, data.description])
  const dispatch = useDispatch()

  const handleResult = async () => {
    try {
      const response = await AuditorApi.getResultSubmission(data.id)
      setResult(response)
      setIsResult(true)
    } catch (error) {
      console.error(error)
    }
  }

  const handleCloseDescription = () => {
    setIsDescription(false)
  }

  const pdfViewClose = () => {
    setPdfShow(false)
    setStPdfFile('')
  }

  const handleChangeDescription = (id: string, description: string) => {
    dispatch(
      updateCriteria({
        examerId,
        criteria: {
          id,
          description,
        },
      })
    )
    setIsDescription(false)
  }

  const handleCloseImage = () => setIsEvidence(false)

  const getEvidence = async () => {
    try {
      const fileResult = await submissionApi.downloadFile(
        examerId,
        achievementId,
        data.file
      )
      const fileExtName = extname(data.file)
      if (fileResult !== undefined) {
        if (data.file.match(/\.(jpg|jpeg|png)$/)) {
          const imageType = fileExtName in ['jpg', 'jpeg'] ? 'jpeg' : 'png'
          const imageFile = new Blob([fileResult?.resultBlob], {
            type: `image/${imageType}`,
          })
          const fileURL = URL.createObjectURL(imageFile)
          setIsEvidence(true)
          setPathImage(fileURL)
        } else if (data.file.match(/\.(pdf)$/)) {
          const pdfFile = new Blob([fileResult?.resultBlob], {
            type: 'application/pdf',
          })
          const fileURL = URL.createObjectURL(pdfFile)
          setStPdfFile(fileURL)
          setPdfShow(true)
        } else if (data.file.match(/\.(docx|doc)$/)) {
          const link = document.createElement('a')
          link.href = fileResult.resultUrl
          link.setAttribute('download', data.file)
          document.body.appendChild(link)
          link.click()
        } else if (data.file.match(/\.(zip)$/)) {
          const link = document.createElement('a')
          link.href = fileResult.resultUrl
          link.setAttribute('download', `${user.mssv}-preview.${fileExtName}`)
          document.body.appendChild(link)
          link.click()
        } else {
          setIsEvidence(true)
          setPathImage('')
        }
      } else {
      }
    } catch (error: any) {
      console.log(error.message)
    }
  }

  const showCollapse = useCallback(() => {
    setCollapse(!collapse)
  }, [collapse])

  return (
    <>
      {data.isCriteria ? (
        <>
          <CCard style={well}>
            <CCardHeader color='light'>
              {data.nameCriteria}
              {seen || (
                <div className='card-header-actions'>
                  <CFormGroup
                    variant='checkbox'
                    className='float-right checkbox'>
                    <CInputCheckbox
                      id={data.id}
                      checked={disabled ? data.result : isChecked}
                      disabled={disabled}
                      onChange={(e) => {
                        setIsChecked(e.currentTarget.checked)
                        dispatch(
                          updateCriteria({
                            examerId,
                            criteria: {
                              id: data.id,
                              result: e.currentTarget.checked,
                            },
                          })
                        )
                      }}
                    />
                    <CLabel
                      variant='checkbox'
                      className='form-check-label'
                      htmlFor={data.id}>
                      Xác nhận
                    </CLabel>
                  </CFormGroup>
                </div>
              )}
            </CCardHeader>
            <CCardBody>
              {data.content && (
                <>
                  <strong>Nội dung :</strong>
                  {data.content}
                  <br />
                </>
              )}
              {data.note && (
                <>
                  <strong> Ghi chú :</strong>
                  {data.note}
                  <br />
                </>
              )}

              <strong> Người đăng ký tự đánh giá: </strong>
              {data.method === 'binary' ? (
                `${data.binary ? 'Đạt' : 'Không đạt'}`
              ) : data.method === 'point' ? (
                `${data.point}`
              ) : data.method === 'comment' ? (
                <CTextarea disabled value={data.studentComment} />
              ) : (
                <CTextarea disabled value={data.studentSelect} />
              )}
              <br />
              {data.evidence && `(Yêu cầu nộp minh chứng)`}
            </CCardBody>
            {disabled ? undefined : (
              <CCardFooter>
                {seen || (
                  <CButton
                    color='secondary'
                    onClick={() => setIsDescription(true)}
                    className={'mb-1 float-right'}>
                    Nhận xét
                  </CButton>
                )}
                {isFinal ? (
                  <CButton
                    color='secondary'
                    onClick={handleResult}
                    className={'mb-1 mr-1 float-right'}>
                    Kết quả
                  </CButton>
                ) : undefined}
                {data.evidence && data.file !== '' && (
                  <CButton
                    color='secondary'
                    onClick={getEvidence}
                    className={'mb-1 mr-1 float-right'}>
                    Xem minh chứng
                  </CButton>
                )}
              </CCardFooter>
            )}
          </CCard>
          <CModal
            show={isEvidence}
            className='mt-5'
            size='xl'
            onClose={handleCloseImage}
            color='info'>
            <CModalHeader closeButton>
              <CModalTitle>Xem minh chứng</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {pathImage === '' ? (
                'Người dùng không nộp minh chứng'
              ) : (
                <MapInteractionCSS>
                  <img width={600} src={pathImage} alt='ảnh bị lỗi' />
                </MapInteractionCSS>
              )}
            </CModalBody>
          </CModal>
          <CModal
            show={isDescription}
            className='mt-5'
            size='lg'
            onClose={handleCloseDescription}
            color='info'>
            <CModalHeader closeButton>
              <CModalTitle>Thêm nhận xét</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CTextarea
                name='description'
                id='description'
                value={textDescription}
                onChange={(event: any) => {
                  const review = event.currentTarget.value
                  setTextDescription(review)
                }}
                placeholder={`Thêm mô tả cho ${data.nameCriteria}`}
              />
            </CModalBody>
            <CModalFooter>
              <CButton
                color='info'
                onClick={() =>
                  handleChangeDescription(data.id, textDescription)
                }>
                Xác nhận
              </CButton>
            </CModalFooter>
          </CModal>
          <CModal
            show={isResult}
            className='mt-5'
            size='lg'
            onClose={() => setIsResult(false)}
            color='info'>
            <CModalHeader closeButton>
              <CModalTitle>Xem kết quả người duyệt</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CDataTable
                items={result}
                fields={fields}
                noItemsView={{
                  noResults: 'Không có kết quả tìm kiếm',
                  noItems: 'Người duyệt chưa chấm',
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
            </CModalBody>
          </CModal>
        </>
      ) : (
        <CCard>
          <CCardHeader
            color='secondary'
            className='headerCollapse'
            style={styleHeader}
            onClick={showCollapse}>
            {data.nameCriteria}
          </CCardHeader>
          <CCollapse show={collapse}>
            <CCardBody>
              {data.soft ? (
                <div className='mb-2'>
                  Yêu cầu đạt <b>{data.soft}</b> trong các tiêu chí sau
                </div>
              ) : (
                <div className='mb-2'>
                  Yêu cầu đạt được <b>tất cả</b> các tiêu chí
                </div>
              )}

              {getChildren(dataTotal, data).map((child: any) => (
                <Collapse
                  key={child.id}
                  data={child}
                  isFinal={isFinal}
                  achievementId={achievementId}
                  examerId={examerId}
                  seen={seen}
                  dataTotal={dataTotal}
                  disabled={disabled}
                  getChildren={getChildren}
                />
              ))}
            </CCardBody>
          </CCollapse>
        </CCard>
      )}
      {pdfShow ? (
        <PdfViewer file={stPdfFile} show={true} pdfViewClose={pdfViewClose} />
      ) : (
        <></>
      )}
    </>
  )
}

export default memo(Collapse)
