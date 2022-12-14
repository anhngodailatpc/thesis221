import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CPagination,
  CRow,
  CSelect,
  CTooltip,
} from "@coreui/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import CourseList from "../components/CompetitionList";
import achievementApi from "../../../../api/Achievement/achievementApi";
import Achievement from "../../../../types/Achievement";
import { CompetitionAdd } from "../components/CompetitionAdd";
import { CompetitionEdit } from "../components/CompetitionEdit";
import { CompetitionDelete } from "../components/CompetitionDelete";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { roles } from "../../../../common/roles";

import InputSearch from "../../../../common/InputFilterSearch";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";
import UserApi from "../../../../api/Achievement/userApi";

interface Filters {
  limit: number;
  page: number;
  search: string;
}

function CompetitionPage() {
  const [achievementList, setAchievementList] = useState<Achievement[]>([]);
  const [achievement, setAchievement] = useState<Achievement>({
    id: 0,
    name: "",
    description: "",
    startAt: new Date(),
    endAt: new Date(),
  });
  const [isModalAdd, setIsModalAdd] = useState<boolean>(false);
  const [isModalEdit, setIsModalEdit] = useState<boolean>(false);
  const [isModalDelete, setIsModalDelete] = useState<boolean>(false);
  const history = useHistory();
  const user = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();
  const [filters, setFilters] = useState<Filters>({
    limit: 10,
    page: 1,
    search: "",
  });
  const [count, setCount] = useState(1);
  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await UserApi.verifyLogin();
      } catch {
        history.push("/login");
      }
    };
    const fetchAchievementList = async () => {
      try {
        const { data, count } = await achievementApi.getAllWithFilter(
          filters,
          true,
          'COMPETITION'
        );
        setAchievementList(data);
        setCount(count);
      } catch (error: any) {
        if (error?.response?.status !== 401) {
          console.error(error);
          history.push("/loi-truy-cap");
        }
        // if (user.id !== 0)
        // history.push("/loi-truy-cap");
      }
    };
    if ([roles.MANAGER, roles.PARTICIPANT].includes(user.role)) {
      fetchAchievementList();
    } else {
      verifyLogin();
      if (user.id !== 0) {
        history.push("/loi-truy-cap");
      }
    }
  }, [history, dispatch, filters, user.role, user.id]);

  const handleCourseUpdate = (item: Achievement) => {
    setIsModalEdit(true);
    setAchievement(item);
  };

  const handleCourseDelete = (item: Achievement) => {
    setIsModalDelete(true);
    setAchievement(item);
  };

  const handleAdd = (item: Achievement) => {
    setAchievementList([item, ...achievementList]);
    setIsModalAdd(false);
  };
  const handleEdit = (oldId: number, newAchievement: Achievement) => {
    const index = achievementList.findIndex((item) => item.id === oldId);
    setAchievementList([
      ...achievementList.slice(0, index),
      newAchievement,
      ...achievementList.slice(index + 1),
    ]);
    setIsModalEdit(false);
  };
  const handleDelete = (id: number) => {
    const achievements = achievementList.filter((item) => item.id !== id);
    setAchievementList([...achievements]);
    setIsModalDelete(false);
  };

  const handleChangeSearch = (formValue: { text: string }) => {
    setFilters({
      ...filters,
      page: 1,
      search: formValue.text,
    });
  };

  return (
    <CRow>
      <>
        {" "}
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <strong>DANH S??CH C??C THI ??UA</strong>
            </CCardHeader>
            <CRow>
              <CCol xs={12}></CCol>
              <CCol xs={12}></CCol>
            </CRow>
            <CCardBody>
              <CRow className="mb-2">
                <CCol sm="4" className="d-flex align-items-center">
                  <CTooltip content={`T??n thi ??ua`}>
                    <CIcon
                      className="mr-1"
                      size="lg"
                      content={freeSet.cilFilter}
                    />
                  </CTooltip>
                  <InputSearch onSubmit={handleChangeSearch} />
                </CCol>
                <CCol sm="3"></CCol>
                <CCol
                  sm="5"
                  className="d-flex justify-content-end align-items-center"
                >
                  <div>S??? l?????ng/ trang:</div>
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
                  {["admin", "manager"].includes(user.role) && (
                    <CButton
                      color="info"
                      size=""
                      onClick={() => setIsModalAdd(true)}
                      className="align-middle justify-content-center"
                    >
                      Th??m
                    </CButton>
                  )}
                </CCol>
                <CCol sm="4"></CCol>
              </CRow>

              <CourseList
                competitionList={achievementList}
                handleCompetitionUpdate={handleCourseUpdate}
                handleCompetitionDelete={handleCourseDelete}
                handleChangeSearch={handleChangeSearch}
              ></CourseList>
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
        </CCol>
        {roles.MANAGER.includes(user.role) && (
          <>
            <CompetitionEdit
              item={achievement}
              isOpen={isModalEdit}
              btnSubmit="S???a"
              colorBtnSubmit="info"
              handleClose={() => setIsModalEdit(false)}
              title="Ch???nh s???a H??? s??"
              handleSubmit={handleEdit}
            />
            <CompetitionDelete
              item={achievement}
              isOpen={isModalDelete}
              btnSubmit="X??a"
              colorBtnSubmit="danger"
              handleClose={() => setIsModalDelete(false)}
              title="X??a H??? s??"
              handleSubmit={handleDelete}
            />
            <CompetitionAdd
              isOpen={isModalAdd}
              btnSubmit="Th??m"
              colorBtnSubmit="info"
              handleClose={() => setIsModalAdd(false)}
              title="Th??m H??? s??"
              handleSubmit={handleAdd}
            />
          </>
        )}
      </>
    </CRow>
  );
}

export default CompetitionPage;
