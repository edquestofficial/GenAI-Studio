import React, { useState } from "react";
import {
  FaCloudUploadAlt,
  FaMicrophone,
  FaBookOpen,
  FaSpinner,
  FaExclamationCircle,
  FaCheckCircle,
  FaDownload,
  FaTimesCircle,
} from "react-icons/fa";
import FullAnalyticsData from "./FullAnalyticsData";
import "./Upload.css";
import { useNavigate, useLocation } from "react-router-dom";

function Upload() {
  const [audioFile, setAudioFile] = useState(null);
  const [transcribedText, setTranscribedText] = useState("");
  const [fullAnalysisData, setFullAnalysisData] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [transcriptionDone, setTranscriptionDone] = useState(false);
  const [summaryDone, setSummaryDone] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const agent = location.state?.agent || null; // ✅ safe fallback

  // ---------- File Handlers ----------
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioFile(file);
      resetOutputs();
    }
  };

  const handleClearFile = () => {
    setAudioFile(null);
    resetOutputs();
    const fileInput = document.getElementById("audio-upload");
    if (fileInput) fileInput.value = "";
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file);
      resetOutputs();
    } else {
      setError("Only audio files are accepted.");
    }
  };

  const resetOutputs = () => {
    setTranscribedText("");
    setSummary("");
    setError("");
    setTranscriptionDone(false);
    setSummaryDone(false);
    setFullAnalysisData(null);
  };

  // ---------- API Calls ----------
  const transcribeAudio = async () => {
    if (!audioFile) {
      setError("Please select an audio file first.");
      return;
    }
    if (!agent?.agent_name) {
      setError("Agent info missing.");
      return;
    }

    setLoading(true);
    setError("");
    setTranscriptionDone(false);
    setTranscribedText("");

    const formData = new FormData();
    formData.append("agent_name", agent.agent_name);
    formData.append("audio", audioFile);

    try {
      const response = await fetch("http://localhost:8000/audio/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setTranscribedText(data.transcribedText);
        setTranscriptionDone(true);
      } else {
        setError(data.error || "Failed to transcribe audio.");
      }
    } catch (err) {
      setError("Network error or server unavailable during transcription.");
      console.error("Transcription error:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async () => {
    if (!transcribedText) {
      setError("Please transcribe the audio first to generate a summary.");
      return;
    }

    if (!agent?.agent_name || !agent?.agent_persona || !agent?.agent_report) {
      console.log(agent)
      setError("Agent info missing.");
      return;
    }

    setLoading(true);
    setError("");
    setSummaryDone(false);
    setSummary("");

    try {
      const response = await fetch("http://127.0.0.1:8000/audio/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: transcribedText,
          agent_name: agent.agent_name,
          agent_persona: agent.agent_persona,
          agent_report: agent.agent_report,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSummary(data.summary || "No summary found");
        setFullAnalysisData(data);
        setSummaryDone(true);
      } else {
        setError(data.error || "Failed to generate summary.");
      }
    } catch (err) {
      setError("Network error or server unavailable during summarization.");
      console.error("Summarization error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    console.log("save agent" )
    if (!transcriptionDone || !summaryDone) {
      alert("Please transcribe and summarize before saving.");
      return;
    }

    try {
      navigate(`/`);
    } catch (err) {
      console.error("Error during save redirect:", err);
    }
  };

  const handleDownload = (content, filename) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ---------- UI ----------
  return (
    <div className="container">
      {/* 🚨 Show warning if agent missing */}
      {!agent && (
        <p className="error-message">
          <FaExclamationCircle /> No agent selected. Please go back and choose an agent.
        </p>
      )}

      {/* Upload Box */}
      <div className="input-section">
        <label
          htmlFor="audio-upload"
          className={`upload-box ${isDragOver ? "drag-over" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            id="audio-upload"
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
          />
          <FaCloudUploadAlt className="upload-icon" />
          <p>Drag & drop your audio file here or</p>
          <span className="browse-text">Browse Files</span>
          {audioFile && (
            <p className="selected-file">
              Selected: {audioFile.name}
              <FaTimesCircle
                className="clear-file-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearFile();
                }}
              />
            </p>
          )}
        </label>
      </div>

      {/* Buttons */}
      <div className="buttons">
        <button
          onClick={transcribeAudio}
          disabled={loading || !audioFile || !agent}
          className={`button ${
            transcriptionDone ? "success-button" : ""
          } ${loading && !transcriptionDone ? "loading-button" : ""}`}
        >
          {loading && !transcriptionDone ? (
            <>
              <FaSpinner className="spinner" /> Transcribing...
            </>
          ) : transcriptionDone ? (
            <>
              <FaCheckCircle /> Transcribed!
            </>
          ) : (
            <>
              <FaMicrophone /> Transcribe
            </>
          )}
        </button>

        <button
          onClick={generateSummary}
          disabled={loading || !transcribedText || !agent}
          className={`button ${
            !transcribedText ? "disabled-button" : ""
          } ${summaryDone ? "success-button" : ""} ${
            loading && !summaryDone && transcribedText
              ? "loading-button"
              : ""
          }`}
        >
          {loading && !summaryDone && transcribedText ? (
            <>
              <FaSpinner className="spinner" /> Summarizing...
            </>
          ) : summaryDone ? (
            <>
              <FaCheckCircle /> Summarized!
            </>
          ) : (
            <>
              <FaBookOpen /> Summary
            </>
          )}
        </button>

        <button
          onClick={handleSubmit}
          disabled={!transcriptionDone || !summaryDone || !agent}
        >
          Save Project
        </button>
      </div>

      {error && (
        <p className="error-message">
          <FaExclamationCircle /> {error}
        </p>
      )}

      {/* Output Section */}
      <div className="output-container">
        <h2 className="output-section-title">Output Results</h2>
        <div className="output-boxes">
          {/* Transcription */}
          <div className="transcription">
            <h2 className="box-title">
              Transcription
              <span className="download-icons">
                {transcribedText && (
                  <FaDownload
                    onClick={() =>
                      handleDownload(transcribedText, "transcription.txt")
                    }
                    title="Download Transcription"
                  />
                )}
              </span>
            </h2>
            {loading && !transcriptionDone && audioFile ? (
              <div className="output-text loading-placeholder">
                <FaSpinner className="spinner" /> Waiting for transcription...
              </div>
            ) : (
              <div className="output-text">
                {transcribedText ||
                  "Transcription will appear here after processing your audio file."}
              </div>
            )}
          </div>

          {/* Summary & Analysis */}
          <div className="analysis-container">
            <div className="analysis-card">
              <div className="box-title">
                Summary
                <span className="download-icons">
                  {summary && (
                    <FaDownload
                      onClick={() => handleDownload(summary, "summary.txt")}
                      title="Download Summary"
                    />
                  )}
                </span>
              </div>
              {loading && transcribedText && !summaryDone ? (
                <pre className="output-text loading-placeholder">
                  <FaSpinner className="spinner" /> Generating summary...
                </pre>
              ) : (
                <pre className="output-text">
                  {summary ||
                    (transcribedText
                      ? "Summary will be generated from the transcribed text."
                      : "Transcribe audio first to generate a summary.")}
                </pre>
              )}
            </div>

            <div className="analysis-card">
              <div className="box-title">
                Contextual Analysis
                <span className="download-icons">
                  {fullAnalysisData && (
                    <FaDownload
                      onClick={() =>
                        handleDownload(
                          JSON.stringify(fullAnalysisData, null, 2),
                          "full_analysis.json"
                        )
                      }
                      title="Download Full Analysis"
                    />
                  )}
                </span>
              </div>
              {loading && transcribedText && !summaryDone ? (
                <pre className="output-text loading-placeholder">
                  <FaSpinner className="spinner" /> Generating detailed analysis...
                </pre>
              ) : (
                <pre className="output-text code-block">
                  {fullAnalysisData ? (
                    <FullAnalyticsData
                      data={{
                        ...fullAnalysisData,
                      }}
                    />
                  ) : (
                    "Detailed analysis will appear here after summarization."
                  )}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Upload;
