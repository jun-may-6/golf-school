import { scheduleInputData } from "../../types/calendar";
import { userInfo } from "../../types/user";

export function ScheduleMemberSetModal({ inputData, setInputData, userList, onClose }:
  { inputData: scheduleInputData, setInputData: React.Dispatch<React.SetStateAction<scheduleInputData>>, userList: userInfo[], onClose: () => void }
) {

  return <div className="schedule-member-set-modal">
    <div className="header">인원 선택</div>
    <div className="contents">
      <div className="member-box">
        <div className="header">참여 인원</div>
        <div className="member-list">
          {userList.filter(u=>inputData.memberIdArray.includes(u.userId)).map(user => {
            const profileImage = user.gender == '여' ? "icon/female.png" : "icon/male.png"
            const birthday = new Date(user.birthday)
            return <div key={user.userId} className="profile" onClick={() => {setInputData(state=>{return{...state, memberIdArray:state.memberIdArray.filter(id=>id!=user.userId)}})}}>
              <div className="icon">
                <img src={profileImage} />
              </div>
              <div className="name-area">
                <div className="name">{user.name}</div>
                <div className="birthday">{`${birthday.getFullYear()}.${birthday.getMonth() + 1}.${birthday.getDate()}`}</div>
              </div>
            </div>
          })}
        </div>
      </div>
      <div className="icon">
        <img src="icon/exchange.png" />
      </div>
      <div className="member-box">
        <div className="header">회원 목록</div>
        <div className="member-list">
          {userList.filter(u=>u.accessLevel != "ADMIN").map(user => {
            const profileImage = user.gender == '여' ? "icon/female.png" : "icon/male.png"
            const birthday = new Date(user.birthday)
            return <div key={user.userId} className="profile" onClick={() => {setInputData(state=>{
              if(state.memberIdArray.includes(user.userId)){
                return {...state, memberIdArray: state.memberIdArray.filter(id=>id != user.userId)}
              } else {
                return {...state, memberIdArray: [...state.memberIdArray, user.userId]}
              }
            })}}>
              <div className="icon">
                <img src={profileImage} />
              </div>
              <div className="name-area">
                <div className="name">{user.name}</div>
                <div className="birthday">{`${birthday.getFullYear()}.${birthday.getMonth() + 1}.${birthday.getDate()}`}</div>
              </div>
              <input type="checkbox" checked={inputData.memberIdArray.includes(user.userId)} readOnly />
            </div>
          })}
        </div>
      </div>
    </div>
    <button onClick={onClose}>선택 완료</button>
  </div>
}