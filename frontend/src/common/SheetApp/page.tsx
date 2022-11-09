import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CDataTable,
} from "@coreui/react";

import Moment from "react-moment";
import "moment/locale/vi";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useState } from "react";
import { roles } from "../roles";

const fields = [
  {
    key: "codeDepartment",
    label: "Mã Phòng/Ban",
    _style: { textAlign: "center" },
  },
  {
    key: "name",
    label: "Tên Phòng/Ban",
    sorter: false,
    filter: false,
    _style: { textAlign: "center" },
  },
  {
    key: "nameClass",
    label: "Tên Ban",
    sorter: false,
    filter: false,
    _style: { textAlign: "center" },
  },
  {
    key: "action",
    label: "Thao tác",
    _style: { textAlign: "center" },
    sorter: false,
    filter: false,
  },
];

function Page(props: any) {
  // const { achievementList, handleCourseUpdate, handleCourseDelete } = props
  const history = useHistory();
  const user = useSelector((state: RootState) => state.user);
  const [data, setData] = useState([
    {
      codeDepartment: "abc",
      name: "abc",
      nameClass: "abc",
    },
  ]);

  const handleDepartmentUpdate = (item: any) => {};
  const handleDepartmentDelete = (item: any) => {};

  const sty = {
    cursor: "pointer",
    hover: { color: "red" },
  };
  return (
    <>
      <CCard>
        <CCardHeader>Quản lý đơn vị</CCardHeader>
        <CCardBody>
          <CDataTable
            items={data}
            fields={fields}
            hover
            noItemsView={{
              noResults: "Không có kết quả tìm kiếm",
              noItems: "Không có dữ liệu",
            }}
            scopedSlots={{
              codeDepartment: (item: any) => {
                return (
                  <td className="align-middle text-center">
                    <div style={sty}> {item.name} </div>
                  </td>
                );
              },
              name: (item: any) => {
                return (
                  <td className="align-middle text-center">
                    {moment(item.startAt).format("DD/MM/YYYY")}
                  </td>
                );
              },
              nameClass: (item: any) => {
                return (
                  <td className="align-middle text-center">
                    {moment(item.endAt).format("DD/MM/YYYY")}
                  </td>
                );
              },

              action: (item: any) => {
                return (
                  <>
                    {roles.MANAGER.includes(user.role) && (
                      <>
                        <td className="text-center">
                          <CButton
                            size="sm"
                            color="info"
                            className="ml-1 mt-1"
                            onClick={() => handleDepartmentUpdate(item)}
                          >
                            <CIcon size="sm" content={freeSet.cilSettings} />
                          </CButton>
                          <CButton
                            size="sm"
                            color="danger"
                            className="ml-1 mt-1"
                            onClick={() => handleDepartmentDelete(item)}
                          >
                            <CIcon size="sm" content={freeSet.cilTrash} />
                          </CButton>
                        </td>
                      </>
                    )}
                  </>
                );
              },
            }}
          ></CDataTable>
        </CCardBody>
      </CCard>
    </>
  );
}

export default Page;
