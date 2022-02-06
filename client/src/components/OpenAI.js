import React, { useState, useEffect } from "react";
import OpenAIAPI from "react-openai-api";

const OpenAI = ({ prompt }) => {
  const apiKey =
    "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";
  const [payload, setPayload] = useState({
    prompt: "",
    maxTokens: 25,
    temperature: 0.7,
    n: 1,
  });
  const [promptText, setPromptText] = useState("");

  const submitHandler = () => {
    const pl = { ...payload, prompt: promptText };
    setPayload(pl);
  };

  const responseHandler = (res) => {
    console.log(res);
    console.log(`${promptText + res.choices[0].text}`);
  };

  useEffect(() => {
    // setPromptText(`Write a 4 line poem: \n\n${prompt}`);
    console.log("setting prompt to, ", prompt);
    // submitHandler();
  }, [prompt]);

  return (
    <div>
      {apiKey && payload.prompt && (
        <OpenAIAPI
          apiKey={apiKey}
          payload={payload}
          responseHandler={responseHandler}
        />
      )}
    </div>
  );
};

export default OpenAI;