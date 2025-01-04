import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store";
import { endLoading, startLoading } from "../store/gateLoadingSlice";
import axios, { AxiosError } from "axios";
import { callApi } from "../apis/api";

export function RegisterPage() {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [inputData, setInputData] = useState<{
    id?: string;
    password?: string;
    checkPassword?: string;
    name?: string;
    birthday?: string;
    email?: string;
  }>({});

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setInputData((state) => ({
      ...state,
      [id]: value,
    }));
  };
  const onClickRegister = async () => {
    try {
      dispatch(startLoading());
      const data = {
        userId: inputData.id,
        password: inputData.password,
        name: inputData.name,
        birthday: inputData.birthday,
        email: inputData.email
      }
      const response = await callApi.post("/users", data)
      if (response.status == 200) {
        alert("가입이 완료되었습니다.")
        navigate("/gate/login")
      }
    } catch(error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        if (axiosError.response?.data?.message) {
          alert(axiosError.response.data.message);
        } else {
          alert("알 수 없는 서버 에러가 발생했습니다.");
        }
      } else {
        alert("예상치 못한 오류가 발생했습니다.");
      }
    } finally {
      dispatch(endLoading())
    }
  }

  return (
    <div className="login-container">
      <label htmlFor="id">아이디</label>
      <input
        id="id"
        placeholder="20자 이내의 아이디를 입력해주세요."
        onChange={onChangeHandler}
        value={inputData.id || ""}
      />
      <label htmlFor="password">비밀번호</label>
      <input
        id="password"
        type="password"
        placeholder="20자 이내의 비밀번호를 입력해주세요."
        onChange={onChangeHandler}
        value={inputData.password || ""}
      />
      <label htmlFor="checkPassword">{!inputData.checkPassword?"비밀번호 확인":inputData.password == inputData.checkPassword?"비밀번호 확인 - 일치": "비밀번호 확인 - 불일치"}</label>
      <input
        id="checkPassword"
        type="password"
        placeholder="비밀번호를 다시 입력해주세요."
        className={!inputData.checkPassword? "": inputData.password == inputData.checkPassword ? "safe": "warning"}
        onChange={onChangeHandler}
        value={inputData.checkPassword || ""}
      />
      <label htmlFor="name">이름</label>
      <input
        id="name"
        placeholder="이름을 입력해주세요."
        onChange={onChangeHandler}
        value={inputData.name || ""}
      />
      <label htmlFor="birthday">생년월일</label>
      <input
        id="birthday"
        type="date"
        onChange={onChangeHandler}
        value={inputData.birthday || ""}
      />
      <label htmlFor="email">이메일</label>
      <input
        id="email"
        type="email"
        placeholder="사용하시는 이메일을 입력해주세요."
        onChange={onChangeHandler}
        value={inputData.email || ""}
      />
      <button onClick={onClickRegister}>회원가입</button>
      <div className="gate-link">
        <Link to="/gate/login" className="link">
          로그인
        </Link>
      </div>
      <div className="gate-link">
        <Link to="/gate/find-account" className="link">
          아이디/비밀번호 찾기
        </Link>
      </div>
    </div>
  );
}
