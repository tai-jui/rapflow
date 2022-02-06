import React, { useState, useEffect } from "react";
import Line from "./Line";

const Verse = ({ res, time, setPrompt }) => {
  const [lines, setLines] = useState([]);
  const [finalWords, setFinalWords] = useState([]);
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
    if ("words" in res) {
      let combined = finalWords.concat(res.words);
      // wipe the words property in every line clean
      setLines(
        [...lines].map((object) => {
          return {
            ...object,
            words: [],
          };
        })
      );

      let new_lines = [];
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let next_line = lines[i + 1];
        let new_line = {
          ...line,
          words: [],
        };
        for (const word of combined) {
          if (
            word.start > line.time &&
            word.start < next_line?.time
          ) {
            new_line.words.push(word);
          }
        }

        new_lines.push(new_line);
      }

      setLines(new_lines);

      if (res.message_type === "FinalTranscript") {
        console.log("setting final words", combined);
        setFinalWords(combined);
      }

      // console.log(res);
      //   console.log(lines);
      // console.log(finalWords);
    }
  }, [res]);

  // Set the prompt for OpenAI
  useEffect(() => {
    // Get the the latest completed two lines
    let index = Math.floor((lines.length - 1) / 2);
    console.log("index:", index);
    if (index > 0) {
      let prompt = [];

      lines[index].words.forEach((word) => prompt.push(word.text));
      lines[index + 1].words.forEach((word) =>
        prompt.push(word.text)
      );

      setPrompt(prompt.join(" "));
    }
  }, [lines, time.measure]);

  const renderedList = lines.map((item) => {
    return <Line line={item} />;
  });

  return <div>{renderedList}</div>;
};

export default Verse;
