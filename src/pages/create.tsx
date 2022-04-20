import React from "react";
import { trpc } from "../utils/trpc";

const QuestionCreator: React.FC = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const client = trpc.useContext();
  const { mutate, isLoading } = trpc.useMutation("questions.create", {
    onSuccess: (data) => {
      console.log("did we succeed?", data);
      client.invalidateQueries(["questions.get-all-my-questions"]);
      if (!inputRef.current) return;
      inputRef.current.value = "";
    },
  });

  return (
    <input
      ref={inputRef}
      disabled={isLoading}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          console.log("enter!!!", event.currentTarget.value);
          mutate({ question: event.currentTarget.value });
        }
      }}
    ></input>
  );
};

export default QuestionCreator;
