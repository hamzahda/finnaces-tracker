import React, { useState, SyntheticEvent, useContext } from "react";
import styled from "styled-components";
import { TransactionType, Tag } from "./TransactionItem";
import { Form } from "../../../components/Form";
import { FormItem } from "../../../components/FormItem";
import { SubmitButton } from "../../../components/SubmitButton";
import { MultiCreateable } from "./MultiCreateable";
import { tagContext } from "../../../contexts/TagContext";

export type CreateTransactionData = {
  name: string;
  description: string;
  value: number;
  type: TransactionType;
  tags: Tag[];
};

export type CreateTransactionProps = {
  onCreateTransaction: (data: CreateTransactionData) => void;
};

export const CreateTransaction: React.FC<CreateTransactionProps> = ({
  onCreateTransaction
}) => {
  const {
    tags: options,
    actions: { refetchTags }
  } = useContext(tagContext);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [isExpense, setIsExpense] = useState<boolean>(true);
  const [tags, setTags] = useState<Tag[]>([]);

  const onSubmit = (e: SyntheticEvent<HTMLButtonElement>) => {
    onCreateTransaction({
      name,
      description,
      value: parseFloat(value) * 100,
      type: isExpense ? TransactionType.EXPENSE : TransactionType.INCOME,
      tags
    });
  };

  return (
    <Form>
      <FormItem label="Name">
        <input
          type="text"
          value={name}
          onChange={e => {
            setName(e.currentTarget.value);
          }}
        />
      </FormItem>
      <FormItem label="Value">
        <input
          type="number"
          value={value}
          onChange={e => {
            setValue(e.currentTarget.value);
          }}
        />
      </FormItem>
      <FormItem label="Description">
        <textarea
          value={description}
          onChange={e => {
            setDescription(e.currentTarget.value);
          }}
        ></textarea>
      </FormItem>
      <FormItem label="Is Expense">
        <input
          type="checkbox"
          checked={isExpense}
          onChange={e => {
            setIsExpense(e.currentTarget.checked);
          }}
        />
      </FormItem>
      <FormItem label="Tags">
        <MultiCreateable
          values={tags}
          options={options}
          setValue={setTags}
        ></MultiCreateable>
      </FormItem>
      <SubmitButton type="submit" onClick={onSubmit}>
        Submit
      </SubmitButton>
      {/*<Tags></Tags>*/}
    </Form>
  );
};
