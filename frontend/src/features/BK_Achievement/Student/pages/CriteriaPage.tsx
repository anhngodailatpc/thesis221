// import { CButton, CCard, CCardBody, CCardHeader } from "@coreui/react";
// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "../../../store";

// import MainCrit from "../components/MainCrit";
// import { fetchAll } from "../../../redux/TieuChi";
// import {
//   genSubmission,
//   fetchAll as fetchAllSubmission,
//   addSubmissionAsync,
// } from "../../../redux/submission";

// import { RouteComponentProps, useHistory } from "react-router-dom";

// import SubCrit from "../components/SubCrit";
// import { Criteria } from "../../../types/TieuChi";
// import { GenerateApplicationHandler } from "../../../utils/critArrayHandler";
// // import ImgPreview from "../../../common/imagePreview/ImgPreview";
// import Toaster from "../../../common/toast";
// import FileData from "../../../types/FileData";
// import submissionApi from "../../../api/submissionApi";
// import { extname } from "path";

// type TParams = { id: string };
// // type fileReturn = {
// //   resultUrl: string
// //   resultBlob: Blob
// // }
// const CriteriaPage = ({ match }: RouteComponentProps<TParams>) => {
//   const [submittable, setSubmitable] = useState(true);
//   // const [showFile, setShowFile] = useState(false);
//   // const [src, setSrc] = useState("");
//   const [isToast, setIsToast] = useState(false);

//   const user = useSelector((state: RootState) => state.user);
//   const data = useSelector((state: RootState) => state.tieuchi.list);
//   const submitData = useSelector((state: RootState) => state.submission.list);
//   const [fileToSave, setFileToSave] = useState<FileData[]>([]);

//   const dispatch = useDispatch();
//   const history = useHistory();

//   //console.log(submitData);
//   useEffect(() => {
//     dispatch(fetchAll(match.params.id));
//     dispatch(fetchAllSubmission(match.params.id, user.id.toString()));
//   }, [dispatch, match.params.id, user.id]);

//   const cancelSubmit = () => {
//     setSubmitable(false);
//   };

//   const activateSubmit = () => {
//     setSubmitable(true);
//   };

//   const onAddFileToSave = (file: FileData) => {
//     for (let sendfile of fileToSave) {
//       if (sendfile.fileName === file.fileName) {
//         setFileToSave([
//           ...fileToSave.filter((item) => item.fileName !== file.fileName),
//           file,
//         ]);
//         return;
//       }
//     }
//     setFileToSave([...fileToSave, file]);
//   };
//   const saveButtonClicked = async () => {
//     if (fileToSave.length > 0) {
//       const formData = new FormData();
//       for (let sendfile of fileToSave) {
//         formData.append("file", sendfile.file, sendfile.fileName);
//       }
//       try {
//         // const response = await fetch(
//         //   `http://localhost:5000/submission/uploadfiles/${user.id}/${match.params.id}`,
//         //   {
//         //     method: "POST",
//         //     body: formData,
//         //   }
//         // );
//         await fetch(
//           `http://localhost:5000/submission/uploadfiles/${user.id}/${match.params.id}`,
//           {
//             method: "POST",
//             body: formData,
//           }
//         );
//       } catch (err) {
//         console.log(err);
//       }
//       //console.log("File to save: ", fileToSave);
//     }
//     dispatch(
//       addSubmissionAsync(match.params.id, user.id.toString(), submitData)
//     );

//     setIsToast(true);
//     setTimeout(() => {
//       history.push("/de-cu");
//     }, 2500);
//   };

//   const ApplicationGen = (arr: Criteria[], userId: number, achId: number) => {
//     const newData = GenerateApplicationHandler(arr, userId, achId);
//     dispatch(genSubmission({ list: newData }));
//   };

