import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import * as Tone from "tone";

const Beat = ({
  setMeasure,
  measure,
  running,
  res,
  time,
  setTime,
  loaded,
}) => {
  const [samplesLoaded, setSamplesLoaded] = useState(false);

  const sampler = useRef(null);
  const seq = useRef(null);

  let local_measure = measure;

  // Update local variable since callback function is not aware of React state
  const updateTime = () => {
    setTime({
      ...time,
      measure: local_measure++,
      second: Math.round(Tone.Transport.seconds * 1000),
    });
  };

  useEffect(() => {
    // console.log(
    //   "Clock is: ",
    //   Tone.Transport.seconds,
    //   ". Measure i: ",
    //   time.measure,
    //   res
    // );
  }, [res]);

  useEffect(() => {
    if (loaded && running) {
      if (samplesLoaded) {
        Tone.start();
        Tone.Transport.seconds = 0;
        Tone.Transport.start();
      }
    } else {
      local_measure = 0;
      Tone.Transport.stop();
    }
  }, [loaded, running, samplesLoaded]);

  useEffect(() => {
    Tone.Transport.bpm.value = time.bpm;
    Tone.Transport.swing = 0.12;
    sampler.current = new Tone.Sampler({
      urls: {
        "F#3": "hihat.mp3",
        C3: "kick.mp3",
        D3: "snare.mp3",
      },
      release: 1,
      baseUrl:
        "https://tonejs.github.io/audio/drum-samples/breakbeat8/",
    }).toDestination();

    Tone.loaded().then(() => {
      setSamplesLoaded(true);

      // Drums
      const sequence = new Tone.Sequence(
        (time, note) => {
          sampler.current.triggerAttackRelease(note, 0.1, time);
          // subdivisions are given as subarrays
        },
        [["C3", "F#3"], ["F#3", "F#3"], "D3", ["F#3", "F#3"]],
        "4n"
      ).start(0);
      seq.current = sequence;

      // Piano

      const synth = new Tone.Synth().toDestination();

      const loop = new Tone.Loop((time) => {
        // use the callback time to schedule events

        synth.triggerAttackRelease("D2", "1m");
        synth.triggerAttackRelease("D1", "1m", "+2m");
        updateTime();
      }, "1m").start(0);
    });
  }, []);

  return <div></div>;
};

export default Beat;
