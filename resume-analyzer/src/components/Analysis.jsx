import React, { useEffect, useState } from "react";
import "../styles/Analysis.css";  // 


const Analysis = () => {
  const [analysisReport, setAnalysisReport] = useState("");

  useEffect(() => {
    // Fetch the stored analysis report from local storage
    const report = localStorage.getItem("analysisReport");
    if (report) {
      setAnalysisReport(report);
    }
  }, []);

  return (
    <div className="analysis-container">
      <h1>Resume Analysis Report</h1>
      {analysisReport ? (
        <div className="analysis-content">
          <pre>{analysisReport}</pre>
        </div>
      ) : (
        <p>No analysis available. Please upload a resume first.</p>
      )}
    </div>
  );
};

export default Analysis;