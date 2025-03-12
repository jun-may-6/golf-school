import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { callApi, callNoneCredentialApi, callNoneHandlingErrorApi, handleApiError } from "../apis/api";
import axios, { AxiosError } from "axios";
import { useAppDispatch, useAppSelector } from "../store";
import { endGlobalLoading, startGlobalLoading } from "../store/globalLoadingSlice";
import styles from "./loginPage.module.scss"
import classNames from "classnames/bind";

export function LoginPage(): JSX.Element {
  const cx = classNames.bind(styles)
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [inputData, setInputData] = useState<{ userId: string, password: string, isPermanence: boolean }>({ userId: "", password: "", isPermanence: false });

  useEffect(() => {
    const refreshTokenValidation = async () => {
      const result = await callNoneHandlingErrorApi.post("/users/refresh-token/validity")
      if (result && result.status == 200) navigate("/home")
    }
    refreshTokenValidation()
  }, []);

  /* 로그인 핸들러 */
  const loginButtonOnClickHandler = async () => {
    dispatch(startGlobalLoading("로그인 중"));
    try {
      const response = await callNoneHandlingErrorApi.post("/users/jwt-tokens", inputData)
      if (response.status == 200) {
        navigate("/home")
      }
    } catch (e) {
      handleApiError(e)
    } finally {
      dispatch(endGlobalLoading());
    }
  }
  return <div className={cx("login-container")}>
    <input
      placeholder="ID"
      value={inputData.userId}
      onChange={(e) => setInputData(prev => ({ ...prev, userId: e.target.value }))}
    />
    <input
      type="password"
      placeholder="Password"
      value={inputData.password}
      onChange={(e) => setInputData(prev => ({ ...prev, password: e.target.value }))
      }
    />
    <button onClick={loginButtonOnClickHandler}>로그인</button>
    <div className={cx("permaence-login-container")}>
      <input
        type="checkBox"
        id="permanenceLogin"
        checked={inputData.isPermanence}
        onChange={(e) => setInputData((prev) => ({ ...prev, isPermanence: e.target.checked }))}
      /><label htmlFor="permanenceLogin">자동 로그인 (7일)</label>
    </div>
    <Link to="/gate/register">회원가입</Link>
    <Link to="/gate/find-id">아이디/비밀번호 찾기</Link>
  </div>
}