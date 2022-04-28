import { PollQuestion, Prisma, Vote } from "@prisma/client";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const QuestionsPageContent: React.FC<{ id: string }> = ({ id }) => {
  const { data } = trpc.useQuery(["questions.get-by-id", { id }]);
  let totalVotes = 0;

  const { mutate, data: voteResponse } = trpc.useMutation(
    "questions.vote-on-question",
    {
      onSuccess: () => {
        voteResponse?.map((choice: { _count: number }) => {
          totalVotes += choice._count;
        });
        window.location.reload();
      },
    }
  );

  if (!data || !data?.question) {
    return <div>Question not found</div>;
  }

  const getTotalVotes = (votes: any) => {
    votes?.map((choice: { _count: number }) => {
      totalVotes += choice._count;
    });
  };

  const getPercent = (voteCount: any) => {
    if (voteCount !== undefined && totalVotes > 0)
      return (voteCount / totalVotes) * 100;
    else if (voteCount == undefined) return 0;
  };

  if (data && data != undefined) getTotalVotes(data.votes);

  return (
    <div className="p-6 min-h-screen w-screen container">
      <Head>
        <title>Question | OnAVote</title>
      </Head>
      <header className="flex w-full justify-between mb-10 items-center">
        <Link href={"/"}>
          <h1 className="text-4xl font-bold cursor-pointer">OnAVote</h1>
        </Link>
        {data?.isOwner && (
          <div className="bg-gray-700 rounded-md p-3">You made this!</div>
        )}
      </header>

      <main className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-10 text-center">
          {data?.question?.question}
        </h1>

        <div className="flex flex-col gap-4">
          {(data?.question?.options as string[])?.map((option, index) => {
            if (data?.isOwner || data?.vote) {
              return (
                <div key={index}>
                  <div className="flex justify-between">
                    <p className="font-bold">{(option as any).text}</p>
                    <p>
                      {getPercent(data?.votes?.[index]?._count)?.toFixed()}%
                    </p>
                  </div>
                  <progress
                    className="progress progress-secondary w-full"
                    value={data?.votes?.[index]?._count ?? 0}
                    max={totalVotes}
                  ></progress>
                </div>
              );
            }

            return (
              <button
                onClick={() =>
                  mutate({ questionId: data.question!.id, option: index })
                }
                key={index}
                className="btn btn-outline"
              >
                {(option as any).text}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};

const QuestionPage = () => {
  const { query } = useRouter();
  const { id } = query;

  if (!id || typeof id !== "string") {
    return <div>No ID</div>;
  }

  return <QuestionsPageContent id={id} />;
};

export default QuestionPage;
