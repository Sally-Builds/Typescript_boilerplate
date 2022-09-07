import Token from "./token.interface";
import User from "@/resources/user/user.interface";

export default interface AuthCredentials {
    token: string,
    user: User
}