import { LoginDao } from "./login.dao";

export class LoginDal {
  public static async findUserByEmailWithPassword(email: string) {
    return LoginDao.findUserByEmailWithPassword(email);
  }
}

