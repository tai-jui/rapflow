import React, { useEffect } from "react";

const Line = ({ line }) => {
  let words = [];
  useEffect(() => {
    line["words"].forEach((word) => words.push(word.text));
  }, [line]);

  return <div>{words.join(" ")}</div>;
};

export default Line;
