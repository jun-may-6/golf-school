import { useEffect, useState } from "react";
import { callApi } from "../../apis/api";
import { Navigate, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store";
import { setUser } from "../../store/userSlice";
import { GlobalLoading } from "../gateLayout/globalLoading";

export function ProtectRouter() {
  const [authResult, setAuthResult] = useState<boolean | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const tokenTest = async () => {
      try {
        const userData = await callApi.get("/users/me");
        setAuthResult(userData.status === 200);
        console.log(userData.data)
        dispatch(setUser(userData.data))
      } catch {
        const result = await callApi.delete("/users/jwt-tokens")
        setAuthResult(false);
      }
    };
    tokenTest();
  }, []);
  if (authResult === null) {
    return <GlobalLoading isLoading={authResult === null} loadingMessage="정보 로딩중..." />;
  }
  return authResult ? <Outlet /> :
    <Navigate to="/gate/login" />;
}
