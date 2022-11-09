import { CButton, CForm } from "@coreui/react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Criteria } from "../../../../types/TieuChi";
import { isNameExist } from "../../../../utils/competitionCritArrayHandler";
import { RootState } from "../../../../store";

const ModifyForm = (prop: {
  item: Criteria;
  onClose: () => void;
  achievementId: string;
}) => {
  <div></div>;
};

export default ModifyForm;
