export const getBaseUrl = (url: string) => {
  return url.replace(/(http(s)?:\/\/)|(\/.*){1}/g, "");
};
