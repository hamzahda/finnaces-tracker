import React, { useState, SyntheticEvent, useContext } from "react";
import { FormItem } from "../../components/FormItem";
import { Form } from "../../components/Form";
import { SubmitButton } from "../../components/SubmitButton";
import { Link } from "react-router-dom";
import { routes } from "../../utils/routes";
import { authContext } from "../../contexts/AuthenticationContext";

export const LoginPage: React.FC = () => {
  const {
    actions: { login }
  } = useContext(authContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onSubmitForm = async (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await login({ email, password });
  };
  return (
    <Form>
      <FormItem label="Email">
        <input
          type="email"
          onChange={e => setEmail(e.currentTarget.value)}
          value={email}
        />
      </FormItem>
      <FormItem label="Password">
        <input
          type="password"
          onChange={e => setPassword(e.currentTarget.value)}
          value={password}
        />
      </FormItem>
      <SubmitButton onClick={onSubmitForm}>submit</SubmitButton>
      <p>
        Have no account? <Link to={routes.app.register}>Register!</Link>
      </p>
    </Form>
  );
};
