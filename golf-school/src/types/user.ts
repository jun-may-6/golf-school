export type userInfo = {
  userId:string;
  name:string;
  email:string;
  joinDate:Date;
  leaveDate:Date|null;
  birthday:Date;
  gender:string;
  accessLevel:string;
  profileImagePath:string|null;
}