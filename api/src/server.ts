import { createConnection } from "typeorm";
/** Package imports */
import express from "express";
import "reflect-metadata";
import * as bodyParser from "body-parser";
import { globalRouter } from "./router/global.router";
import morgan from "morgan";
import { Authentication, JWTToken } from "./module/authentication";

/** Variables */
const app: express.Application = express();

/** Global middleware */
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(async (req, res, next) => {
  const jwt: string = req.get("Authorization");
  if (jwt) {
    try {
      const decodedToken = (await Authentication.verifyToken(jwt)) as JWTToken;
      req.token = decodedToken;
    } catch (e) {
      console.log(e);
    }
  } else {
    req.token = null;
  }
  next();
});

/** Routes */
app.use("/api", globalRouter);

// TODO: Add global error handler

/** Start our server */
createConnection()
  .then(() => {
    app.listen(process.env.API_PORT, () => {
      console.log(`Server is running on port ${process.env.API_PORT}...`);
    });
  })
  .catch((error: Error) => {
    console.log(error);
  });
