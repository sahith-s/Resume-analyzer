import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home.jsx";
import Upload from "./components/Upload.jsx";
import Analysis from "./components/Analysis.jsx";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <nav>
          {
          /* <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/upload">Upload</Link></li> */}
          {/* </ul> */}
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/analysis" element={<Analysis />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;