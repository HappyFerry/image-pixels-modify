import { useState, useEffect } from "react";
import testImg from "./assets/test.jpeg";
import { modifyImage, addBlue } from "./lib";
import "./App.css";

function App() {
  const [imgSrc, setImgSrc] = useState<string>();
  useEffect(() => {
    modifyImage(testImg, addBlue).then((base64Str) => {
      setImgSrc(base64Str);
    });
  }, []);
  return (
    <div className="App">
      <h2>origin image</h2>
      <img src={testImg} alt="origin image" />
      <h2>fix blue image</h2>
      <img src={imgSrc} alt="origin image" />
    </div>
  );
}

export default App;
