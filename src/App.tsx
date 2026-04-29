import { Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import About from "./pages/About";

export default function App() {
  return (
    <div>
      {/* <nav style={{ display: "flex", gap: 10 }}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav> */}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </div>
  );
}