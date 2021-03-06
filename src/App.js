import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [play, setPlay] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [focus, setFocus] = useState(1500);
  const [rest, setRest] = useState(300);
  const [timer, setTimer] = useState(0);
  const [resetTimer, setResetTimer] = useState(false);
  const [pause, setPause] = useState(false);
  const [startClicks, setStartClicks] = useState(0);
  const id = useRef(null);
  const beepUrl = "https://freesound.org/data/previews/80/80921_1022651-lq.mp3";

  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const handleInterval = (e) => {
    e.preventDefault();
    let countFocus = focus;
    let countRest = rest;
    if (
      e.target.getAttribute("data-place") === "focus" &&
      e.target.id === "session-increment" &&
      focus < 3600
    )
      setFocus((countFocus += 60));
    if (
      e.target.getAttribute("data-place") === "focus" &&
      e.target.id === "session-decrement" &&
      focus > 60
    )
      setFocus((countFocus -= 60));
    if (
      e.target.getAttribute("data-place") === "rest" &&
      e.target.id === "break-increment" &&
      rest < 3600
    )
      setRest((countRest += 60));
    if (
      e.target.getAttribute("data-place") === "rest" &&
      e.target.id === "break-decrement" &&
      rest > 60
    )
      setRest((countRest -= 60));
  };

  const clear = () => {
    clearInterval(id.current);
  };

  const isTimerRunnig = (e) => {
    e.preventDefault();

    if (e.target.id === "start" || e.target.id === "resume") {
      setPlay(true);
      if (pause) setPause(false);
      if (resetTimer) setResetTimer(false);
      if (e.target.id === "start") setStartClicks(startClicks + 1);
      if (timer === 0 && e.target.id === "start") setTimer(focus);
      if (timer !== 0 && e.target.id === "resume") setTimer(timer);
      if (timer === 0 && e.target.id === "resume") return;
    }

    if (e.target.id === "pause" && timer !== 0) {
      setPlay(false);
      setPause(true);
      clear();
    }
  };

  const reset = (e) => {
    e.preventDefault();
    setPlay(false);
    setResetTimer(true);
    setFocus(1500);
    setRest(300);
    setIsBreak(false);
  };

  const calculateTime = (time, from) => {
    if (from === "lengthOrBreak") return `${Math.floor(time / 60)}`;
    if (from === "realTimer")
      return `${Math.floor(time / 60)}:${
        time % 60 > 9 ? "" + (time % 60) : "0" + (time % 60)
      }`;
  };

  useEffect(() => {
    if (timer !== 0 && play === true) setTimer(timer - 1);
  }, [play]);

  useEffect(() => {
    id.current = setInterval(() => {
      setTimer((previousTime) => previousTime - 1);
    }, 1000);

    return () => clear();
  }, [timer]);

  useEffect(() => {
    if (timer === 0 && isBreak === false) {
      clear();
    }

    if (timer === 0 && startClicks > 0 && isBreak === false) {
      new Audio(beepUrl).play();
      setIsBreak(true);
      setTimer(rest);
    }

    if (timer === 0 && isBreak === true) {
      new Audio(beepUrl).play();
      setTimer(focus);
      setIsBreak(false);
    }
  }, [timer]);

  useEffect(() => {
    if (resetTimer) {
      clear();
    }
  }, [resetTimer]);

  let numOfPrevClicks = usePrevious(startClicks);
  useEffect(() => {
    if (startClicks > numOfPrevClicks && timer !== 0) {
      setTimer(focus);
    }
  }, [startClicks]);

  return (
    <div className="container">
      <div className="timer">
        <h1>Pomodoro Clock</h1>
      </div>
      <div className="timer">
        <div className="timer-display">
          <h2 id="timer-label">{!isBreak ? "Session" : "Break"}</h2>
          <h1 ref={id}>
            <span id="time-left">
              {(!play && timer === 0) || resetTimer
                ? calculateTime(focus, "realTimer")
                : !play && timer !== 0
                ? calculateTime(timer, "realTimer")
                : play
                ? calculateTime(timer, "realTimer")
                : ""}
            </span>
          </h1>
        </div>
      </div>

      <div className="controls">
        <div id="session-label" className="session-focus">
          <h3>Session Length</h3>
          <h2 id="session-length">{calculateTime(focus, "lengthOrBreak")}</h2>
          <button
            onClick={handleInterval}
            id="session-decrement"
            data-place={"focus"}
            data-interval={focus}
          >
            &lt;
          </button>
          <button
            onClick={handleInterval}
            id="session-increment"
            data-place={"focus"}
            data-interval={focus}
          >
            &gt;
          </button>
        </div>
        <div id="break-label" className="session-break">
          <h3>Break Length</h3>
          <h2 id="break-length">{calculateTime(rest, "lengthOrBreak")}</h2>
          <button
            onClick={handleInterval}
            id="break-decrement"
            data-place={"rest"}
            data-interval={rest}
          >
            &lt;
          </button>
          <button
            onClick={handleInterval}
            id="break-increment"
            data-place={"rest"}
            data-interval={rest}
          >
            &gt;
          </button>
        </div>
      </div>
      <div className="controls">
        <button onClick={isTimerRunnig} id="start">
          Start
        </button>
        <button
          disabled={resetTimer ? "disabled" : ""}
          onClick={isTimerRunnig}
          id={pause ? "resume" : "pause"}
        >
          {pause ? "Resume" : "Pause"}
        </button>
        <button id="reset" onClick={reset}>
          Reset
        </button>
      </div>
      <div className="controls">
        <small>
          made with ReactJS by{" "}
          <a href="mailto:rodrigodelbem@gmail.com">Rodrigo Del Bem</a>
        </small>
      </div>
    </div>
  );
}

export default App;
