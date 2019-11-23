import React, { useState, useContext } from "react";
import { Form } from "../../components/Form";
import { FormItem } from "../../components/FormItem";
import { SubmitButton } from "../../components/SubmitButton";
import { routes } from "../../utils/routes";
import { Link } from "react-router-dom";
import { authContext } from "../../contexts/AuthenticationContext";

export const RegisterPage = () => {
  const {
    actions: { register }
  } = useContext(authContext);
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const onSubmit = async () => {
    console.log(email, password, name);
    await register({ email, password, name });
  };
  return (
    <Form>
      <FormItem label="Name">
        <input
          type="text"
          onChange={e => {
            setName(e.currentTarget.value);
          }}
        />
      </FormItem>
      <FormItem label="Email">
        <input
          type="email"
          onChange={e => {
            setEmail(e.currentTarget.value);
          }}
        />
      </FormItem>
      <FormItem label="Password">
        <input
          type="password"
          onChange={e => {
            setPassword(e.currentTarget.value);
          }}
        />
      </FormItem>
      <SubmitButton onClick={onSubmit}>Register</SubmitButton>
      <p>
        Back to <Link to={routes.app.login}>Login!</Link>
      </p>
    </Form>
  );
};
