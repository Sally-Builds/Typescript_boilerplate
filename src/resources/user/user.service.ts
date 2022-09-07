import userModel from "./user.model";
import User from "./user.interface";
import AuthCredentials from "@/utils/interfaces/authCredential.interface";
import {createToken} from '@/utils/token'
import HttpException from "@/utils/exceptions/httpExceptions";


class UserService {
    private UserModel = userModel


    /**
     * 
     * @param user - user data
     * @returns - newly created user
     */
    public async create (user: User): Promise<AuthCredentials | Error> {
        try {
            const newUser = await this.UserModel.create(user)

            const token = createToken(newUser)

            return {token, user: newUser}
        } catch (error:any) {
            throw new Error(error)
        }
    }

    /**
     * 
     * @param email - Users email address
     * @param password - users password
     * @returns access token and user details
     */
    public async login (email:string, password:string): Promise<AuthCredentials | Error> {
        try {
            const user = await this.UserModel.findOne({email: email})
            
            if(!user || !(await user.comparePassword(password))) {
                throw new Error('email or password is not valid')
            }

            const token = createToken(user)

            return {token, user}
        } catch (error:any) {
            throw new Error(error)
        }
    }
    
    /**
     * 
     * @param data - user details to update
     * @param id - user id to update
     * @returns - updated user details
     */
    public async update(data:User, id:string): Promise<User | Error> {
        try {
            const user = await this.UserModel.findByIdAndUpdate(id, data, {runValidators: true, new: true})

            if(!user) {
                throw new Error("No user found");
                
            }

            console.log(user)
            return user
        } catch (error:any) {
            throw new Error(error)
        }
    }
}

export default UserService