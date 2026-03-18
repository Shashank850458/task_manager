import {userModel} from "../models/user.model";

export class userDao {
    public static async findByEmail(email:string){
         return userModel.findOne({email})
    }

    public static async findById(id: string) {
        return userModel.findOne({userId: id});
    }

    public static async createUser(payload:any){
        return userModel.create(payload);
    }

    public static async updateUserRole(userId: string, newRole: string) {
        return userModel.findOneAndUpdate(
            { userId },
            { role: newRole },
            { returnDocument: 'after' }
        );
    }

    public static async findAdminByOrganization(organizationId: string) {
        return userModel.findOne({ organizationId, role: "admin" });
    }

    public static async findPendingUsersByOrganization(organizationId: string) {
        return userModel.find({ organizationId, role: "pending" });
    }
}
