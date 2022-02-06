import React, { useState, useCallback, useEffect } from "react";

import Recorder from "./components/Recorder";
import Verse from "./components/Verse";

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
    bpm: 105,
    measure: 0,
  });

  const buttonHandler = () => {
    setRunning((current) => !current);
  };

  useEffect(() => {
    setLines([...lines, msg.substring(prevMsg.length)]);
    setPrevMsg(msg);
    // setMsg("");
  }, [time.measure]);

  return (
    <div class="real-time-interface">
      <p id="real-time-title" className="real-time-interface__title">
        Click start to begin recording!
      </p>
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
      <p>{time.measure}</p>
      <p
        onClick={buttonHandler}
        id="button"
        className="real-time-interface__button"
      >
        {running ? "Stop" : "Start"}
      </p>
      <div id="message" className="real-time-interface__message">
        <Verse lines={lines} res={res} time={time} />
      </div>
    </div>
  );
}

export default App;