//   const onShowClicked = async (fileName: string) => {
//     //console.log("trying to download file: " + fileName);
//     try {
//       const fileResult = await submissionApi.downloadFile(
//         user.id,
//         match.params.id,
//         fileName
//       );
//       // match(/\.(jpg|jpeg|png|pdf|docx|doc)$/)
//       const fileExtName = extname(fileName);
//       if (fileResult !== undefined) {
//         if (fileName.match(/\.(jpg|jpeg|png)$/)) {
//           const imageType = fileExtName in ["jpg", "jpeg"] ? "jpeg" : "png";
//           const imageFile = new Blob([fileResult?.resultBlob], {
//             type: `image/${imageType}`,
//           });
//           const fileURL = URL.createObjectURL(imageFile);
//           //Open the URL on new Window
//           const imageWindow = window.open();
//           if (imageWindow !== null) {
//             imageWindow.location.href = fileURL;
//           }
//         } else if (fileName.match(/\.(pdf)$/)) {
//           const pdfFile = new Blob([fileResult?.resultBlob], {
//             type: "application/pdf",
//           });
//           const fileURL = URL.createObjectURL(pdfFile);
//           //Open the URL on new Window
//           const pdfWindow = window.open();
//           if (pdfWindow !== null) {
//             pdfWindow.location.href = fileURL;
//           }
//         } else if (fileName.match(/\.(docx|doc)$/)) {
//           const link = document.createElement("a");
//           link.href = fileResult.resultUrl;
//           link.setAttribute("download", fileName);
//           document.body.appendChild(link);
//           link.click();
//         }
//       } else {
//       }
//       //window.open(data);
//       //console.log(data);
//     } catch (err) {
//       console.log(err);
//     }
//   };
//   return (
//     <div style={{ width: "100%" }}>
//       <CCard>
//         <CCardHeader style={{ display: "inline", verticalAlign: "center" }}>
//           <div style={{ float: "left", marginTop: "1vh" }}>
//             ĐĂNG KÍ TIÊU CHÍ
//           </div>
//           {!(submitData.length > 0) ? (
//             <CButton
//               color="secondary"
//               onClick={() => {
//                 ApplicationGen(data, user.id, +match.params.id);
//               }}
//               style={{ float: "right" }}
//             >
//               Tạo bộ hồ sơ
//             </CButton>
//           ) : (
//             <></>
//           )}
//         </CCardHeader>
//         <CCardBody className="main-crit-display">
//           <div className="crit-num-soft-info">
//             {data.length > 0 ? (
//               data.length === 1 ? (
//                 <>Người nộp phải phù hợp với tất cả những điều sau đây</>
//               ) : (
//                 <>Người nộp phải phù hợp với những điều sau đây</>
//               )
//             ) : (
//               <>Không</>
//             )}
//           </div>
//           {data.map((item) =>
//             item.isCriteria === false ? (
//               <MainCrit
//                 key={item.id}
//                 parentid={0}
//                 item={item}
//                 submitData={submitData}
//                 cancelSubmit={cancelSubmit}
//                 activateSubmit={activateSubmit}
//                 onShowClk={onShowClicked}
//                 addSaveFile={onAddFileToSave}
//               />
//             ) : (
//               <SubCrit
//                 key={item.id}
//                 parentid={0}
//                 item={item}
//                 submitData={submitData}
//                 cancelSubmit={cancelSubmit}
//                 activateSubmit={activateSubmit}
//                 onShowClk={onShowClicked}
//                 addSaveFile={onAddFileToSave}
//               />
//             )
//           )}
//           <div className="main-crit-display-item flex-middle-vert-hori box-around">
//             {submitData.length > 0 ? (
//               <CButton
//                 color="secondary"
//                 onClick={saveButtonClicked}
//                 disabled={!submittable}
//               >
//                 Lưu
//               </CButton>
//             ) : (
//               <></>
//             )}
//           </div>
//         </CCardBody>
//       </CCard>
//       {/* {showFile ? (
//         <ImgPreview
//           src={src}
//           onHide={() => {
//             setShowFile(false);
//           }}
//         />
//       ) : (
//         <></>
//       )} */}
//       <Toaster isShow={isToast} />
//     </div>
//   );
// };

// export default CriteriaPage;
import React from "react";

const CriteriaPage = () => {
  return <div>Nothing here</div>;
};

export default CriteriaPage;
