import { Routes, Route, Link } from "react-router-dom";
import Home from "@/pages/Home";
import About from "./pages/About";

export default function App() {
  return (
    <div>
      <nav style={{ display: "flex", gap: 10 }}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </div>
  );
}