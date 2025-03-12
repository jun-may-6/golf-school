import { useEffect, useState } from "react"
import { callApi, handleApiError } from "../../apis/api"
import { useAppDispatch, useAppSelector } from "../../store"
import { setScheduleComment } from "../../store/scheduleSlice"
import { userInfo } from "../../types/user"
import { comment, schedule } from "../../types/calendar"
import { endGlobalLoading, startGlobalLoading } from "../../store/globalLoadingSlice"
import { FitLoading } from "../FitLoading/FitLoading"
import styles from "./scheduleComment.module.scss"
import classNames from "classnames/bind"

export function ScheduleComment({ schedule }: { schedule: schedule }) {
  const userInfo: userInfo = useAppSelector(state => state.userInfo)
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const cx = classNames.bind(styles);
  const getScheduleComment = async () => {
    try {
      setIsLoading(true)
      const response = await callApi.get(`schedules/${schedule.id}/comments`)
      const commentList = response.data as comment[]
      commentList.sort((a, b) => (a.createDate > b.createDate ? 1 : -1));
      dispatch(setScheduleComment({ scheduleId: schedule.id, commentList: response.data }))
    } catch (e) {
      handleApiError(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (schedule.commentList == null) getScheduleComment();
    return () => {
      dispatch(setScheduleComment({ scheduleId: schedule.id, commentList: null }))
    }
  }, [])



  /* 일반 댓글 작성 로직 */
  const [commentMessage, setCommentMessage] = useState<string>("");
  const onClickCommentSubmit = async () => {
    try {
      dispatch(startGlobalLoading("댓글 작성중"))
      const response = await callApi.post(`/schedules/${schedule.id}/comments`, { message: commentMessage })
      getScheduleComment()
    } catch (e) {
      handleApiError(e)
    } finally {
      setCommentMessage("")
      dispatch(endGlobalLoading())
    }
  }
  /* 답글 작성 로직 */
  const [replyInput, setReplyInput] = useState<{
    refUserId: string;
    refUserName: string;
    refCommentId: number;
    message: string;
  }>({
    refUserId: "",
    refUserName: "",
    refCommentId: 0,
    message: ""
  })
  const onClickReplySubmit = async () => {
    try {
      dispatch(startGlobalLoading("답글 작성중"))
      const response = await callApi.post(`/schedules/${schedule.id}/comments`, {
        refCommentId: replyInput.refCommentId,
        refUserId: replyInput.refUserId,
        message: replyInput.message
      })
      getScheduleComment()
    } catch (e) {
      handleApiError(e)
    } finally {
      setReplyInput({
        refUserId: "",
        refUserName: "",
        refCommentId: 0,
        message: ""
      })
      dispatch(endGlobalLoading())
    }
  }

  /* 댓글 수정 로직 */
  const [modifyInput, setModifyInput] = useState<{ id: number, message: string, refUserName?: string }>({ id: 0, message: "" })
  const onClickModifySubmit = async () => {
    try {
      dispatch(startGlobalLoading("수정중"))
      const response = await callApi.put(`/schedules/comments/${modifyInput.id}`, {
        message: modifyInput.message
      })
      getScheduleComment()
    } catch (e) {
      handleApiError(e)
    } finally {
      setModifyInput({ id: 0, message: "" })
      dispatch(endGlobalLoading())
    }
  }
  /* 댓글 삭제 로직 */
  const onClickDeleteSubmit = async (id: number) => {
    if (!confirm("정말로 삭제하시겠습니까?")) return
    try {
      dispatch(startGlobalLoading("삭제중"))
      const response = await callApi.delete(`/schedules/comments/${id}`)
      getScheduleComment()
    } catch (e) {
      handleApiError(e)
    } finally {
      setModifyInput({ id: 0, message: "" })
      dispatch(endGlobalLoading())
    }
  }


  return (
    <div className={cx("comment-area")}>
      <div className={cx("border")}></div>
      <div className={cx("comment-input")}>
        <img className={cx("profile-img")} src={userInfo.gender == "남" ? "icon/male.png" : "icon/female.png"} />
        <textarea 
          onChange={(e) => { setCommentMessage(e.target.value) }} 
          value={commentMessage} 
          placeholder="댓글 내용을 작성해주세요." 
        />
        <img className={cx("send")} src="icon/send.png" onClick={onClickCommentSubmit} />
      </div>
      <div className={cx("comment-list")}>
        {isLoading ? (
          <div className={cx("title")}>
            <label>댓글 불러오는중 <FitLoading /></label>
          </div>
        ) : (
          schedule.commentList != null &&
          schedule.commentList.filter(c => c.refCommentId == null).map(comment => {
            if (schedule.commentList == null) return <></>;
            const replyList = schedule.commentList.filter(c => c.refCommentId == comment.id);
            return (
              <div className={cx("root-comment")} key={comment.id}>
                <div className={cx("border")} />
                <div className={cx("comment")}>
                  <img className={cx("profile-img")} src={comment.userGender == "남" ? "icon/male.png" : "icon/female.png"} />
                  <div className={cx("value")}>
                    <div className={cx("top")}>
                      <div className={cx("name")}>{comment.userName}</div>
                      {modifyInput.id != comment.id && !comment.isDelete && (
                        <div className={cx("button-area")}>
                          {userInfo.userId == comment.userId && (
                            <>
                              <span onClick={() => { setModifyInput({ id: comment.id, message: comment.message }) }}>수정</span>/
                              <span onClick={() => { onClickDeleteSubmit(comment.id) }}>삭제</span>/
                            </>
                          )}
                          <span onClick={() => {
                            setReplyInput({ refCommentId: comment.id, refUserId: comment.userId, refUserName: comment.userName, message: "" });
                          }}>답글</span>
                        </div>
                      )}
                    </div>
                    <div className={cx("bottom")}>
                      {modifyInput.id != comment.id ? (
                        comment.isDelete
                          ? <span className={cx("delete-comment")}>삭제된 댓글입니다.</span>
                          : comment.message
                      ) : (
                        <div className={cx("modify-input")}>
                          <textarea 
                            onChange={(e) => { setModifyInput(state=>({...state, message: e.target.value})) }} 
                            value={modifyInput.message} 
                            placeholder="댓글 내용을 작성해주세요." 
                          />
                          <img className={cx("send")} src="icon/send.png" onClick={onClickModifySubmit} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {replyList.map(reply => (
                  <div key={reply.id}>
                    <div className={cx("border")} />
                    <div className={cx("comment")}>
                      <img className={cx("reply-icon")} src="icon/reply.png" />
                      <img className={cx("profile-img")} src={reply.userGender == "남" ? "icon/male.png" : "icon/female.png"} />
                      <div className={cx("value")}>
                        <div className={cx("top")}>
                          <div className={cx("name")}>{reply.userName}</div>
                          {modifyInput.id != reply.id && !reply.isDelete && (
                            <div className={cx("button-area")}>
                              {userInfo.userId == reply.userId && (
                                <>
                                  <span onClick={() => { setModifyInput({ id: reply.id, message: reply.message, refUserName: reply.refUserName }) }}>수정</span>/
                                  <span onClick={() => { onClickDeleteSubmit(reply.id) }}>삭제</span>/
                                </>
                              )}
                              <span onClick={() => {
                                setReplyInput({ refCommentId: comment.id, refUserId: reply.userId, refUserName: reply.userName, message: "" });
                              }}>답글</span>
                            </div>
                          )}
                        </div>
                        <div className={cx("bottom")}>
                          {modifyInput.id != reply.id ? (
                            reply.isDelete
                              ? <span className={cx("delete-comment")}>삭제된 답글입니다.</span>
                              : <>
                                  <span className={cx("hash-tag")}>@{reply.refUserName + " "}</span>
                                  {reply.message}
                                </>
                          ) : (
                            <div className={cx("reply-modify-input")}>
                              <textarea 
                                onChange={(e) => {
                                  setModifyInput(state => {
                                    const newMessage = e.target.value.replace(/@\S+\s*/, '');
                                    return { ...state, message: newMessage };
                                  });
                                }} 
                                value={`@${modifyInput.refUserName} ` + modifyInput.message} 
                                placeholder="댓글 내용을 작성해주세요." 
                              />
                              <img className={cx("send")} src="icon/send.png" onClick={onClickModifySubmit} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {comment.id == replyInput.refCommentId && (
                  <div className={cx("reply-input")}>
                    <div className={cx("comment-input")}>
                      <img className={cx("reply-icon")} src="icon/reply.png" />
                      <img className={cx("profile-img")} src={userInfo.gender == "남" ? "icon/male.png" : "icon/female.png"} />
                      <textarea 
                        onChange={(e) => {
                          setReplyInput(state => {
                            const newMessage = e.target.value.replace(/@\S+\s*/, '');
                            return { ...state, message: newMessage };
                          });
                        }} 
                        value={`@${replyInput.refUserName} ` + replyInput.message} 
                        placeholder="댓글 내용을 작성해주세요." 
                      />
                      <img className={cx("send")} src="icon/send.png" onClick={onClickReplySubmit} />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
  
}
