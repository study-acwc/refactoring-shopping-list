// import * as messageService from "./messageService";
// import * as userService from "./userService";

// messageService.sendEmail = jest.fn().mockImplementation(() => {
//     console.log("mock sendEmail"); // 호출될 때 로그를 찍음
//   });
// userService.sendSMS = jest.fn().mockImplementation(() => {
//     console.log("mock sendSMS"); // 호출될 때 로그를 찍음
//   });

// // beforeEach(() => {
// //     messageService.sendEmail.mockClear();
// //     messageService.sendSMS.mockClear();
// // });

// const user = {
//   email: "test@email.com",
//   phone: "012-345-6789",
// };

// test("register sends messages", () => {
//     userService.register(user);

//   expect(messageService.sendEmail).toHaveBeenCalled();
//   expect(messageService.sendEmail).toHaveBeenCalledWith(user.email, "회원 가입을 환영합니다!");

//   expect(userService.sendSMS).toHaveBeenCalled();
//   expect(userService.sendSMS).toHaveBeenCalledWith(user.phone, "회원 가입을 환영합니다!");
// });

// test("deregister sends messages", () => {
//     userService.deregister(user);

//   expect(messageService.sendEmail).toHaveBeenCalled();
//   expect(messageService.sendEmail).toHaveBeenCalledWith(user.email, "탈퇴 처리 되었습니다.");

//   expect(userService.sendSMS).toHaveBeenCalled();
//   expect(userService.sendSMS).toHaveBeenCalledWith(user.phone, "탈퇴 처리 되었습니다.");
// });