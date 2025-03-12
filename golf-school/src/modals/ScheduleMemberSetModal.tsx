import classNames from "classnames/bind";
import { userInfo } from "../types/user";
import styles from "./modal.module.scss";


export function ScheduleMemberSetModal({ memberIdArray, setMemberIdArray, userList, onClose }:
  { memberIdArray: string[], setMemberIdArray: (idArray: string[]) => void, userList: userInfo[], onClose: () => void }
) {
  const cx = classNames.bind(styles);
  return (
    <div className={cx("schedule-member-set")}>
      <div className={cx("header")}>인원 선택</div>
      <div className={cx("contents")}>
        <div className={cx("member-box")}>
          <div className={cx("header")}>참여 인원</div>
          <div className={cx("member-list")}>
            {userList.filter(u => memberIdArray.includes(u.userId)).map(user => {
              const profileImage = user.gender == '여' ? "icon/female.png" : "icon/male.png";
              const birthday = new Date(user.birthday);
              return (
                <div key={user.userId} className={cx("profile")} onClick={() => setMemberIdArray(memberIdArray.filter(id => id != user.userId))}>
                  <div className={cx("icon")}>
                    <img src={profileImage} />
                  </div>
                  <div className={cx("name-area")}>
                    <div className={cx("name")}>{user.name}</div>
                    <div className={cx("birthday")}>{`${birthday.getFullYear()}.${birthday.getMonth() + 1}.${birthday.getDate()}`}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={cx("toggle-icon")}>
          <img src="icon/exchange.png" />
        </div>
        <div className={cx("member-box")}>
          <div className={cx("header")}>회원 목록</div>
          <div className={cx("member-list")}>
            {userList.filter(u => u.accessLevel != "ADMIN").map(user => {
              const profileImage = user.gender == '여' ? "icon/female.png" : "icon/male.png";
              const birthday = new Date(user.birthday);
              return (
                <div
                  key={user.userId}
                  className={cx("profile")}
                  onClick={() => {
                    if (memberIdArray.includes(user.userId)) {
                      setMemberIdArray(memberIdArray.filter(id => id != user.userId));
                    } else {
                      setMemberIdArray([...memberIdArray, user.userId]);
                    }
                  }}>
                  <div className={cx("icon")}>
                    <img src={profileImage} />
                  </div>
                  <div className={cx("name-area")}>
                    <div className={cx("name")}>{user.name}</div>
                    <div className={cx("birthday")}>{`${birthday.getFullYear()}.${birthday.getMonth() + 1}.${birthday.getDate()}`}</div>
                  </div>
                  <input type="checkbox" checked={memberIdArray.includes(user.userId)} readOnly />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className={cx("button-area")}>
      <button className={cx("button")} onClick={onClose}>선택 완료</button>
      </div>
    </div>
  );
}