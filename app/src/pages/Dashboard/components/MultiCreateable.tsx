import React, {
  Component,
  SyntheticEvent,
  useState,
  SetStateAction,
  Dispatch
} from "react";

import CreatableSelect from "react-select/creatable";
import { Tag } from "../components/TransactionItem";

export const MultiCreateable: React.FC<{
  values: Tag[];
  options: Tag[];
  setValue: Dispatch<SetStateAction<Tag[]>>;
}> = ({ setValue, values, options }) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleChange = (value: any, actionMeta: any) => {
    console.group("Value Changed");
    console.log(value, actionMeta);
    switch (actionMeta.action) {
      case "remove-value":
        setValue(values.filter(v => v.label !== actionMeta.removedValue.label));
        break;
      case "pop-value":
        const newValues = [...values];
        newValues.pop();
        setValue(newValues);
        break;
      case "select-option":
        setValue([...values, actionMeta.option]);
        break;
      case "clear":
        setValue([]);
        break;
    }
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
  };
  const handleInputChange = (inputValue: string) => {
    setInputValue(inputValue);
  };
  const handleKeyDown = (event: any) => {
    if (!inputValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        console.group("Value Added");
        console.log(values);
        console.groupEnd();
        setInputValue("");
        if (!values.find(v => v.label === inputValue)) {
          const tag = {
            label: inputValue
          } as Tag;
          setValue([...values, tag]);
        }
        event.preventDefault();
    }
  };

  return (
    <CreatableSelect
      inputValue={inputValue}
      options={options}
      isClearable
      isMulti
      styles={{
        control: (provided, state) => {
          return {
            ...provided,
            backgroundColor: "rgba(61,61,61)",
            border: "none",
            outlineColor: "lightblue",
            color: "#fff"
          };
        },
        option: (provided, state) => {
          console.log(state);
          return { ...provided, backgroundColor: "rgba(61,61,61)" };
        },
        menu: provided => {
          return { ...provided, backgroundColor: "rgba(61,61,61)" };
        },
        input: provided => {
          return { ...provided, color: "#fff" };
        },
        multiValue: provided => {
          return {
            ...provided,
            backgroundColor: "rgb(54, 161, 139)",
            color: "rgba(61,61,61)"
          };
        }
      }}
      onChange={handleChange}
      onInputChange={handleInputChange}
      onKeyDown={handleKeyDown}
      placeholder="Type something and press enter..."
      value={values}
    />
  );
};
