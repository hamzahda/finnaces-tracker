import React, { useEffect, useContext, useState } from "react";
import { Tag } from "../pages/Dashboard/components/TransactionItem";
import { Response, authContext } from "./AuthenticationContext";

type TagContext = {
  tags: Tag[];
  actions: {
    refetchTags: () => Promise<void>;
  };
};
export const initialContext = {
  tags: [],
  actions: {
    refetchTags: async () => {}
  }
};
export const tagContext = React.createContext<TagContext>(initialContext);

export const TagProvider: React.FC = ({ children }) => {
  const { token } = useContext(authContext);
  const [data, setData] = useState<Tag[]>([]);
  const refetch = async () => {
    try {
      const res = await fetch("/api/tag", {
        method: "GET",
        headers: { Authorization: `${token}` }
      });
      const { data } = (await res.json()) as Response<Tag[]>;
      setData(data);
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    refetch();
  }, []);

  return (
    <tagContext.Provider
      value={{ tags: data, actions: { refetchTags: refetch } }}
    >
      {children}
    </tagContext.Provider>
  );
};
