import React from "react";
import styled from "styled-components";
import { type } from "os";

export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense"
}

export type Tag = {
  id: string;
  label: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Transaction = {
  id: string;
  name: string;
  description: string;
  value: number;
  createdAt: Date;
  updatedAt: Date;
  tags: Tag[];
  type: TransactionType;
};

const TagList = styled.ul`
  list-style: none;
  flex-grow: 1;
  font-size: 0.8rem;

  align-self: flex-end;
  display: flex;
  & > li {
    margin-right: 0.5rem;
    padding: 0.125rem;
    border-radius: 0.25rem;
    background-color: rgb(54, 161, 139);
    display: block;
    color: #333;
  }
`;

const TransactionFlex = styled.div`
  display: flex;
  align-items: center;
`;

export const TransactionHighlight = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  display: none;
  width: 4px;
  background-color: rgb(54, 161, 139);
`;

export const TransactionItemStyle = styled.ul`
  margin: 0;
  min-height: 3rem;
  padding: 0.75rem 3rem;
  position: relative;
  &:hover {
    ${TransactionHighlight} {
      display: block;
    }
  }
`;
export const TransactionList = styled.li`
  list-style: none;
  box-shadow: 0 0.125em 0.25em 0 rgba(0, 0, 0, 0.3);
  width: 100%;
  border-radius: 0.5rem;
  background-color: rgb(45, 45, 45);
  ${TransactionItemStyle} {
    border-bottom: 1px rgba(0, 0, 0, 0.3) solid;
    &:last-of-type {
      border-bottom: 0;
    }
  }
`;

export const TransactionTitle = styled.p`
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
`;

export const TransactionDescription = styled.p`
  font-size: 0.8rem;
  margin: 0;
`;
export const TransactionDate = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: rgb(191, 191, 191);
`;

export const TransactionValue = styled.span`
  white-space: nowrap;
`;

export type TransactionItemProps = {
  transaction: Transaction;
};

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction: { name, description, createdAt, tags, value, type }
}) => {
  return (
    <TransactionItemStyle>
      <TransactionHighlight />
      <TransactionFlex>
        <div>
          <TransactionTitle>{name}</TransactionTitle>
          <TransactionDescription>{description}</TransactionDescription>
          <TransactionDate>{createdAt.toLocaleString()}</TransactionDate>
        </div>
        <TagList>
          {tags.map((tag: Tag) => {
            return <li>{tag.label}</li>;
          })}
        </TagList>

        <TransactionValue>
          {type === TransactionType.EXPENSE ? "-" : ""}€
          {(value / 100).toFixed(2)}
        </TransactionValue>
      </TransactionFlex>
    </TransactionItemStyle>
  );
};
