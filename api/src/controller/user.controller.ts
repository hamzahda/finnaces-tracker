import { Request, Response, NextFunction } from "express";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Repository, getRepository } from "typeorm";
import { validate } from "class-validator";
import { User } from "../entity/User";
import { Authentication } from "../module/authentication";

export class UserController {
  /**
   * Query a list of users from an external api
   * TODO: Error handling if api response fails
   * TODO: Type for api response
   *
   * @param {Request} req Request
   * @param {Response} res Response
   * @param {NextFunction} next NextFunction
   * @returns {Promise<any>}
   */
  public static async getUsersFromExternalApi(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const requestOptions: AxiosRequestConfig = {
      method: "get",
      url: "https://jsonplaceholder.typicode.com/users",
      responseType: "json"
    };
    const apiResponse: AxiosResponse = await axios.request(requestOptions);
    const users: any[] = apiResponse.data.map(user => {
      return {
        id: user.id,
        name: user.name,
        email: user.email
      };
    });
    res.send({ status: "ok", data: users });
  }

  /**
   * Create a new user
   *
   * @param {Request} req Request
   * @param {Response} res Response
   * @param {NextFunction} next NextFunction
   * @returns {Promise<any>}
   */
  public static async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    let { email, name, password } = req.body;
    const userRepository: Repository<User> = getRepository(User);
    // Check if user already exists
    const user: User = await userRepository.findOne({
      where: {
        email: email
      }
    });

    if (user) {
      res.status(400).send({ status: "bad_request" });
      return;
    }

    // Generate hashed password
    const hashedPassword: string = await Authentication.hashPassword(password);

    let newUser = new User();
    newUser.email = email;
    newUser.name = name;
    newUser.password = hashedPassword;

    const errors = await validate(newUser);
    if (errors.length > 0) {
      res.status(400).send({ status: "bad_request" });
      return;
    }

    const createdUser: User = await userRepository.save(newUser);

    // Make sure to not return the hashed password
    delete createdUser.password;

    res.send({ status: "ok", data: createdUser });
  }

  /**
   * Login a user by creating a valid JWT token
   * Returns 401 if anything fails
   * - Check if user exists
   * - Check if password matches
   * - Generate token
   *
   * @param {Request} req Request
   * @param {Response} res Response
   * @param {NextFunction} next NextFunction
   * @returns {Promise<any>}
   */
  public static async loginUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    let { email, password } = req.body;
    const userRepository: Repository<User> = getRepository(User);
    // Check if user exists
    const user: User = await userRepository.findOne({
      select: ["password", "email", "name", "id"],
      where: {
        email: email
      }
    });

    // If the user doesn't exist we stop
    if (!user) {
      res.status(401).send({ status: "unauthorized " });
      return;
    }

    const matchingPasswords: boolean = await Authentication.comparePasswordWithHash(
      password,
      user.password
    );
    if (!matchingPasswords) {
      res.status(401).send({ status: "unauthorized" });
      return;
    }

    const token: string = await Authentication.generateToken({
      id: user.id,
      email: user.email,
      name: user.name
    });

    res.send({ status: "ok", data: token });
  }
}
