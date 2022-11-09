import { CCard, CCardBody } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RouteComponentProps, useHistory } from "react-router-dom";
import UserApi from "../../../../api/Achievement/userApi";
import activityRegistrationApi from "../../../../api/BKAP/activityRegistration";
import { roles } from "../../../../common/roles";
import { RootState } from "../../../../store";
import PopUpModal from "../../ActivityCampaign/components/PopUpModal";
var QRCode = require("qrcode.react");

type TParams = { id: string };
const ActivityQRRegister = ({ match }: RouteComponentProps<TParams>) => {
  const user = useSelector((state: RootState) => state.user);

  //popup
  const [openPopUp, setOpenPopup] = useState(false);
  const [popUpMsg, setPopUpMsg] = useState("");
  const [PopUpColorType, setPopUpColorType] = useState<
    "danger" | "success" | "warning" | "info"
  >("info");
  const history = useHistory();
  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await UserApi.verifyLogin();
      } catch {
        history.push("/login");
      }
    };

    const register = async () => {
      //de35222b-7cb9-44e3-9515-85136d049890
      const res = await activityRegistrationApi.QRReg(
        "REGISTERED",
        match.params.id
      );
      if (res.status === 200) {
        setPopUpMsg("Đăng kí thành công");
        setPopUpColorType("success");
        setOpenPopup(true);
      } else if (res.status === 409) {
        setPopUpMsg("Bạn đã đăng kí hoạt động này rồi");
        setPopUpColorType("warning");

        setOpenPopup(true);
      } else if (res.status === 400) {
        setPopUpMsg(res.error);
        setPopUpColorType("warning");

        setOpenPopup(true);
      } else {
        setPopUpMsg("Đã có lỗi xảy ra");
        setPopUpColorType("danger");

        setOpenPopup(true);
      }
    };
    if ([roles.PARTICIPANT].includes(user.role)) {
      if (user.id !== 0) {
        //Call Api to register here
        register();
      } else {
        history.push("/loi-truy-cap");
      }
    } else {
      verifyLogin();
      if (user.id !== 0) {
        history.push("/loi-truy-cap");
      }
    }
  }, [user.id, history, user.role, match.params.id]); //should not change anything
  return (
    <div style={{ backgroundColor: "white", width: "100%", height: "100%" }}>
      <CCardBody>
        <QRCode value="http://hcmut.edu.vn" />
      </CCardBody>
      {openPopUp ? (
        <PopUpModal
          msg={popUpMsg}
          colorType={PopUpColorType}
          onClose={() => {
            setOpenPopup(false);
            //history.push("/dang-ky-hoat-dong");
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default ActivityQRRegister;
