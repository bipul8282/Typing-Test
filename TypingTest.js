import React, { useState, useEffect } from "react";
import "./TypingTest.css"; // Import custom CSS for additional styles

const texts = [
  "The quick brown fox jumps over the lazy dog.",
  "Pack my box with five dozen liquor jugs.",
  "How razorback-jumping frogs can level six piqued gymnasts!",
  "Jinxed wizards pluck ivy from the big quilt.",
];

const getRandomText = () => texts[Math.floor(Math.random() * texts.length)];

const TypingTest = () => {
  const [text, setText] = useState(getRandomText());
  const [inputText, setInputText] = useState("");
  const [timer, setTimer] = useState(30); // 30 seconds timer
  const [timeLimit, setTimeLimit] = useState(30); // Time limit selected from dropdown
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [wps, setWps] = useState(0); // Words per second
  const [error, setError] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);

  useEffect(() => {
    let interval;
    if (startTime) {
      interval = setInterval(() => {
        const currentTime = Math.floor((Date.now() - startTime) / 1000);
        setElapsedTime(currentTime);
        setTimer(timeLimit - currentTime);
      }, 1000);
    }

    if (timer <= 0 && startTime) {
      handleTestCompletion();
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [startTime, timer, timeLimit]);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputText(value);

    if (!startTime) {
      setStartTime(Date.now());
    }

    setError(value !== text.substring(0, value.length));
  };

  const handleTestCompletion = () => {
    setTestCompleted(true);

    const wordsTyped = inputText.trim().split(/\s+/).length;
    const timeInMinutes = elapsedTime / 60;
    const typingSpeed = (wordsTyped / timeInMinutes).toFixed(2);
    const wordsPerSecond = (wordsTyped / elapsedTime).toFixed(2);
    setSpeed(typingSpeed);
    setWps(wordsPerSecond);
  };

  const resetTest = () => {
    setText(getRandomText());
    setInputText("");
    setTimer(timeLimit);
    setStartTime(null);
    setElapsedTime(0);
    setSpeed(0);
    setWps(0);
    setError(false);
    setTestCompleted(false);
  };

  const handleTimeLimitChange = (e) => {
    const newTimeLimit = parseInt(e.target.value);
    setTimeLimit(newTimeLimit);
    setTimer(newTimeLimit);
    resetTest();
  };

  const getHighlightedText = () => {
    const textParts = text.split("");
    const inputParts = inputText.split("");
    return textParts.map((char, index) => {
      if (inputParts[index] === char) {
        return (
          <span key={index} className="correct">
            {char}
          </span>
        );
      } else if (index < inputParts.length) {
        return (
          <span key={index} className="incorrect">
            {char}
          </span>
        );
      }
      return (
        <span key={index} className="text-gray-700">
          {char}
        </span>
      );
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Typing Test
      </h1>
      <div className="mb-6">
        <p className="text-lg text-gray-600 mb-2">Type the text below:</p>
        <div className="text-display bg-gray-200 p-4 border border-gray-300 rounded">
          {getHighlightedText()}
        </div>
      </div>
      <textarea
        value={inputText}
        onChange={handleChange}
        className={`w-full p-3 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-lg shadow-sm transition-transform duration-300 transform ${
          testCompleted ? "bg-gray-100" : ""
        }`}
        rows="5"
        disabled={testCompleted}
        placeholder="Start typing..."
      />
      <div className="mt-4 text-center">
        <label className="block text-gray-700 text-lg font-semibold mb-2">
          Select Time Limit:
        </label>
        <select
          onChange={handleTimeLimitChange}
          value={timeLimit}
          className="mb-4 p-2 border border-gray-300 rounded"
        >
          <option value="30">30 seconds</option>
          <option value="60">60 seconds</option>
          <option value="90">90 seconds</option>
        </select>
        <p className="text-xl font-semibold">
          Time left:{" "}
          <span
            className={`countdown ${
              timer <= 5 ? "text-red-500" : "text-gray-700"
            }`}
          >
            {timer} seconds
          </span>
        </p>
        {testCompleted && (
          <>
            <p className="mt-4 text-xl font-semibold animate__animated animate__fadeIn">
              Your typing speed:{" "}
              <span className="text-blue-600">{speed} WPM</span>
            </p>
            <p className="mt-2 text-xl font-semibold animate__animated animate__fadeIn">
              Words per second:{" "}
              <span className="text-green-600">{wps} WPS</span>
            </p>
          </>
        )}
        <button
          onClick={resetTest}
          className={`mt-4 px-6 py-3 ${
            testCompleted ? "bg-green-500" : "bg-blue-500"
          } text-white font-semibold rounded-lg shadow-md hover:${
            testCompleted ? "bg-green-600" : "bg-blue-600"
          } transition-all duration-300`}
        >
          {testCompleted ? "Restart" : "Start Test"}
        </button>
        <div className="mt-4">
          <div className="relative w-full bg-gray-300 rounded-full h-4">
            <div
              className="absolute top-0 left-0 bg-blue-500 h-4 rounded-full"
              style={{ width: `${(inputText.length / text.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingTest;
