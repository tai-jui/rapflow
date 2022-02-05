import logo from "./logo.svg";
import { Buffer } from "buffer";
import React, { useState } from "react";
import * as Tone from "tone";
import mic from "microphone-stream";
import "./App.css";

function App() {
  function playTone() {
    const osc = new Tone.MembraneSynth().toDestination();
    Tone.Transport.bpm.value = 80;
    // start/stop the oscillator every quarter note
    Tone.Transport.scheduleRepeat((time) => {
      osc.triggerAttackRelease("A2", "8n");
    }, "4n");
    Tone.Transport.start();
  }

  function SpeechToText(props) {
    const [response, setResponse] = useState(
      "Press 'start recording' to begin your transcription. Press STOP recording once you finish speaking."
    );

    function AudioRecorder(props) {
      const [recording, setRecording] = useState(false);
      const [micStream, setMicStream] = useState();
      const [audioBuffer] = useState(
        (function () {
          let buffer = [];
          function add(raw) {
            buffer = buffer.concat(...raw);
            return buffer;
          }
          function newBuffer() {
            console.log("resetting buffer");
            buffer = [];
          }

          return {
            reset: function () {
              newBuffer();
            },
            addData: function (raw) {
              return add(raw);
            },
            getData: function () {
              return buffer;
            },
          };
        })()
      );

      async function startRecording() {
        console.log("start recording");
        audioBuffer.reset();

        const getUserMedia = require("get-user-media-promise");

        window.navigator.mediaDevices
          .getUserMedia({ video: false, audio: true })
          .then((stream) => {
            const startMic = new mic();

            startMic.setStream(stream);
            startMic.on("data", (chunk) => {
              var raw = mic.toRaw(chunk);
              if (raw == null) {
                return;
              }
              audioBuffer.addData(raw);
            });

            setRecording(true);
            setMicStream(startMic);
          });
      }

      async function stopRecording() {
        console.log("stop recording");
        const { finishRecording } = props;

        micStream.stop();
        setMicStream(null);
        setRecording(false);

        const resultBuffer = audioBuffer.getData();

        if (typeof finishRecording === "function") {
          finishRecording(resultBuffer);
        }
      }

      return (
        <div className="audioRecorder">
          <div>
            {recording && (
              <button onClick={stopRecording}>Stop recording</button>
            )}
            {!recording && (
              <button onClick={startRecording}>
                Start recording
              </button>
            )}
          </div>
        </div>
      );
    }

    function convertFromBuffer(bytes) {
      setResponse("Converting text...");

      console.log(bytes);
    }

    return (
      <div className="Text">
        <div>
          <h3>Speech to text</h3>
          <AudioRecorder finishRecording={convertFromBuffer} />
          <p>{response}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <SpeechToText />
      <button onClick={playTone}>Play tone</button>
    </div>
  );
}

export default App;
