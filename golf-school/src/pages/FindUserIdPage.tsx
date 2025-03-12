import { useState } from "react"
import { Link } from "react-router-dom";
import { callApi, handleApiError } from "../apis/api";
import styles from "./findUserIdPage.module.scss";
import classNames from "classnames/bind";
import { useAppDispatch } from "../store";
import { endGlobalLoading, startGlobalLoading } from "../store/globalLoadingSlice";
export function FindUserIdPage() {
  const cx = classNames.bind(styles);
  const dispatch = useAppDispatch();

  const [inputData, setInputData] = useState<{ name: string, email: string, birthday: string }>({ name: "", email: "", birthday: "" });
  const [findResult, setFindResult] = useState<{ name: string, userId: string, joinDate: string, profileImagePath: string, gender: string } | null>(null);

  const onClickFindButton = async () => {
    try {
      dispatch(startGlobalLoading("찾는중..."))
      const response = await callApi.post("/users/user-id", inputData)
      const parseJoinDate = new Date(response.data.joinDate)
      response.data.joinDate = parseJoinDate.getFullYear() + "/" +
        parseJoinDate.getMonth() + 1 + "/" +
        parseJoinDate.getDate()
      setFindResult(response.data);
    } catch (e) {
      handleApiError(e)
    } finally {
      dispatch(endGlobalLoading())
    }
  }



  return <div className={cx("container")}>
    {findResult ?
      <>
        <div className={cx("result-box")}>
          <div className={cx("header")}>
            아이디 찾기 완료
          </div>
          <div className={cx("contents")}>
            <div className={cx("card")}>
              <img className={cx("profile-img")} src={findResult.profileImagePath || findResult.gender == '남' ? "/icon/male.png" : "/icon/female.png"} />
              <table className={cx("profile-table")}>
                <tr>
                  <th>이름</th>
                  <td>{findResult.name}</td>
                </tr>
                <tr>
                  <th>아이디</th>
                  <td>{findResult.userId}</td>
                </tr>
                <tr>
                  <th>가입일</th>
                  <td>{findResult.joinDate}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </>
      : <>
        <label htmlFor="name">이름</label>
        <input
          id="name"
          placeholder="이름을 입력해주세요."
          onChange={(e) => {
            setInputData(state => ({ ...state, name: e.target.value }))
          }}
          value={inputData.name}
        />
        <label htmlFor="birthday">생년월일</label>
        <input
          id="birthday"
          type="date"
          onChange={(e) => { setInputData(state => ({ ...state, birthday: e.target.value })) }}
          value={inputData.birthday || ""}
        />
        <label htmlFor="email">이메일</label>
        <input
          id="email"
          placeholder="가입한 이메일을 입력해주세요."
          onChange={(e) => {
            setInputData(state => ({ ...state, email: e.target.value }))
          }}
          value={inputData.email}
        />
        <button
          onClick={onClickFindButton}
          disabled={inputData.name == "" ||  inputData.email == "" || inputData.birthday == ""}
        >아이디 찾기</button>
      </>
    }

    <div className="gate-link">
      <Link to="/gate/login" className="link">
        로그인
      </Link>
    </div>
    <div className="gate-link">
      <Link to="/gate/find-pwd" className="link">
        비밀번호 찾기
      </Link>
    </div>
  </div>
}