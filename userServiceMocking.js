export const mockSendSMS = jest.fn(() => {});
import * as userService from "./userService";
import * as messageService from "./messageService";


// messageService.sendEmail = jest.fn().mockImplementation(() => {
//     console.log("mock sendEmail"); // 호출될 때 로그를 찍음
//   });


  jest.mock('./messageService', () => {
    const actual = jest.requireActual('./messageService'); // 실제 userService 모듈의 구현을 불러옴
    return {
      ...actual,
      EMail: jest.fn().mockImplementation(() => {
        return {
            sendEmail2: jest.fn().mockImplementation((email, message) => {
            console.log("mock sendEmail2");
          })
        };
      })
    };
  });


  jest.mock('./userService', () => {
    const actual = jest.requireActual('./userService'); // 실제 userService 모듈의 구현을 불러옴
    return {
      ...actual,
      SMS: jest.fn().mockImplementation(() => {
        return {
          sendSMS2: jest.fn().mockImplementation((phone, message) => {
            console.log("mock sendSMS");
          })
        };
      })
    };
  });
  