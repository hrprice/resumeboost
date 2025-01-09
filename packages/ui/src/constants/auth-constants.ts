import { ActionCodeSettings } from "firebase/auth";

export const ACTION_CODE_SETTINGS: ActionCodeSettings = {
  url: import.meta.env.VITE_GCP_REDIRECT_URI,
  handleCodeInApp: true,
};
