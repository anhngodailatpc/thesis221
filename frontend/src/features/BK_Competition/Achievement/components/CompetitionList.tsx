import { useState } from 'react'
import { CBadge, CButton, CDataTable, CTooltip } from '@coreui/react'
import Achievement from '../../../../types/Achievement'
import achievementApi from '../../../../api/Achievement/achievementApi'
import Moment from 'react-moment'
import 'moment/locale/vi'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../store'
import { roles } from '../../../../common/roles'
import ErrorModelWithAText from '../../../../common/CommonErrorWithALineOfText'

function CompetitionList(props: any) {
  const {
    competitionList,
    handleCompetitionUpdate,
    handleCompetitionDelete,
    // handleChangeSearch,
  } = props
  const history = useHistory()
  const user = useSelector((state: RootState) => state.user)
  const [errMsg, setErrMsg] = useState('')
  const [showErrModel, setShowErrModel] = useState(false)
  const customAchievementList = competitionList.map((item: Achievement) => {
    const start = moment(item.startAt)
    const now = moment()
    const end = moment(item.endAt)
    let contentStatus = 'Đang tiến hành'
    if (now.diff(end, 'hours') > 0) {
      contentStatus = 'Đã kết thúc'
    } else if (now.diff(start, 'hours') < 0) {
      contentStatus = 'Trạng thái chờ'
    }
    return {
      ...item,
      auditorFinalId: item?.auditorFinal?.id || -999,
      auditorsListId: item?.auditors?.map((auditor) => auditor.id) || [],
      status: contentStatus,
    }
  })

  const fields = [
    {
      key: 'stt',
      label: 'STT',
      _style: { textAlign: 'center' },
    },
    {
      key: 'name',
      label: 'Tên Thi Đua',
      _style: { textAlign: 'center' },
    },
    {
      key: 'startAt',
      label: 'Thời gian bắt đầu',
      sorter: false,
      filter: false,
      _style: { width: '14%', textAlign: 'center' },
    },
    {
      key: 'deadlineAt',
      label: 'Thời gian hết hạn',
      sorter: false,
      filter: false,
      _style: { width: '14%', textAlign: 'center' },
    },
    {
      key: 'updatedAt',
      label: 'Cập nhật lần cuối',
      sorter: false,
      filter: false,
      _style: { textAlign: 'center' },
    },
    {
      key: 'status',
      label: 'Trạng thái',
      _style: { width: '10%', textAlign: 'center' },
    },
    {
      key: 'action',
      label: 'Thao tác',
      _style: { textAlign: 'center' },
      sorter: false,
      filter: false,
    },
  ]

  const handlePushAuditor = async (id: number = 0) => {
    try {
      const response = await achievementApi.getStatus(id)
      switch (response?.status) {
        case '':
          history.push(`/danh-sach-nop-ho-so/${id}`)
          break
        case 'unavailable':
          setErrMsg('Phân công hội đồng xét duyệt chưa kết thúc')
          setShowErrModel(true)
          break
        case 'temporary':
          setErrMsg('Chủ tịch hội đồng đang thẩm định, vui lòng quay lại sau')
          setShowErrModel(true)
          break
        case 'forever':
          setErrMsg('Chủ tịch hội đồng đã kết thúc thẩm định cho danh hiệu')
          setShowErrModel(true)
          break

        default:
          setErrMsg('Đã có lỗi xảy ra')
          setShowErrModel(true)
          break
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <CDataTable
        items={customAchievementList}
        fields={fields}
        hover
        noItemsView={{
          noResults: 'Không có kết quả tìm kiếm',
          noItems: 'Không có dữ liệu',
        }}
        scopedSlots={{
          stt: (item: Achievement, index: number) => {
            return <td className='align-middle text-center'>{index + 1}</td>
          },
          name: (item: Achievement) => {
            return (
              <td className='align-middle'>
                <div> {item.name} </div>
                {roles.MANAGER.includes(user.role) && (
                  <CTooltip content='Cập nhật thông tin thi đua'>
                    <CButton
                      size='sm'
                      color='info'
                      className='ml-1 mt-1'
                      onClick={() => handleCompetitionUpdate(item)}>
                      <CIcon size='sm' content={freeSet.cilSettings} />
                    </CButton>
                  </CTooltip>
                )}
              </td>
            )
          },
          startAt: (item: Achievement) => {
            return (
              <td className='align-middle text-center'>
                {moment(item.startAt).format('DD/MM/YYYY')}
              </td>
            )
          },
          deadlineAt: (item: Achievement) => {
            return (
              <td className='align-middle text-center'>
                {moment(item.endAt).format('DD/MM/YYYY')}
              </td>
            )
          },
          updatedAt: (item: Achievement) => {
            return (
              <td className='align-middle text-center'>
                <Moment fromNow local locale='vi'>
                  {item.updatedAt}
                </Moment>
              </td>
            )
          },
          status: (item: any) => {
            const content = item.status
            let color = 'danger'
            if (content === 'Đã kết thúc') {
              color = 'secondary'
            } else if (content === 'Trạng thái chờ') {
              color = 'warning'
            }
            return (
              <td className='align-middle text-center'>
                <CBadge color={color}>{content}</CBadge>
              </td>
            )
          },
          action: (item: any) => {
            return (
              <>
                <td className='d-flex justify-content-start'>
                  <>
                    {roles.MANAGER.includes(user.role) &&
                      item.status === 'Trạng thái chờ' && (
                        <>
                          <CTooltip content='Cập nhật thông tin Thi đua'>
                            <CButton
                              size='sm'
                              color='info'
                              className='ml-1 mt-1'
                              onClick={() => handleCompetitionUpdate(item)}>
                              <CIcon size='sm' content={freeSet.cilSettings} />
                            </CButton>
                          </CTooltip>
                          <CTooltip content='Quản lý tiêu chí'>
                            <CButton
                              size='sm'
                              color='warning'
                              className='ml-1 mt-1'
                              onClick={() => {
                                history.push(`/quan-ly-tieu-chi/${item.id}`)
                              }}>
                              <CIcon size='sm' content={freeSet.cilAlignLeft} />
                            </CButton>
                          </CTooltip>
                          <CTooltip content='Xóa Thi đua'>
                            <CButton
                              size='sm'
                              color='danger'
                              className='ml-1 mt-1'
                              onClick={() => handleCompetitionDelete(item)}>
                              <CIcon size='sm' content={freeSet.cilTrash} />
                            </CButton>
                          </CTooltip>
                        </>
                      )}
                    {item.status === 'Đã kết thúc' && (
                      <>
                        {roles.MANAGER.includes(user.role) && (
                          <CTooltip content='Quản lý hội đồng xét duyệt'>
                            <CButton
                              size='sm'
                              color='info'
                              className='ml-1 mt-1'
                              onClick={() => {
                                history.push(
                                  `/quan-ly-hoi-dong-xet-duyet/${item.id}`
                                )
                              }}>
                              <CIcon size='sm' content={freeSet.cilUser} />
                            </CButton>
                          </CTooltip>
                        )}
                        {roles.MANAGER.includes(user.role) &&
                          item.lock === 'forever' && (
                            <CTooltip content='Tổng kết Thi đua'>
                              <CButton
                                size='sm'
                                color='warning'
                                className='ml-1 mt-1'
                                onClick={() => {
                                  history.push(`/tong-ket/${item.id}`)
                                }}>
                                <CIcon
                                  size='sm'
                                  content={freeSet.cilBarChart}
                                />
                              </CButton>
                            </CTooltip>
                          )}
                        {/* {[roles.MANAGER, roles.PARTICIPANT].includes(
                          user.role
                        ) &&
                          [
                            item.auditorFinalId,
                            ...item.auditorsListId,
                          ].includes(user.id) && (
                            <CTooltip content="Duyệt hồ sơ">
                              <CButton
                                size="sm"
                                color="info"
                                className="ml-1 mt-1"
                                onClick={() => handlePushAuditor(item.id)}
                              >
                                <CIcon
                                  size="sm"
                                  content={freeSet.cilColorBorder}
                                />
                              </CButton>
                            </CTooltip>
                          )} */}
                        {(roles.MANAGER === user.role ||
                          (roles.PARTICIPANT === user.role &&
                            [
                              item.auditorFinalId,
                              ...item.auditorsListId,
                            ].includes(user.id))) && (
                          <>
                            <CTooltip content='Danh sách người dùng nộp hồ sơ'>
                              <CButton
                                size='sm'
                                color='info'
                                className='ml-1 mt-1'
                                onClick={() => handlePushAuditor(item.id)}>
                                <CIcon
                                  size='sm'
                                  content={freeSet.cilDescription}
                                />
                              </CButton>
                            </CTooltip>
                          </>
                        )}
                      </>
                    )}
                    {[roles.MANAGER, roles.PARTICIPANT].includes(user.role) &&
                      item.status === 'Đang tiến hành' && (
                        <>
                          {roles.MANAGER.includes(user.role) && (
                            <>
                              <CTooltip content='Danh sách người dùng nộp hồ sơ'>
                                <CButton
                                  size='sm'
                                  color='info'
                                  className='ml-1 mt-1'
                                  onClick={() => {
                                    history.push(
                                      `/danh-sach-nop-ho-so/${item.id}`
                                    )
                                  }}>
                                  <CIcon
                                    size='sm'
                                    content={freeSet.cilDescription}
                                  />
                                </CButton>
                              </CTooltip>
                            </>
                          )}
                          {(roles.MANAGER === user.role ||
                            (roles.PARTICIPANT === user.role &&
                              [
                                item.auditorFinalId,
                                ...item.auditorsListId,
                              ].includes(user.id))) && (
                            <CTooltip content='Danh sách chi tiết hồ sơ'>
                              <CButton
                                size='sm'
                                color='info'
                                className='ml-1 mt-1'
                                onClick={() =>
                                  history.push(`/chi-tiet-ho-so/${item.id}`)
                                }>
                                <CIcon
                                  size='sm'
                                  content={freeSet.cilSpreadsheet}
                                />
                              </CButton>
                            </CTooltip>
                          )}
                        </>
                      )}
                  </>
                </td>
              </>
            )
          },
        }}></CDataTable>
      {showErrModel ? (
        <ErrorModelWithAText
          message={errMsg}
          show={true}
          modelClose={() => {
            setErrMsg('')
            setShowErrModel(false)
          }}
        />
      ) : (
        <></>
      )}
    </>
  )
}

export default CompetitionList
