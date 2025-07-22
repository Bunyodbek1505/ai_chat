import Cookies from "js-cookie";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export const useLogout = () => {
  const router = useRouter();
  const logoutUser = useUserStore((s) => s.logout);

  const logout = () => {
    Cookies.remove("token");
    logoutUser(); 
    toast.info("You have been logged out.");

    router.push("/login");
  };

  return logout;
};
