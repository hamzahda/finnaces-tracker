import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";

export interface JWTUserData {
  email: string;
  name: string;
  id: number;
}

export interface JWTToken extends JWTUserData {
  iat: number;
  exp: number;
}

export class Authentication {
  /** JWT secret TODO: Should not be plaintext - add via environment variable */
  private static SECRET_KEY: string = "JWT_SECRET";

  /** JWT options */
  private static JWT_OPTIONS: jwt.SignOptions = {
    expiresIn: 3600 // in seconds
  };

  /** Number of salt rounds for hashing the password https://auth0.com/blog/hashing-in-action-understanding-bcrypt/*/
  private static SALT_ROUNDS: number = 10;

  /**
   * Generate a JWT token based on the given userdata object
   *
   * @param {object} userdata Object containing the userdata that should be included in the JWT
   * @returns {Promise<string>} JWT Token
   */
  public static async generateToken(userdata: JWTUserData): Promise<string> {
    return jwt.sign(userdata, this.SECRET_KEY, this.JWT_OPTIONS);
  }

  /**
   * Verify the given token to make sure it is valid and unchanged
   *
   * @param {string} token Token that should be checked
   * @returns {(Promise<string | object>)} JWT data
   */
  public static async verifyToken(token: string): Promise<string | object> {
    try {
      return jwt.verify(token, this.SECRET_KEY);
    } catch (e) {
      return null;
    }
  }

  /**
   * Hash the given password with bcrypt
   *
   * @param {string} password Password that should be hashed
   * @returns {Promise<string>} Hashed password
   */
  public static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Compare a plaintext password with a hashed password
   *
   * @param {string} password Plaintext password that should be checked
   * @param {string} hash Hashed password that should be compared with
   * @returns {Promise<boolean>} Flag if the password matches. True if it is a match
   */
  public static async comparePasswordWithHash(
    password: string,
    hash: string
  ): Promise<boolean> {
    try {
      const match: boolean = await bcrypt.compare(password, hash);
      if (match) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  /**
   * Middleware to verify if the given JWT is valid and a route can be accessed
   * - If JWT is missing - Return 401
   * - If Token is invalid - Return 401
   *
   * @param {Request} req Request
   * @param {Response} res Response
   * @param {NextFunction} next NextFunction
   * @returns {Promise<any>}
   */
  public static async verifyAccess(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const jwt: string = req.get("Authorization");

    // Check if the authorization header exists
    if (!jwt) {
      return res.status(401).send({ status: "unauthorized" });
    }

    // Verify the token. Returns the jwt object if valid - else null
    const validToken = await Authentication.verifyToken(jwt);
    if (!validToken) {
      return res.status(401).send({ status: "unauthorized" });
    }

    // Go to next function
    next();
  }
}
