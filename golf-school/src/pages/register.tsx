import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store";
import { endLoading, startLoading } from "../store/gateLoadingSlice";
import axios, { AxiosError } from "axios";
import { callApi, handleApiError } from "../apis/api";
import { endGlobalLoading, startGlobalLoading } from "../store/globalLoadingSlice";

export function RegisterPage() {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  type input = {
    id: string;
    password: string;
    checkPassword: string;
    name: string;
    birthday: string;
    email: string;
    gender: string;
  }
  const [inputData, setInputData] = useState<input>({
    id: "",
    password: "",
    checkPassword: "",
    name: "",
    birthday: "",
    email: "",
    gender: ""
  });

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setInputData((state) => ({
      ...state,
      [id]: value,
    }));
  };
  const onClickRegister = async () => {
    if (!testInput()) return
    dispatch(startLoading());
    const data = {
      userId: inputData.id,
      password: inputData.password,
      name: inputData.name,
      birthday: inputData.birthday,
      email: inputData.email,
      gender: inputData.gender
    }
    try {
      const response = await callApi.post("/users", data)
      if (response.status == 200) {
        alert("가입이 완료되었습니다.")
        navigate("/gate/login")
      }
    } catch (error) {
      alert("예상치 못한 오류가 발생했습니다." + error);
    } finally {
      dispatch(endLoading())
    }
  }
  const testInput = (): boolean => {
    let result = true;
    if (inputData.id == "") result = false;
    if (inputData.password == "" || inputData.password != inputData.checkPassword) result = false;
    if (inputData.birthday == "") result = false;
    if (inputData.email == "" || !inputData.email.includes("@")) result = false;
    if (!isPossibleId) result = false;
    return result;
  }
  const [isPossibleId, setIsPossibleId] = useState<boolean>(false);
  const onClickIdExistButton = async (id: string) => {
    try {
      dispatch(startGlobalLoading("확인중"))
      const response = await axios.get(`https://z9m2acdblb.execute-api.ap-northeast-2.amazonaws.com/api/users/${id}/exists`)
      if (response.data.isAllowdId) {
        setIsPossibleId(true)
      } else {
        alert("중복되는 아이디입니다.")
      };
    } catch(e) {
      handleApiError(e)
    } finally {
      dispatch(endGlobalLoading())
    }
  }

  return (
    <div className="login-container">
      <label htmlFor="id">아이디 - {isPossibleId ? "사용 가능한 아이디입니다." : "중복을 확인해주세요."}</label>
      <div className="test-exist">
        <input
          id="id"
          placeholder="아이디를 입력해주세요."
          onChange={(e) => {
            onChangeHandler(e)
            setIsPossibleId(false);
          }}
          value={inputData.id || ""}
          className={isPossibleId ? "safe" : "warning"}
        />
        <button
          onClick={() => {
            onClickIdExistButton(inputData.id)
          }}>확인</button>
      </div>
      <label htmlFor="password">비밀번호 {!inputData.checkPassword ? "" : inputData.password == inputData.checkPassword ? " - 일치" : " - 불일치"}</label>
      <input
        id="password"
        type="password"
        placeholder="20자 이내의 비밀번호를 입력해주세요."
        onChange={onChangeHandler}
        value={inputData.password || ""}
      />
      <input
        id="checkPassword"
        type="password"
        placeholder="비밀번호를 확인해주세요."
        className={!inputData.checkPassword ? "" : inputData.password == inputData.checkPassword ? "safe" : "warning"}
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
      <label htmlFor="birthday">성별</label>
      <select onChange={e => setInputData(state => ({ ...state, gender: e.target.value }))}>
        <option value="남">남성</option>
        <option value="여">여성</option>
      </select>
      <label htmlFor="email">이메일</label>
      <input
        id="email"
        type="email"
        placeholder="사용하시는 이메일을 입력해주세요."
        onChange={onChangeHandler}
        value={inputData.email || ""}
      />
      <button
        onClick={onClickRegister}
        className={
          testInput() ? "allow" : "not-allow"
        }
      >회원가입</button>
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
