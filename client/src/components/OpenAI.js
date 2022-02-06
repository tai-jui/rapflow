import React, { useState, useEffect } from "react";
import OpenAIAPI from "react-openai-api";

const OpenAI = ({ prompt, setAIResponse }) => {
  const apiKey =
    "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";
  const [payload, setPayload] = useState({
    prompt: "",
    maxTokens: 20,
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
    setAIResponse(res.choices[0].text);
  };

  useEffect(() => {
    setPromptText(`Rhyme the following lines: \n\n"${prompt}`);
    if (prompt !== "") {
      submitHandler();
    }
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
