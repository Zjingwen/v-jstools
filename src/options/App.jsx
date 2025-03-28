import React from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import ReactDOM from "react-dom/client";
import "@public/lib/reset.css";
// import Home from './components/Home';
// import About from './components/About';
// import Contact from './components/Contact';

function Home() {
  return <>Home</>;
}
function About() {
  return <>About</>;
}
function Contact() {
  return <>Contact</>;
}

function App() {
  return (
    <HashRouter>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);