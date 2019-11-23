import React, { useState } from "react";
import { userInfo } from "os";
import { act } from "react-dom/test-utils";

export type LoginOptions = {
  email: string;
  password: string;
};
export type RegisterOptions = {
  email: string;
  password: string;
  name: string;
};

export type User = {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Response<T> = { status: "ok"; data: T };

export type LoginResponse = Response<string>;
export type RegisterResponse = Response<User>;

export type JWTTokenData = {
  id: number;
  email: string;
  iat: string;
  exp: string;
};

export type AuthContext = {
  user: User | null;
  token: string | null;
  actions: {
    login: (options: LoginOptions) => Promise<void>;
    register: (options: RegisterOptions) => Promise<void>;
    logout: () => void;
    getTokenData: () => JWTTokenData | null;
  };
};

export const initialAuthContext = {
  user: null,
  token: null,
  actions: {
    login: async () => {},
    register: async () => {},
    logout: () => {},
    getTokenData: () => {
      return null;
    }
  }
};

export const authContext = React.createContext<AuthContext>(initialAuthContext);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    window.localStorage.getItem("auth-token")
  );
  const login = async ({ email, password }: LoginOptions) => {
    try {
      const res = await fetch("/api/user/token", {
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        }),
        method: "POST"
      });
      const { data: token } = (await res.json()) as LoginResponse;
      setToken(token);
      window.localStorage.setItem("auth-token", token);
    } catch (e) {
      console.error(e);
    }
  };

  const register = async ({ email, password, name }: RegisterOptions) => {
    try {
      const res = await fetch("/api/user", {
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password,
          name
        }),
        method: "POST"
      });
      const { data: user } = (await res.json()) as RegisterResponse;
      setUser(user);
      await login({ email, password });
    } catch (e) {
      console.error(e);
    }
  };

  const logout = () => {
    window.localStorage.removeItem("auth-token");
    setUser(null);
    setToken(null);
  };

  const getTokenData = () => {
    if (token) {
      return JSON.parse(atob(token.split(".")[1])) as JWTTokenData;
    }
    return null;
  };
  return (
    <authContext.Provider
      value={{
        user,
        token,
        actions: {
          login,
          register,
          logout: logout,
          getTokenData
        }
      }}
    >
      {children}
    </authContext.Provider>
  );
};
