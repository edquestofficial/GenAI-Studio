import React, { useState } from 'react'
import {
   FaCloudUploadAlt,
   FaMicrophone,
   FaBookOpen,
   FaSpinner,
   FaExclamationCircle,
   FaCheckCircle,
   FaDownload,
   FaTimesCircle,
   FaBackward,
   FaForward
} from "react-icons/fa";
import FullAnalyticsData from "./FullAnalyticsData";
import "./Upload.css";
import DashboardImage from './dashboard-graph.jpeg';
import { useNavigate } from "react-router-dom";


function Upload() {
    const [companyName, setCompanyName] = useState("");
    const [audioFile, setAudioFile] = useState(null);
    const [transcribedText, setTranscribedText] = useState("");
    const [fullAnalysisData, setFullAnalysisData] = useState(null);
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [transcriptionDone, setTranscriptionDone] = useState(false);
    const [summaryDone, setSummaryDone] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isDashboard, setIsDashboard] = useState(true);
    // const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();
   
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setAudioFile(file);
            setTranscribedText("");
            setSummary("");
            setError("");
            setTranscriptionDone(false);
            setSummaryDone(false);
        }
    };

    const handleClearFile = () => {
        setAudioFile(null);
        setTranscribedText("");
        setSummary("");
        setError("");
        setTranscriptionDone(false);
        setSummaryDone(false);
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
            setTranscribedText("");
            setSummary("");
            setError("");
            setTranscriptionDone(false);
            setSummaryDone(false);
        } else {
            setError("Only audio files are accepted.");
        }
    };

   const transcribeAudio = async () => {
  if (!audioFile) {
    setError("Please select an audio file first.");
    return;
  }

  if (!companyName.trim()) {
    setError("Please enter the company name.");
    return;
  }

  setLoading(true);
  setError("");
  setTranscriptionDone(false);
  setTranscribedText("");

  const formData = new FormData();
  formData.append("audio", audioFile);
  formData.append("companyName", companyName); // ✅ Added company name

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


  const handleSubmit = async () => {
    if (!companyName || !audioFile) {
      alert("Please enter company name and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("company_name", companyName);  
    formData.append("file", audioFile);  

    try {
      const response = await fetch("http://localhost:8000/companies/upload", {
        method: "POST",
        // headers: { "Content-Type": "application/json" },
        body: formData
      });

      if (response.ok) {
        navigate("/"); // go back to Dashboard after saving
      } else {
        console.error("Error saving project");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

      

    const generateSummary = async () => {
        if (!transcribedText) {
            setError("Please transcribe the audio first to generate a summary.");
            return;
        }

        setLoading(true);
        setError("");
        setSummaryDone(false); // Reset summaryDone at the start of the process
        setSummary(""); // Clear summary when starting new process
        try {
            const response = await fetch("http://127.0.0.1:8000/audio/summarize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: transcribedText }),
            });
            const data = await response.json();
            if (response.ok) {
            setSummary(data.general_summary);
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


    return (
  <div className="container">
    {isDashboard && (
      <div className="card dashboard-card">
        <div>
          <button
            className="btn btn-info mb-3"
            onClick={() => setIsDashboard(false)}
          >
            Go to details <FaForward />
          </button>
        </div>
        <div>
          <img src={DashboardImage} alt="Dashboard preview" />
        </div>
      </div>
    )}

    {!isDashboard && (
      <>
        <div>
          <button
            className="btn btn-info mb-3"
            onClick={() => setIsDashboard(true)}
          >
            <FaBackward /> Back
          </button>

         <div className="input-section">


  {/* Company Name */}
  <div className="company-input-container">
    <label className="company-label" htmlFor="company-name">
      Company Name:
    </label>
    <input
      id="company-name"
      type="text"
      placeholder="Enter company name"
      value={companyName}
      onChange={(e) => setCompanyName(e.target.value)}
      className="company-input-box"
    />
  </div>

  {/* Upload Box */}
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
              disabled={loading || !audioFile}
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
              disabled={loading || !transcribedText}
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
              disabled={!companyName || !audioFile}
            >
              Save Project
            </button>
          </div>

          {error && (
            <p className="error-message">
              <FaExclamationCircle /> {error}
            </p>
          )}
        </div>

        {/* Output Section */}
        <div className="output-container">
          <h2 className="output-section-title">Output Results</h2>
          <div className="output-boxes">
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

            <div className="analysis-container">
  {/* Summary */}
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

  {/* Contextual Analysis */}
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
          <FullAnalyticsData data={fullAnalysisData} />
        ) : (
          "Detailed analysis will appear here after summarization."
        )}
      </pre>
    )}
  </div>
</div>
          </div>
        </div>
      </>
    )}
  </div>
);

//     return (
//         <div className="container">

//             {isDashboard && <div className='card dashboard-card'>
//                 <div>
//                     <button className='btn btn-info mb-3' onClick={() => setIsDashboard(false)}>Go to details <FaForward /></button>
//                 </div>
//                     <div>
//                         <img src={DashboardImage} alt="Dashboard preview" />

//                     </div>
//             </div>}

            

//             {!isDashboard && <>
//             <div>
//                 <button className='btn btn-info mb-3' onClick={() => setIsDashboard(true)}><FaBackward /> Back</button>
            
//                 <label
//                     htmlFor="audio-upload"
//                     className={`upload-box ${isDragOver ? "drag-over" : ""}`}
//                     onDragOver={handleDragOver}
//                     onDragLeave={handleDragLeave}
//                     onDrop={handleDrop}
//                 >
//                     <input
//                         id="audio-upload"
//                         type="file"
//                         accept="audio/*"
//                         onChange={handleFileChange}
//                     />
//                     <FaCloudUploadAlt className="upload-icon" />
//                     <p>Drag & drop your audio file here or</p>
//                     <span className="browse-text">Browse Files</span>
//                     {audioFile && (
//                         <p className="selected-file">
//                             Selected: {audioFile.name}
//                             <FaTimesCircle
//                                 className="clear-file-icon"
//                                 onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleClearFile();
//                                 }}
//                             />
//                         </p>
//                     )}
//                 </label>

                

//                 <div className="buttons">
//                     <button
//                         onClick={transcribeAudio}
//                         disabled={loading || !audioFile}
//                         className={`button ${transcriptionDone ? "success-button" : ""
//                             } ${loading && !transcriptionDone ? "loading-button" : ""
//                             }`}
//                     >
//                         {loading && !transcriptionDone ? (
//                             <>
//                                 <FaSpinner className="spinner" /> Transcribing...
//                             </>
//                         ) : transcriptionDone ? (
//                             <>
//                                 <FaCheckCircle /> Transcribed!
//                             </>
//                         ) : (
//                             <>
//                                 <FaMicrophone /> Transcribe
//                             </>
//                         )}
//                     </button>
//                     <button
//                         onClick={generateSummary}
//                         disabled={loading || !transcribedText}
//                         className={`button ${!transcribedText ? "disabled-button" : ""
//                             } ${summaryDone ? "success-button" : ""} ${loading && !summaryDone && transcribedText
//                                 ? "loading-button"
//                                 : ""
//                             }`}
//                     >
//                         {loading && !summaryDone && transcribedText ? (
//                             <>
//                                 <FaSpinner className="spinner" /> Summarizing...
//                             </>
//                         ) : summaryDone ? (
//                             <>
//                                 <FaCheckCircle /> Summarized!
//                             </>
//                         ) : (
//                             <>
//                                 <FaBookOpen /> Summary
//                             </>
//                         )}
//                     </button>
                    
//                     <button onClick={handleSubmit} disabled={!companyName || !audioFile}>
//                         Save Project
//                     </button>
//                 </div>
//                 {error && (
//                     <p className="error-message">
//                         <FaExclamationCircle /> {error}
//                     </p>
//                 )}
//             </div>

//             <div className="output-container">
//                 <h2 className="output-section-title">Output Results</h2>
//                 <div className="output-boxes">
//                     <div className="transcription">
//                         <h2 className="box-title">
//                             Transcription
//                             <span className="download-icons">
//                                 {transcribedText && (
//                                     <FaDownload
//                                         onClick={() =>
//                                             handleDownload(
//                                                 transcribedText,
//                                                 "transcription.txt"
//                                             )
//                                         }
//                                         title="Download Transcription"
//                                     />
//                                 )}
//                             </span>
//                         </h2>
//                         {loading && !transcriptionDone && audioFile ? (
//                             <pre className="output-text loading-placeholder">
//                                 <FaSpinner className="spinner" /> Waiting for
//                                 transcription...
//                             </pre>
//                         ) : (
//                             <pre className="output-text">
//                                 {transcribedText ||
//                                     "Transcription will appear here after processing your audio file."}
//                             </pre>
//                         )}
//                     </div>

//                     <div className="inner-div card">
//                         <div className="summary">
//                             <div className="box-title">
//                                 Summary
//                                 <span className="download-icons">
//                                     {summary && (
//                                         <FaDownload
//                                             onClick={() =>
//                                                 handleDownload(summary, "summary.txt")
//                                             }
//                                             title="Download Summary"
//                                         />
//                                     )}
//                                 </span>
//                             </div>
//                             {loading && transcribedText && !summaryDone ? (
//                                 <pre className="output-text loading-placeholder">
//                                     <FaSpinner className="spinner" /> Generating
//                                     summary...
//                                 </pre>
//                             ) : (
//                                 <pre className="output-text">
//                                     {summary ||
//                                         (transcribedText
//                                             ? "Summary will be generated from the transcribed text."
//                                             : "Transcribe audio first to generate a summary.")}
//                                 </pre>
//                             )}
//                         </div>

//                         <div className="contextual-analysis">
//                             <h2 className="box-title">
//                                 Contextual Analysis
//                                 <span className="download-icons">
//                                     {fullAnalysisData && (
//                                         <FaDownload
//                                             onClick={() =>
//                                                 handleDownload(
//                                                     JSON.stringify(
//                                                         fullAnalysisData,
//                                                         null,
//                                                         2
//                                                     ),
//                                                     "full_analysis.json"
//                                                 )
//                                             }
//                                             title="Download Full Analysis"
//                                         />
//                                     )}
//                                 </span>
//                             </h2>
//                             {loading && transcribedText && !summaryDone ? (
//                                 <pre className="output-text loading-placeholder">
//                                     <FaSpinner className="spinner" /> Generating
//                                     detailed analysis...
//                                 </pre>
//                             ) : (
//                                 <pre className="output-text code-block">
//                                     {/* This line converts the JSON object to a pretty-printed string */}
//                                     {fullAnalysisData ? (
//                                         <FullAnalyticsData data={fullAnalysisData} />
//                                     ) : (
//                                         "Detailed analysis will appear here after summarization."
//                                     )}
//                                 </pre>
//                             )}
//                         </div>
//                     </div>

//                     {/* --- THIS IS THE NEW SECTION FOR FULL JSON ANALYSIS --- */}

//                     {/* --- END NEW SECTION --- */}
//                 </div>
//             </div>
//             </>}
//         </div>
//     )
}

export default Upload


