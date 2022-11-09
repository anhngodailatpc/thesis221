import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CPagination,
  CRow,
  CSelect,
  CTooltip,
} from "@coreui/react";
import "moment/locale/vi";
import moment from "moment";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { useEffect, useState } from "react";
import { roles } from "../../../../common/roles";
import InputSearch from "../../../../common/InputFilterSearch";
import Spinner from "../../../../common/Spinner";
import UserApi from "../../../../api/Achievement/userApi";
import activityRegistrationApi from "../../../../api/BKAP/activityRegistration";

const fields = [
  {
    key: "stt",
    label: "STT",
    _style: { textAlign: "center" },
  },
  {
    key: "name",
    label: "Tên hoạt động",
  },
  {
    key: "registerAt",
    label: "Thời gian đăng ký",
    sorter: false,
    filter: false,
    _style: { textAlign: "center" },
  },
  {
    key: "activityAt",
    label: "Thời gian hoạt động",
    sorter: false,
    filter: false,
    _style: { textAlign: "center" },
  },
  {
    key: "registered",
    label: "Đã đăng ký",
    sorter: false,
    filter: false,
    _style: { textAlign: "center" },
  },
  {
    key: "maximumCTXH",
    label: "Số chỉ tiêu tối đa",
    sorter: false,
    filter: false,
    _style: { textAlign: "center" },
  },
  {
    key: "department",
    label: "Đơn vị tổ chức",
    sorter: false,
    filter: false,
    _style: { textAlign: "center" },
  },
  {
    key: "action",
    label: "Kết quả",
    _style: { textAlign: "center" },
    sorter: false,
    filter: false,
  },
];

interface Filters {
  limit: number;
  page: number;
  search: string;
}

function History(props: any) {
  const history = useHistory();
  const user = useSelector((state: RootState) => state.user);
  const isSpinner = useSelector((state: RootState) => state.spinner);
  const [count, setCount] = useState(1);
  const [data, setData] = useState<any[]>([]);
  const [filters, setFilters] = useState<Filters>({
    limit: 10,
    page: 1,
    search: "",
  });

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await UserApi.verifyLogin();
      } catch {
        history.push("/login");
      }
    };
    async function getActivity() {
      try {
        const { data, count } = await activityRegistrationApi.getUserHistory(
          filters,
          user.id.toString()
        );
        setCount(count);
        setData(data);
      } catch (error) {
        console.error(error);
      }
    }
    verifyLogin();
    getActivity();
  }, [filters, count, history, user.id]);

  const handleChangeSearch = (formValue: { text: string }) => {
    setFilters({
      ...filters,
      page: 1,
      search: formValue.text,
    });
  };

  const handleRegister = async (id: string, status: string) => {
    try {
      await activityRegistrationApi.updateRegistration(status, id);
      setData(
        data.map((item) => {
          if (item.id === id)
            return {
              ...item,
              numberRegistered: item.numberRegistered + 1,
              statusRegistration: status,
            };
          return item;
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = async (id: string, status: string) => {
    try {
      await activityRegistrationApi.updateRegistration(status, id);
      setData(
        data.map((item) => {
          if (item.id === id)
            return {
              ...item,
              numberRegistered: item.numberRegistered - 1,
              statusRegistration: status,
            };
          return item;
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (isSpinner) return <Spinner />;
  return (
    <>
      <CCard>
        <CCardHeader>
          <strong>LỊCH SỬ ĐĂNG KÍ</strong>
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-2">
            <CCol sm="4" className="d-flex align-items-center">
              <CTooltip content={`Tên hoạt động`}>
                <CIcon className="mr-1" size="lg" content={freeSet.cilFilter} />
              </CTooltip>
              <InputSearch onSubmit={handleChangeSearch} />
            </CCol>
            <CCol
              sm="8"
              className="d-flex justify-content-end align-items-center"
            >
              <div>Số lượng/ trang:</div>
              <CSelect
                defaultValue={"10"}
                style={{ width: "70px", float: "right", margin: "0 10px" }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFilters({ ...filters, limit: +e.currentTarget.value })
                }
              >
                <option value="5">5</option>
                <option value="10" selected>
                  10
                </option>
                <option value="20">20</option>
                <option value="50">50</option>
              </CSelect>
            </CCol>
          </CRow>
          <CDataTable
            items={data}
            fields={fields}
            hover
            noItemsView={{
              noResults: "Không có kết quả tìm kiếm",
              noItems: "Không có dữ liệu",
            }}
            scopedSlots={{
              stt: (item: any, index: number) => {
                return (
                  <td className="align-middle text-center">{index + 1}</td>
                );
              },
              name: (item: any) => {
                return <td className="align-middle">{item.name}</td>;
              },
              registerAt: (item: any) => {
                return (
                  <td className="align-middle text-center">
                    {moment(item.registerStartDay).format("DD/MM/YYYY")} -
                    {moment(item.registerEndDay).format("DD/MM/YYYY")}
                  </td>
                );
              },
              activityAt: (item: any) => {
                return (
                  <td className="align-middle text-center">
                    {moment(item.startDay).format("DD/MM/YYYY")} -
                    {moment(item.endDay).format("DD/MM/YYYY")}
                  </td>
                );
              },
              registered: (item: any) => {
                return (
                  <td className="align-middle text-center">
                    {item.numberRegisteredSuccess}/{item.maximumParticipant}
                  </td>
                );
              },
              maximumCTXH: (item: any) => {
                return (
                  <td className="align-middle text-center">
                    {item.maximumCTXH}
                  </td>
                );
              },
              department: (item: any) => {
                return (
                  <td className='align-middle text-center'>{item.creation}</td>
                )
              },
              action: (item: any) => {
                return (
                  <td className="align-middle text-center">
                    {item.statusRegistration === "PASS" && "Thành công"}
                    {["CANCEL", ""].includes(item.statusRegistration) && (
                      <CButton
                        size="sm"
                        color="info"
                        onClick={() => handleRegister(item.id, "REGISTERED")}
                      >
                        Đăng ký
                      </CButton>
                    )}
                    {item.statusRegistration === "REGISTERED" && (
                      <CButton
                        size="sm"
                        color="danger"
                        onClick={() => handleCancel(item.id, "CANCEL")}
                      >
                        Hủy
                      </CButton>
                    )}
                  </td>
                );
              },
            }}
          ></CDataTable>
          <div className={"mt-2 d-flex justify-content-center"}>
            <CPagination
              activePage={filters.page}
              className="align-middle text-center"
              pages={Math.ceil(count / filters.limit)}
              onActivePageChange={(i: number) =>
                setFilters({ ...filters, page: i })
              }
            ></CPagination>
          </div>
        </CCardBody>
      </CCard>
    </>
  );
}

export default History;
