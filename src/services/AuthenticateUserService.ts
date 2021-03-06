import { getCustomRepository } from "typeorm";
import { UsersRepositories } from "../repositories/UsersRepositories";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

interface IAuthenticateRequest {
  email: string;
  password: string;
}

class AuthenticateUserService {
  async execute({email, password}: IAuthenticateRequest) {
    const usersRepositories = getCustomRepository(UsersRepositories);

    //Check if email exists
    const user = await usersRepositories.findOne({
      email,
    });

    if (!user) {
      throw new Error("Email/Password incorrect.");
    }

    //Check if password is correct
    const passwordMatch = await compare(password, user.password);
    
    if (!passwordMatch) {
      throw new Error("Email/Password incorrect.");
    }

    //Generate token
    const token = sign(
      {
        email: user.email,
      },
      "4f9b820ade1517d0ec50f0db4c9793e0",
      {
        subject: user.id,
        expiresIn: "1d",
      }
    );

    return token;  
  
  }
}

export { AuthenticateUserService };