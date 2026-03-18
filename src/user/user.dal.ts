import {userDao} from "./user.dao"

export class userDal {
    public static async findByEmail(email:string){
        return userDao.findByEmail(email);
    }


    public static async createUser(payload:any){
        return userDao.createUser(payload);
    }
}
