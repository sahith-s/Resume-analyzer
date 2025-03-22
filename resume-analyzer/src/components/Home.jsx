import "../styles/Home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to AI Resume Analyzer</h1>
      <p>Upload your resume and get an in-depth analysis with AI-powered insights.</p>
      <Link to="/upload" className="upload-button">Upload Resume</Link>
    </div>
  );
}

export default Home;
