import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

const defaultValidity = 30; // minutes

const UrlShortenerPage = ({ addShortenedUrls }) => {
  const [urls, setUrls] = useState([{ longUrl: "", validity: "", shortcode: "" }]);
  const [errors, setErrors] = useState({});

  const handleChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validate = () => {
    const newErrors = {};
    urls.forEach((url, idx) => {
      if (!url.longUrl) {
        newErrors[`longUrl${idx}`] = "Long URL required";
      } else if (!validateUrl(url.longUrl)) {
        newErrors[`longUrl${idx}`] = "Invalid URL format";
      }
      if (url.validity && (isNaN(url.validity) || url.validity <= 0)) {
        newErrors[`validity${idx}`] = "Validity must be positive integer";
      }
      if (url.shortcode && !/^[a-zA-Z0-9]{4,10}$/.test(url.shortcode)) {
        newErrors[`shortcode${idx}`] = "Shortcode must be alphanumeric 4-10 chars";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddUrl = () => {
    if (urls.length < 5) {
      setUrls([...urls, { longUrl: "", validity: "", shortcode: "" }]);
    }
  };

  const generateShortcode = () =>
    Math.random().toString(36).substring(2, 8);

  const handleSubmit = () => {
    if (!validate()) return;

    const newUrls = urls.map(({ longUrl, validity, shortcode }) => {
      const code = shortcode || generateShortcode();
      const expiry = validity
        ? new Date(Date.now() + Number(validity) * 60000)
        : new Date(Date.now() + defaultValidity * 60000);

      return { longUrl, shortcode: code, expiry: expiry.toISOString(), clicks: [] };
    });

    addShortenedUrls(newUrls);
    setUrls([{ longUrl: "", validity: "", shortcode: "" }]); // reset form
    setErrors({});
  };

  return (
    <Box p={3} maxWidth={600} mx="auto">
      <Typography variant="h4" mb={2}>URL Shortener</Typography>
      {urls.map((url, idx) => (
        <Box key={idx} mb={2}>
          <TextField
            label="Long URL"
            fullWidth
            value={url.longUrl}
            onChange={(e) => handleChange(idx, "longUrl", e.target.value)}
            error={Boolean(errors[`longUrl${idx}`])}
            helperText={errors[`longUrl${idx}`]}
          />
          <TextField
            label="Validity (minutes)"
            type="number"
            value={url.validity}
            onChange={(e) => handleChange(idx, "validity", e.target.value)}
            error={Boolean(errors[`validity${idx}`])}
            helperText={errors[`validity${idx}`]}
            sx={{mt:1}}
          />
          <TextField
            label="Preferred Shortcode (optional)"
            value={url.shortcode}
            onChange={(e) => handleChange(idx, "shortcode", e.target.value)}
            error={Boolean(errors[`shortcode${idx}`])}
            helperText={errors[`shortcode${idx}`]}
            sx={{mt:1}}
          />
        </Box>
      ))}
      {urls.length < 5 && (
        <Button onClick={handleAddUrl} variant="outlined" sx={{mb:2}}>
          Add Another URL
        </Button>
      )}
      <br />
      <Button variant="contained" onClick={handleSubmit}>Shorten URLs</Button>
    </Box>
  );
};

export default UrlShortenerPage;
