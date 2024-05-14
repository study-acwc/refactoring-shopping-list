import * as userService from "./userService";
import * as messageService from "./messageService";

jest.mock('./messageService', () => ({
  ...jest.requireActual('./messageService'),
  sendEmail: jest.fn().mockImplementation((email, message) => {
    console.log("mock sendEmail");
  })
}));

jest.mock('./userService', () => ({
  ...jest.requireActual('./userService'),
  sendSMS: jest.fn().mockImplementation((phone, message) => {
    console.log("mock sendSMS");
  })
}));
  
describe('User Service Tests', () => {
  const user = {
    email: "test@email.com",
    phone: "012-345-6789",
  };

  test("register sends messages", () => {
    userService.register(user);
    expect(messageService.sendEmail).toHaveBeenCalled();
    expect(userService.sendSMS).toHaveBeenCalled();
  });

  test("deregister sends messages", () => {
    userService.deregister(user);
    expect(messageService.sendEmail).toHaveBeenCalled();
    expect(userService.sendSMS).toHaveBeenCalled();
  });
});
