import { userModel } from "../models/user.model";

export class LoginDao {
  public static async findUserByEmailWithPassword(email: string) {
    return userModel.findOne({ email }).select("+password");
  }
}

