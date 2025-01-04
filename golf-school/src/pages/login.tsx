import { Link, useNavigate } from "react-router-dom";
import { LoadingComponent } from "../components/gateLayout/loadingComponent";
import { useEffect, useRef, useState } from "react";
import { callApi } from "../apis/api";
import axios, { AxiosError } from "axios";
import { useAppDispatch, useAppSelector } from "../store";
import { endLoading, hasFetched, startLoading } from "../store/gateLoadingSlice";

export function LoginPage(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [inputData, setInputData] = useState<{ userId: string, password: string, isPermanence: boolean }>({ userId: "", password: "", isPermanence: false });
  
  useEffect(() => {
    const refreshTokenValidation = async () => {
      const result = await callApi.post("/users/refresh-token/validity")
      return result;
    }
    refreshTokenValidation().then(result=>{
      if(result.status == 200) navigate("/home")
    })
  }, []);
  const idInputHandelr = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputData(prev => ({ ...prev, userId: e.target.value }))
  }
  const passwordInputHandelr = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputData(prev => ({ ...prev, password: e.target.value }))
  }
  const permanenceLoginHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputData((prev) => ({ ...prev, isPermanence: e.target.checked }));
  };
  /* 로그인 핸들러 */
  const loginButtonOnClickHandler = async () => {
    dispatch(startLoading());
    try {
      const response = await callApi.post("/users/jwt-tokens", inputData)
      if (response.status == 200) {
        navigate("/home")
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // AxiosError 타입으로 에러 처리
        const axiosError = error as AxiosError<{ message: string }>;
        if (axiosError.response?.data?.message) {
          alert(axiosError.response.data.message); // 서버에서 반환한 에러 메시지 출력
        } else {
          alert("알 수 없는 서버 에러가 발생했습니다.");
        }
      } else {
        alert("예상치 못한 오류가 발생했습니다.");
      }
    } finally {
      dispatch(endLoading());
    }
  }
  return <div className="login-container">
    <input
      placeholder="ID"
      value={inputData.userId}
      onChange={idInputHandelr}
    />
    <input
      type="password"
      placeholder="Password"
      value={inputData.password}
      onChange={passwordInputHandelr}
    />
    <button onClick={loginButtonOnClickHandler}>로그인</button>
    <div className="permaenceLoginContainer">
      <input
        type="checkBox"
        id="permanenceLogin"
        checked={inputData.isPermanence}
        onChange={permanenceLoginHandler}
      /><label htmlFor="permanenceLogin">자동 로그인 (7일)</label>
    </div>
    <div className="gate-link"><Link to="/gate/register" className="link ">회원가입</Link></div>
    <div className="gate-link"><Link to="/gate/find-account" className="link">아이디/비밀번호 찾기</Link></div>
  </div>
}