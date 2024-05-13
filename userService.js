import * as messageService from "./messageService";

export function register(user) {
  /* DB에 회원 추가 */
  const message = "회원 가입을 환영합니다!";
  new messageService.EMail().sendEmail2(user.email, message);
  new SMS().sendSMS2(user.phone, message);
}

export function deregister(user) {
  /* DB에 회원 삭제 */
  const message = "탈퇴 처리 되었습니다.";
  new messageService.EMail().sendEmail2(user.email, message);

  new SMS().sendSMS2(user.phone, message);
}

export function sendSMS(phone, message) {
/* 문자를 보내는 코드 */
    console.log("real sendSMS"); // 호출될 때 로그를 찍음
}

export class SMS {
    sendSMS2(phone, message) {
        /* 문자를 보내는 코드 */
            console.log("real sendSMS2"); // 호출될 때 로그를 찍음
        }
}