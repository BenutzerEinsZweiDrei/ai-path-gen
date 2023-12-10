"use client";
import { OpenAI } from "openai";
import { useEffect, useState } from "react";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

async function makeChatRequest(promptInput) {
  return openai.chat.completions.create({
    messages: [{ role: "system", content: promptInput }],
    model: "gpt-3.5-turbo",
  });
}
async function getResult(languages, frameworks) {
  let prompt = `Give me the JSON for an array object called "paths" containing 10 learning paths that suggest user for learning new programming skills which are related to what he knows. Paths should be in the form of objects which have title, description and skills (new or old) as keys. The user knows [${languages}] language(s).`;

  if (frameworks) {
    prompt += ` The user knows [${frameworks}] frameworks.`;
  }

  return await makeChatRequest(prompt)
    .then((res) => {
      return res.choices[0].message.content;
    })
    .catch((err) => {
      console.log(err);
    });
}

function Loading() {
  return (
    <div
      className="flex flex-col items-center h-full gap-10 justify-center w-full"
      id="mainContent"
    >
      <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
        Getting data from OpenAI
      </h1>

      <div className="w-full max-w-3xl h-1 rounded-full bg-gradient-to-r from-sky-500 via-purple-500 to-sky-500 bg-[length:200%] loading-animation"></div>
      <div className="flex flex-col gap-2">
        <p className="text-center text-gray-500 dark:text-gray-400 max-w-3xl">
          {" "}
          Do not refresh the page
        </p>
        <p className="text-center text-gray-500 dark:text-gray-400 max-w-3xl">
          {" "}
          This usually take a while (around 30 seconds). But may take upto 2
          minutes.
        </p>
      </div>
    </div>
  );
}

function Result({ paths }) {
  return (
    <div className="text-center text-gray-500 dark:text-gray-400 max-w-3xl h-full overflow-scroll flex flex-col gap-8">
      {paths.map((path, index) => (
        <div
          className="flex flex-col max-w-3xl w-full gap-2 bg-gray-200 p-4 rounded-xl border border-gray-400"
          key={index}
        >
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
            {path.title}
          </h1>
          <p className="text-center text-gray-500 dark:text-gray-400 max-w-3xl">
            {path.description}
          </p>
          <div className="flex gap-2 justify-center">
            {path.skills.map((skill, index) => (
              <p
                className="bg-gray-100 border border-gray-300 dark:bg-neutral-800 px-2 py-1 rounded-lg text-gray-700 dark:text-gray-300 max-w-3xl"
                key={index}
              >
                {skill}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (sessionStorage.getItem("userKnowledge")) {
      const userKnowledge = JSON.parse(sessionStorage.getItem("userKnowledge"));

      getResult(userKnowledge.lang, userKnowledge.framework).then((result) => {
        if (JSON.parse(result)) {
          setData(JSON.parse(result).paths);
        }
      });
    }
  }, []);

  return (
    <main className=" max-w-7xl mx-auto px-8 sm:px-16 w-screen">
      <div className="flex flex-col items-center h-full gap-10 justify-center">
        {data ? <Result paths={data} /> : <Loading />}
      </div>
    </main>
  );
}
