import React, { useEffect, useState, useRef } from "react";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";

const Recorder = ({ setMsg, running, setRes, setLoaded }) => {
  const socket = useRef(null);
  const recorder = useRef(null);

  useEffect(() => {
    const run = async () => {
      if (!running) {
        if (socket.current) {
          socket.current.send(
            JSON.stringify({ terminate_session: true })
          );

          socket.current.close();
          socket.current = null;
        }

        if (recorder.current) {
          recorder.current.pauseRecording();
          recorder.current = null;
        }
      } else {
        const response = await fetch("http://localhost:8000"); // get temp session token from server.js (backend)
        const data = await response.json();

        if (data.error) {
          alert(data.error);
        }

        const { token } = data;

        // establish wss with AssemblyAI (AAI) at 16000 sample rate
        socket.current = await new WebSocket(
          `wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`
        );

        setLoaded(true);

        // handle incoming messages to display transcription to the DOM
        const texts = {};
        socket.current.onmessage = (message) => {
          let msg = "";
          const res = JSON.parse(message.data);
          texts[res.audio_start] = res.text;
          const keys = Object.keys(texts);
          keys.sort((a, b) => a - b);
          // console.log(res);
          setRes(res);
          for (const key of keys) {
            if (texts[key]) {
              msg += ` ${texts[key]}`;
            }
          }
          setMsg(msg);
        };

        socket.current.onerror = (event) => {
          console.error(event);
          socket.current.close();
        };

        socket.current.onclose = (event) => {
          console.log(event);
          socket.current = null;
        };

        socket.current.onopen = () => {
          // once socket is open, begin recording
          setMsg("");
          navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
              recorder.current = new RecordRTC(stream, {
                type: "audio",
                mimeType: "audio/webm;codecs=pcm", // endpoint requires 16bit PCM audio
                recorderType: StereoAudioRecorder,
                timeSlice: 250, // set 250 ms intervals of data that sends to AAI
                desiredSampRate: 16000,
                numberOfAudioChannels: 1, // real-time requires only one channel
                bufferSize: 4096,
                audioBitsPerSecond: 128000,
                ondataavailable: (blob) => {
                  const reader = new FileReader();
                  reader.onload = () => {
                    const base64data = reader.result;

                    // audio data must be sent as a base64 encoded string
                    if (socket.current) {
                      socket.current.send(
                        JSON.stringify({
                          audio_data: base64data.split("base64,")[1],
                        })
                      );
                    }
                  };
                  reader.readAsDataURL(blob);
                },
              });

              recorder.current.startRecording();
            })
            .catch((err) => console.error(err));
        };
      }
      console.log(running, socket.current);
    };

    run();
  }, [running]);

  return null;
};
export default Recorder;
