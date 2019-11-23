import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { LoginPage } from "./LoginPage";
import { BrowserRouter } from "react-router-dom";
import {
  authContext,
  initialAuthContext
} from "../../contexts/AuthenticationContext";
describe("LoginPage", () => {
  it("renders properly", () => {
    const loginMock = jest.fn();
    const { getByLabelText, getByText, debug } = render(
      <BrowserRouter>
        <authContext.Provider
          value={{
            ...initialAuthContext,
            actions: { ...initialAuthContext.actions, login: loginMock }
          }}
        >
          <LoginPage />
        </authContext.Provider>
      </BrowserRouter>
    );
    const email = getByLabelText(/email/i);
    const password = getByLabelText(/password/i);
    const submit = getByText(/submit/i);
  });

  it("can login", () => {
    const loginMock = jest.fn();
    const { getByLabelText, getByText, debug } = render(
      <BrowserRouter>
        <authContext.Provider
          value={{
            ...initialAuthContext,
            actions: { ...initialAuthContext.actions, login: loginMock }
          }}
        >
          <LoginPage />
        </authContext.Provider>
      </BrowserRouter>
    );
    const email = getByLabelText(/email/i);
    const password = getByLabelText(/password/i);
    const submit = getByText(/submit/i);

    fireEvent.change(email, { target: { value: "test@test.de" } });
    fireEvent.change(password, { target: { value: "password" } });
    fireEvent.click(submit);

    expect(loginMock.mock.calls.length).toBe(1);
    expect(loginMock.mock.calls[0][0].email).toBe("test@test.de");
    expect(loginMock.mock.calls[0][0].password).toBe("password");
  });
});
