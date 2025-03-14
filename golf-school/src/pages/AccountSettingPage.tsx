import classNames from "classnames/bind";
import styles from "./accountSettingPage.module.scss";
import { useAppDispatch, useAppSelector } from "../store";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { callApi, callHandlingErrorApi, handleApiError } from "../apis/api";
import { setUser } from "../store/userSlice";

export function AccountSettingPage() {
  const cx = classNames.bind(styles);
  const userInfo = useAppSelector(state => state.userInfo);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onClickEvent = async () => {
    if (!confirm("수정하시겠습니까?")) return;
    const response = await callHandlingErrorApi.put(`/users/${userInfo.userId}`, userInfoInput)
    if(response.status == 200){
      const response = await callApi.get("/users/me")
      dispatch(setUser(response.data));
      navigate("/")
    }
  }
  const [userInfoInput, setUserInfoInput] = useState<{
    name: string;
    email: string;
    gender: string;
    birthday: string;
  }>({
    name: userInfo.name,
    email: userInfo.email,
    gender: userInfo.gender,
    birthday: new Date(userInfo.birthday).toISOString().split('T')[0]
  });
  return <div className={cx("container")}>
    <header>
      <div className={cx("header-left-side")}></div>
      <div className={cx("header-center")}>
        회원정보 수정
      </div>
      <div className={cx("header-right-side")}></div>
    </header>
    <div className={cx("main")}>
      <div className={cx("profile")}>
        <img className={cx("profile-image")} src={userInfoInput.gender == "남" ? "/icon/male.png" : "/icon/female.png"} />
        <div className={cx("user-info")}>
          <div className={cx("name")}>{userInfoInput.name}{userInfo.accessLevel == "ADMIN" ? "(관리자)" : ""}</div>
          <div className={cx("user-id")}>{userInfo.userId}</div>
        </div>
      </div>
      <label htmlFor="name">이름</label>
      <input
        id="name"
        placeholder="이름을 입력해주세요."
        onChange={(e) => {
          setUserInfoInput(state => ({ ...state, name: e.target.value }))
        }}
        value={userInfoInput.name || ""}
      />
      <label htmlFor="birthday">생년월일</label>
      <input
        id="birthday"
        type="date"
        onChange={(e) => {
          setUserInfoInput(state => ({ ...state, birthday: e.target.value }))
        }}
        value={userInfoInput.birthday}
      />
      <label htmlFor="gender">성별</label>
      <div className={cx("select")}>
        <input type="radio" id="male" name="gender" value="남"
          checked={userInfoInput.gender == "남"}
          onChange={(e) => {
            setUserInfoInput(state => ({ ...state, gender: e.target.value }))
          }} /><label htmlFor="male">남성</label>
        <input type="radio" id="female" name="gender" value="여"
          checked={userInfoInput.gender == "여"}
          onChange={(e) => {
            setUserInfoInput(state => ({ ...state, gender: e.target.value }))
          }} /><label htmlFor="female">여성</label>
      </div>
      <label htmlFor="email">이메일</label>
      <input
        id="email"
        type="email"
        placeholder="사용하시는 이메일을 입력해주세요."
        onChange={(e) => {
          setUserInfoInput(state => ({ ...state, email: e.target.value }))
        }}
        value={userInfoInput.email || ""}
      />
      <div className={cx("button-area")}>
        <button className={cx("cancel")}
          onClick={() => {
            navigate("/")
          }}>취소</button>
        <button

          disabled={!(userInfoInput.name != "" &&
            userInfoInput.birthday != "" &&
            userInfoInput.gender != "")}
          onClick={onClickEvent}
        >수정</button>
      </div>
    </div>
  </div>
}