// import { any } from "prop-types";
import { CompetitionSubmission } from "../../types/BK_Competition/Submission";
import axiosClient from "../axiosClient";

interface SvRes {
  done: any;
  value: any;
}

const competitionSubmissionApi = {
  getAll: (acvId: string, userId: string): Promise<any> => {
    const url = `competition/submission/participant-get/${acvId}/${userId}`;
    return axiosClient.get(url);
  },
  add: (
    acvId: string,
    userId: string,
    data: CompetitionSubmission[]
  ): Promise<CompetitionSubmission[]> => {
    const url = `competition/submission/${acvId}/${userId}`;
    return axiosClient.post(url, data);
  },
  uploadFiles: (data: File): Promise<CompetitionSubmission[]> => {
    const url = `competition/submission/upload`;
    return axiosClient.post(url, data);
  },
  downloadFile: (userId: number, comId: string, fileName: string) => {
    try {
      const token = localStorage.getItem("token");
      const resultURL = fetch(
        `${process.env.REACT_APP_API_SERVER}/competition/submission/download/${userId}/${comId}/${fileName}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authentication: token !== null ? token : "",
          },
        }
      )
        .then((response: any) => {
          // console.log("File res: ", typeof response.body);
          const reader = response.body.getReader();

          return new ReadableStream({
            start(controller) {
              return pump();
              function pump() {
                return reader.read().then(({ done, value }: SvRes) => {
                  // When no more data needs to be consumed, close the stream
                  if (done) {
                    controller.close();
                    return;
                  }
                  // Enqueue the next data chunk into our target stream
                  controller.enqueue(value);
                  return pump();
                });
              }
            },
          });
        })
        .then((stream) => new Response(stream))
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          // const link = document.createElement("a");
          // link.href = url;
          // link.target = "_blank";

          // link.click();
          // link.setAttribute("download", fileName);
          // document.body.appendChild(link);
          // link.click();

          return { resultUrl: url, resultBlob: blob };
          // window.open(url, "_blank")?.focus();
        });
      // .then((url) => {
      //   const image = document.getElementById("displayEvidence");
      //   if (image !== null) {
      //     console.log(image.setAttribute("src", url));
      //     //window.open(url, "Image", "resizable=1");
      //   }
      // });

      // const url = window.URL.createObjectURL(new Blob([response.body]));
      // const link = document.createElement("a");
      // link.href = url;
      // link.setAttribute("download", fileName);
      // document.body.appendChild(link);
      // link.click();
      return resultURL;
    } catch (err: any) {
      console.log(err.message);
    }
  },
};

export default competitionSubmissionApi;
