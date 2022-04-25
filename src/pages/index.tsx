import { PollQuestion } from "@prisma/client";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { trpc } from "../utils/trpc";

const Toast: React.FC = () => (
  <div className="absolute bottom-5 right-10 flex items-center justify-center bg-slate-50/10 p-3 rounded-md w-1/5">
    <span className="text-xs font-semibold">Link Copied to Clipboard!</span>
  </div>
);

export default function Home() {
  const [showToast, setShowToast] = React.useState(false);
  const { data, isLoading } = trpc.useQuery(["questions.get-all-my-questions"]);

  const url = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:${process.env.PORT ?? 3000}`;

  const copyToClipboard = (question: PollQuestion) => {
    navigator.clipboard.writeText(`${url}/question/${question.id}`);
    setShowToast(true);

    setTimeout(() => setShowToast(false), 2000);
  };

  if (isLoading)
    return (
      <div className="antialiased min-h-screen flex items-center justify-center">
        <p className="text-white/40">Loading...</p>
      </div>
    );

  return (
    <div className="p-6 min-h-screen w-screen items-stretch relative">
      <Head>
        <title>Home | OnAVote</title>
      </Head>
      <header className="header flex w-full justify-between">
        <h1 className="text-4xl font-bold">OnAVote</h1>
        <Link href="/create">
          <a className="bg-gray-300 rounded text-gray-800 p-4">
            Create New Question
          </a>
        </Link>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-4 md:gap-x-5 mt-10">
        {data?.map((question) => {
          return (
            <div key={question.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h1 key={question.id} className="card-title">
                  {question.question}
                </h1>
                <p className="text-sm text-white/30">
                  Created on {question.createdAt.toDateString()}
                </p>
                <div className="card-actions mt-5 items-center justify-between">
                  <Link href={`/question/${question.id}`}>
                    <a className="">View</a>
                  </Link>
                  <span
                    className="cursor-pointer"
                    onClick={() => copyToClipboard(question)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {showToast && <Toast />}
    </div>
  );
}
