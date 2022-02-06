import React, { useState, useEffect } from "react";
import Line from "./Line";

const Verse = ({ res, time }) => {
  const [lines, setLines] = useState([]);
  const [firstRes, setFirstRes] = useState(true);
  const [offset, setOffset] = useState(0);

  // Calculate delay time between clock and audio_end, by using  the first res response
  //   useEffect(() => {
  //     if (firstRes && "audio_end" in res) {
  //       console.log(time.second, res.audio_end);
  //       setOffset(time.second * 1000 - res.audio_end);
  //       console.log("Offset is", offset);
  //       setFirstRes(false);
  //     }
  //   }, [res]);

  // One useEffect creates the array of lines, which updates on changes to measure
  useEffect(() => {
    setLines([
      ...lines,
      {
        measure: time.measure,
        time: time.second,
        words: [],
      },
    ]);
  }, [time.measure]);

  // One useEffect sorts the res into the array of line objects
  useEffect(() => {
    console.log(res.words);
    for (const word of res.words) {
      for (const line of lines) {
        if (word.start < line.time) {
          console.log(word);
          line.words.push(word);
        }
      }
    }
  }, [res, lines]);

  const renderedList = lines.map((item) => {
    return <Line line={item} />;
  });

  return <div>{renderedList}</div>;
};

export default Verse;
