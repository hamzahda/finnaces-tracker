import React from "react";
import { FetchMock } from "jest-fetch-mock/types";
import {
  AuthProvider,
  authContext,
  LoginResponse,
  LoginOptions
} from "./AuthenticationContext";
import { render, fireEvent } from "@testing-library/react";

describe("AuthenticationContext", () => {
  afterEach(() => {
    (fetch as FetchMock).resetMocks();
    (fetch as FetchMock).once(JSON.stringify({})); // undefined
  });

  it("should send a request on login", () => {
    const loginResponse = {
      status: "ok",
      data: "randooooom Token"
    } as LoginResponse;
    const loginRequest = {
      email: "test@test.de",
      password: "password"
    } as LoginOptions;
    (fetch as FetchMock).mockResponseOnce(JSON.stringify(loginResponse));

    const { getByText } = render(
      <AuthProvider>
        <authContext.Consumer>
          {({ actions: { login } }) => {
            const loginFn = () => login(loginRequest);
            return <button onClick={loginFn}>login</button>;
          }}
        </authContext.Consumer>
      </AuthProvider>
    );

    const submit = getByText(/login/i);
    fireEvent.click(submit);
    console.log((fetch as FetchMock).mock.calls);

    expect((fetch as FetchMock).mock.calls.length).toBe(1);
    expect((fetch as FetchMock).mock.calls[0][0]).toBe("/api/user/token");
    expect(((fetch as FetchMock).mock.calls[0][1] as RequestInit).method).toBe(
      "POST"
    );
    expect(((fetch as FetchMock).mock.calls[0][1] as RequestInit).body).toBe(
      JSON.stringify(loginRequest)
    );

    expect(((fetch as FetchMock).mock.calls[0][1] as RequestInit).body).toBe(
      JSON.stringify(loginRequest)
    );
  });
});
