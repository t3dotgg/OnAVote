import Link from "next/link";
import React from "react";
import { trpc } from "../utils/trpc";

export default function Home() {
  const { data, isLoading } = trpc.useQuery(["questions.get-all-my-questions"]);

  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <div className="p-6 flex flex-col">
      <div className="flex flex-col">
        <div className="text-2xl font-bold">Your Questions</div>
        {data.map((question) => {
          return (
            <div className="flex flex-col my-2" key={question.id}>
              <Link href={`/question/${question.id}`}>
                <a>
                  <div key={question.id} className="">
                    {question.question}
                  </div>
                </a>
              </Link>
              <span>Created on {question.createdAt.toDateString()}</span>
            </div>
          );
        })}
      </div>
      <Link href="/create">
        <a>Create New Question</a>
      </Link>
    </div>
  );
}
