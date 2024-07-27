import React from "react";
import TypingTest from "./TypingTest";
import "./index.css"; // Ensure Tailwind styles are imported

const App = () => {
  return (
    <div className="App min-h-screen flex items-center justify-center bg-gray-100">
      <TypingTest />
    </div>
  );
};

export default App;
