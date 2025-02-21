import { useState } from "react";
import { LoadingComponent } from "./loadingComponent";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "../../store";

export function GateLayout():JSX.Element {
  const isLoading = useAppSelector(state=>state.loading.isLoading);
  const [loadingMessage, setLoadingMessage] = useState<string>("loading");
  return <>
    <div>
      <div className="gate-logo-area">
        <div className="gate-logo-container">
          <img src="logo.png" alt="logo" />
          <div className="logo-title">
            편무일 골프 스쿨
          </div>
        </div>
      </div>
      <div className="login-area">
        {isLoading ?
          <LoadingComponent loadingMessage={loadingMessage} /> :
          <Outlet />
        }
      </div>
    </div>
  </>
}