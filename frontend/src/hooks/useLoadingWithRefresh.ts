import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/authSlice";
import axios from "axios";
export function useLoadingWithRefresh() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
          { withCredentials: true },
        );
        // console.log("Data from loadingHook::", data.user);
        dispatch(setAuth({ isAuth: true, user: data.user }));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { loading };
}
