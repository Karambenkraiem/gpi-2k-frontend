import axios from "axios";
import { ip } from "constants/ip";

export const getWithHeaders = async (url) => {
  const token = localStorage.getItem("token");
  if (token)
    return await axios.get(ip + url, {
      headers: { Authorization: "Bearer " + token },
    });
};
export const postWithHeaders = async (url, body) => {
  const token = localStorage.getItem("token");
  if (token)
    return await axios.post(ip + url, body, {
      headers: { Authorization: "Bearer " + token },
    });
};
export const patchWithHeaders = async (url,body) => {
  const token = localStorage.getItem("token");
  if (token)
    return await axios.patch(ip + url, body, {
      headers: { Authorization: "Bearer " + token },
    });
};
export const deleteWithHeaders = () => { };
