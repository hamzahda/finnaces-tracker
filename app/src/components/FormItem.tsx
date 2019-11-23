import React from "react";
import styled from "styled-components";
const FormItemHolder = styled.div`
  border-radius: 1rem;
  padding: 0.3rem 0;

  label {
    display: flex;
    flex-direction: column;
  }
  input[type="text"],
  input[type="email"],
  input[type="password"],
  input[type="number"],
  textarea {
    &:focus {
      border: 1px solid lightblue;
    }
    all: unset;
    margin-top: 0.4rem;
    padding: 0.3rem 0.5rem;
    height: 2.5rem;
    border-radius: 0.5rem;
    background-color: rgb(61, 61, 61);
  }
`;

export const FormItem: React.FC<{ label: string }> = ({ label, children }) => {
  return (
    <FormItemHolder>
      <label>
        {label}
        {children}
      </label>
    </FormItemHolder>
  );
};
