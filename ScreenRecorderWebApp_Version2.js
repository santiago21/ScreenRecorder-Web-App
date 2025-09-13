import React, { useRef, useState } from "react";

function ScreenRecorderWebApp() {
  const [recording, setRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [videoURL, setVideoURL] = useState("");
  const videoRef = useRef(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
    setMediaStream(stream);
    const recorder = new window.MediaRecorder(stream);
    setMediaRecorder(recorder);
    setRecording(true);
    setChunks([]);
    recorder.ondataavailable = (e) => setChunks((prev) => prev.concat(e.data));
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      setVideoURL(URL.createObjectURL(blob));
      stream.getTracks().forEach(track => track.stop());
    };
    recorder.start();
  };

  const stopRecording = () => {
    if (mediaRecorder) mediaRecorder.stop();
    setRecording(false);
  };

  return (
    <div style={{ margin: 40 }}>
      <h1>Screen Recorder Web App</h1>
      {!recording && (
        <button onClick={startRecording}>Start Recording</button>
      )}
      {recording && (
        <button onClick={stopRecording}>Stop Recording</button>
      )}
      {videoURL && (
        <div>
          <h2>Preview:</h2>
          <video src={videoURL} controls ref={videoRef} width="480" />
          <br />
          <a href={videoURL} download="recording.webm">Download Video</a>
        </div>
      )}
      <div style={{ marginTop: 30 }}>
        <h2>Tips:</h2>
        <ul>
          <li>Click "Start Recording" and select which screen or window to record.</li>
          <li>Recording includes system audio if allowed by browser.</li>
          <li>Click "Stop Recording" to finish.</li>
        </ul>
      </div>
    </div>
  );
}

export default ScreenRecorderWebApp;