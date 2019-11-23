import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import {
  TransactionItem,
  TransactionList,
  Transaction,
  TransactionType
} from "./components/TransactionItem";
import {
  CreateTransaction,
  CreateTransactionData
} from "./components/CreateTransaction";
import { SubmitButton } from "../../components/SubmitButton";
import { authContext, Response } from "../../contexts/AuthenticationContext";

const Content = styled.div`
  padding: 2rem;
`;

export const DashboardPage: React.FC = () => {
  const {
    actions: { logout },
    token
  } = useContext(authContext);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/transaction", {
          method: "GET",
          headers: { Authorization: `${token}` }
        });
        const { data } = (await res.json()) as Response<Transaction[]>;
        setTransactions(data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const onCreateTransaction = async (
    transactionData: CreateTransactionData
  ) => {
    const res = await fetch("/api/transaction", {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(transactionData)
    });
    const { data: newTransaction } = (await res.json()) as Response<
      Transaction
    >;

    setTransactions([...transactions, newTransaction]);
  };

  return (
    <Content>
      <SubmitButton
        onClick={() => {
          logout();
        }}
      >
        Logout
      </SubmitButton>
      <CreateTransaction onCreateTransaction={onCreateTransaction} />
      <TransactionList>
        {transactions.map(transaction => {
          return <TransactionItem transaction={transaction} />;
        })}
      </TransactionList>
    </Content>
  );
};
