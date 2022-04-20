import React from "react";
import { trpc } from "../utils/trpc";

import { useForm } from "react-hook-form";

const CreateQuestionForm = () => {
  const { mutate, isLoading } = trpc.useMutation("questions.create", {
    onSuccess: (data) => {},
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: any) => console.log(data);

  console.log(watch("example")); // watch input value by passing the name of it

  return (
    <div className="antialiased text-gray-100 px-6">
      <div className="max-w-xl mx-auto py-12 md:max-w-4xl">
        <h2 className="text-2xl font-bold">Reset styles</h2>
        <p className="mt-2 text-lg text-gray-300">
          These are form elements this plugin styles by default.
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="grid grid-cols-1 gap-6 col-span-2">
              <label className="block">
                <span className="text-gray-200">Question</span>
                <input
                  type="text"
                  className="form-input mt-1 block w-full text-gray-800"
                  placeholder="How do magnets work?"
                />
              </label>
            </div>
            <div className="grid grid-cols-1 gap-6 col-span-2">
              <label className="block">
                <input
                  type="submit"
                  className="form-input text-gray-900"
                  value="Create question"
                />
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const QuestionCreator: React.FC = () => {
  return <CreateQuestionForm />;
};

export default QuestionCreator;
