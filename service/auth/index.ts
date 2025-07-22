import { toast } from "react-toastify";
import { serviceApi } from "../serviceApi";

type LoginPayload = {
  username: string;
  password: string;
};

type LoginResponse = {
  message: string;
  data: {
    id: string;
    username: string;
    displayName: string;
    token: string;
  };
  success: string;
  time: string;
};

export const loginUser = async ({
  username,
  password,
}: LoginPayload): Promise<LoginResponse> => {
  const res = await serviceApi("POST", "/auth", {
    username,
    password,
  });
  return res;
};

export const getMe = async () => {
  try {
    const res = await serviceApi("GET", "/user/getMe", { withCredentials: true });
    return res;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Noma'lum xatolik yuz berdi";
    toast(message);
  }
};
