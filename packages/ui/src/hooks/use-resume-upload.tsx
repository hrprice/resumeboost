import { useCallback } from "react";
import useAxios from "@resume-optimizer/ui/state/use-axios";
import { useSnackbar } from "notistack";
import { getPDFText } from "@resume-optimizer/ui/utils/pdf-utils";

export const useResumeUpload = () => {
  const axiosClient = useAxios();
  const { enqueueSnackbar } = useSnackbar();

  return useCallback(
    async (resumeFile: File): Promise<string> => {
      const resumeText = await getPDFText(resumeFile);
      const payload = new FormData();
      payload.append("file", resumeFile);
      payload.append("textContent", JSON.stringify(resumeText));
      return axiosClient
        .post("resume/upload", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(({ data }) => data)
        .catch(() =>
          enqueueSnackbar("Error uploading resume", {
            variant: "error",
            autoHideDuration: 3000,
            preventDuplicate: true,
          })
        );
    },
    [axiosClient, enqueueSnackbar]
  );
};
