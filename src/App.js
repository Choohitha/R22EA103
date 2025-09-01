
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";
import UrlShortenerPage from "./pages/UrlShortenerPage";
import StatisticsPage from "./pages/StatisticsPage";

const RedirectHandler = ({ shortenedUrls, addClick }) => {
  const { shortcode } = useParams();
  const urlEntry = shortenedUrls.find(u => u.shortcode === shortcode);

  if (urlEntry) {
    const now = new Date();
    if (now <= new Date(urlEntry.expiry)) {
      addClick(shortcode, {
        timestamp: new Date().toISOString(),
        source: document.referrer || "direct",
        location: "Unknown"
      });
      setTimeout(() => {
        window.location.href = urlEntry.longUrl;
      }, 500);
      return <p>Redirecting to {urlEntry.longUrl}...</p>;
    } else {
      return <p>URL expired.</p>;
    }
  }
  return <p>Invalid shortcode.</p>;
};

function App() {
  const [shortenedUrls, setShortenedUrls] = useState([]);

  const addShortenedUrls = (newUrls) => {
    const existingCodes = new Set(shortenedUrls.map(u => u.shortcode));
    const uniqueNewUrls = newUrls.filter(u => !existingCodes.has(u.shortcode));
    setShortenedUrls(prev => [...prev, ...uniqueNewUrls]);
  };

  const addClick = (shortcode, clickData) => {
    setShortenedUrls(prev =>
      prev.map(u =>
        u.shortcode === shortcode
          ? { ...u, clicks: [...(u.clicks || []), clickData] }
          : u
      )
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<UrlShortenerPage addShortenedUrls={addShortenedUrls} />} />
        <Route path="/statistics" element={<StatisticsPage shortenedUrls={shortenedUrls} />} />
        <Route path="/:shortcode" element={<RedirectHandler shortenedUrls={shortenedUrls} addClick={addClick} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
