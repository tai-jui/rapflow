import React, { useState, useEffect } from "react";

import Recorder from "./components/Recorder";
import Verse from "./components/Verse";
import OpenAI from "./components/OpenAI";
import ResponseDisplay from "./components/ResponseDisplay";

import "./App.css";
import Beat from "./components/Beat";

function App() {
  const [msg, setMsg] = useState("");
  const [res, setRes] = useState({ words: [] });
  const [prevMsg, setPrevMsg] = useState("");
  const [measure, setMeasure] = useState(0);
  const [lines, setLines] = useState([]);
  const [running, setRunning] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [time, setTime] = useState({
    second: 0,
    bpm: 90,
    measure: 0,
  });
  const [prompt, setPrompt] = useState("");
  const [AIResponse, setAIResponse] = useState("");

  const buttonHandler = () => {
    setRunning((current) => !current);
    if (running) {
      setTime({
        ...time,
        measure: 0,
      });
    }
  };

  useEffect(() => {
    setLines([...lines, msg.substring(prevMsg.length)]);
    setPrevMsg(msg);
    // setMsg("");
  }, [time.measure]);

  return (
    <div className="container mx-auto max-w-3xl">
      <div className="flex flex-col justify-center mx-auto mt-32 items-center">
        <h1 className="text-dark text-center font-bold text-6xl">
          Rapflow
        </h1>
        <h2 className="text-neutral-900 text-center font-bold text-xl leading-tight mt-5">
          Your AI rap buddy. <br></br>Never run out of ideas again.
        </h2>
        <Recorder
          setMsg={setMsg}
          running={running}
          setRes={setRes}
          setLoaded={setLoaded}
        />
        <Beat
          setMeasure={setMeasure}
          measure={measure}
          running={running}
          res={res}
          setTime={setTime}
          time={time}
          loaded={loaded}
        />
        <button
          onClick={buttonHandler}
          id="button"
          className="text-center bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-3  rounded-full mt-5"
        >
          {running ? "Stop" : "Start"}
        </button>
        <div className="shadow p-8 w-4/5 mt-3">
          <ResponseDisplay AIResponse={AIResponse} />
        </div>
        <div className="shadow p-8 w-4/5 mt-10">
          <Verse
            lines={lines}
            res={res}
            time={time}
            setPrompt={setPrompt}
            running={running}
          />
        </div>
        <OpenAI prompt={prompt} setAIResponse={setAIResponse} />
      </div>
    </div>
  );
}

export default App;
