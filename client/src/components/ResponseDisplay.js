import React, { useEffect, useState, Fragment } from "react";

const ResponseDisplay = ({ AIResponse }) => {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    let arr = AIResponse.split("\n");
    if (arr.length === 1) {
      setDisplay(arr[0]);
    } else {
      setDisplay(`${arr[0]}<br>${arr[1]}`);
    }
  }, [AIResponse]);

  return (
    <Fragment>
      <h2 className="text-neutral-900 font-bold text-xl leading-tight">
        AI Suggestion
      </h2>
      {AIResponse.split("\n").map((line) => {
        return <div>{line}</div>;
      })}
    </Fragment>
  );
};

export default ResponseDisplay;
