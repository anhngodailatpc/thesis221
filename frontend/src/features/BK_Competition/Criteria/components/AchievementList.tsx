import { useState } from "react";
import { CDataTable } from "@coreui/react";
import Achievement from "../../../../types/Achievement";
import "moment/locale/vi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import critApi from "../../../../api/Achievement/critApi";
import { fetchCrit } from "../../../../redux/TieuChi";
import { DoiTrangThayDen } from "../../../../utils/critArrayHandler";

function AchievementList(prop: { data: Achievement[]; closeList: () => void }) {
  const user = useSelector((state: RootState) => state.user);
  const customAchievementList = prop.data;
  const fields = [
    {
      key: "name",
      label: "Tên Hồ sơ",
      _style: { textAlign: "left" },
    },
  ];
  const dispatch = useDispatch();
  const handleSelect = async (id: string) => {
    const data = await critApi.getAll(id);
    DoiTrangThayDen(data, parseInt(id));
    dispatch(fetchCrit(data));
    prop.closeList();
  };
  return (
    <>
      <CDataTable
        items={customAchievementList}
        fields={fields}
        hover
        noItemsView={{
          noResults: "Không có kết quả tìm kiếm",
          noItems: "Không có dữ liệu",
        }}
        scopedSlots={{
          name: (item: Achievement) => {
            return (
              <td
                className="align-middle"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  if (item.id !== undefined) {
                    handleSelect(item.id.toString());
                  }
                }}
              >
                <div> {item.name} </div>
              </td>
            );
          },
        }}
      ></CDataTable>
    </>
  );
}

export default AchievementList;
