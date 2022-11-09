import { CForm, CButton, CModalHeader, CModalTitle } from "@coreui/react";
import { useState } from "react";
import { Criteria } from "../../../../types/TieuChi";
import { useDispatch, useSelector } from "react-redux";
import { isNameExist } from "../../../../utils/critArrayHandler";
import { RootState } from "../../../../store";

const AddForm = (prop: {
  achievementId: string;
  item?: Criteria;
  id: number;
  onClose: () => void;
}) => {
  const data = useSelector((state: RootState) => state.tieuchi.list);
  const [name, setName] = useState("");
  const [des, setDes] = useState("");
  const [typeTC, setTypeTC] = useState("0");
  const [hard, setHard] = useState("hard");
  const [point, setPoint] = useState("0");
  const [sign, setSign] = useState(">");
  //state for handling eror
  const [nameError, setNameError] = useState("");
  const [pointError, setPointError] = useState("");
  //
  const validateForm = (): boolean => {
    let result = true;
    if (name === "") {
      setNameError("Tên không được để trống");
      result = false;
    }
    if (isNameExist(name, data)) {
      setNameError("Tên đã tồn tại");
      result = false;
    }
    if (isNaN(point as any)) {
      setPointError("Vui lòng nhập số hợp lệ");
      result = false;
    }
    if (point === "") {
      setPointError("Vui lòng nhập số hợp lệ");
      result = false;
    }
    return result;
  };
  const dispatch = useDispatch();
  const AddCrit = () => {
    /*
    if (window.confirm("Bạn có chắc mình muốn thêm tiêu chí này không?")) {
      if (validateForm()) {
        if (typeTC == "1") {
          let payload = {
            parentId: prop.id,
            item: {
              id: Math.floor(Math.random() * 1000000),
              name: name,
              type: hard,
              sign1: sign,
              point1: parseInt(point),
              sign2: "=",
              point2: 0,
              soft: 0,
              description: des,
              createdAt: new Date(),
              updatedAt: new Date(),
              children: [],
            },
          };
          dispatch(add(prop.achievementId, payload));
        } else if (typeTC == "2") {
          let payload = {
            parentId: prop.id,
            item: {
              id: Math.floor(Math.random() * 1000000),
              name: name,
              type: hard,
              sign1: "=",
              point1: 0,
              sign2: "=",
              point2: 0,
              soft: 0,
              description: des,
              createdAt: new Date(),
              updatedAt: new Date(),
              children: [],
            },
          };
          dispatch(add(prop.achievementId, payload));
        } else {
        }
        prop.onClose();
      }
    }
  };
  return prop.id != -1 ? (
    <div className="pop-up">
      <div className="pop-up-inner">
        <CForm>
          <div className="mb-3">
            <label>Loại tiêu chí </label>
            <select
              className="crit-form-input"
              value={typeTC}
              onChange={(event) => {
                setTypeTC(event.target.value);
              }}
            >
              <option value="3">--------</option>
              <option value="1">Tiêu chí tính điểm</option>
              <option value="2">Tiêu chí nhị phân</option>
            </select>
          </div>

          {typeTC == "3" ? (
            <></>
          ) : typeTC == "1" ? (
            <div>
              <div className="mb-3">
                <label>Tên tiêu chí </label>
                <input
                  className="crit-form-input"
                  type="text"
                  placeholder="Nhập tên tiêu chí"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                />
                <span style={{ color: "red" }}>{nameError}</span>
              </div>
              <div className="mb-3">
                <label>Mô tả </label>
                <input
                  className="crit-form-input"
                  type="text"
                  placeholder="Nhập mô tả"
                  value={des}
                  onChange={(event) => {
                    setDes(event.target.value);
                  }}
                />
              </div>
              <div className="mb-3">
                <label>Bắt buộc </label>
                <select
                  className="crit-form-input"
                  value={hard}
                  onChange={(event) => {
                    setHard(event.target.value);
                  }}
                >
                  <option value="hard">Bắt buộc hoàn thành</option>
                  <option value="soft">Có thể không hoàn thành</option>
                </select>
              </div>
              <div className="mb-3">
                <label>Giá trị </label>
                <input
                  className="crit-form-input"
                  type="text"
                  placeholder="Nhập điểm"
                  value={point}
                  onChange={(event) => {
                    setPoint(event.target.value);
                  }}
                />
                <span style={{ color: "red" }}>{pointError}</span>
              </div>
              <div className="mb-3">
                <label>Tiêu chuẩn</label>
                <select
                  className="crit-form-input"
                  value={sign}
                  onChange={(event) => {
                    setSign(event.target.value);
                  }}
                >
                  <option value="<">{"<"}</option>
                  <option value="<=">{"<="}</option>
                  <option value=">">{">"}</option>
                  <option value=">=">{">="}</option>
                </select>
              </div>
            </div>
          ) : typeTC == "2" ? (
            <div>
              <div className="mb-3">
                <label>Tên tiêu chí </label>
                <input
                  className="crit-form-input"
                  type="text"
                  placeholder="Nhập tên tiêu chí"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                />
                <span style={{ color: "red" }}>{nameError}</span>
              </div>
              <div className="mb-3">
                <label>Mô tả </label>
                <input
                  className="crit-form-input"
                  type="text"
                  placeholder="Nhập mô tả"
                  value={des}
                  onChange={(event) => {
                    setDes(event.target.value);
                  }}
                />
              </div>
              <div className="mb-3">
                <label>Bắt buộc </label>
                <select
                  className="crit-form-input"
                  value={hard}
                  onChange={(event) => {
                    setHard(event.target.value);
                  }}
                >
                  <option value="hard">Bắt buộc hoàn thành</option>
                  <option value="soft">Có thể không hoàn thành</option>
                </select>
              </div>
            </div>
          ) : (
            <></>
          )}
          <CButton color="primary" onClick={AddCrit}>
            Lưu
          </CButton>
          <CButton color="danger" onClick={prop.onClose}>
            Close
          </CButton>
        </CForm>
      </div>
    </div>
  ) : (
    <h1>Something went wrong</h1>
  );*/ <></>;
  };
};

export default AddForm;
