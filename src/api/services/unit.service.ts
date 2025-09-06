import apiClient from '../apiClient'

const uploadFile = async (file: File): Promise<string> => {
  const body = new FormData();
  body.append("file", file);
  const response = await apiClient.post("/unit", {
    method: "POST",
    body: body,
  });

  return response.data.url.replace("tmpfiles.org/", "tmpfiles.org/dl/");
};

export const unitService = {
  uploadFile,
};  