import { ActionCodeSettings } from "firebase/auth";

// This is for email verification in the future
export const ACTION_CODE_SETTINGS: ActionCodeSettings = {
  url: import.meta.env.VITE_GCP_REDIRECT_URI,
  handleCodeInApp: true,
};
