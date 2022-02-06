import React from "react";

const Line = ({ line }) => {
  let lines = [];
  line.words.forEach((word) => lines.push(word.text));
  return <div>{lines.join(" ")}</div>;
};

export default Line;
