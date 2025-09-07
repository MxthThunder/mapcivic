const express = require('express');
// Use node-fetch in a way compatible with both CommonJS and ESM
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cors = require('cors');
const app = express();
const PORT = 5000;

// Enable CORS for all origins (or restrict to React app if needed)
app.use(cors());

app.get('/traffic', async (req, res) => {
  const { origin, destination, apiKey } = req.query;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&departure_time=now&key=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.error_message) {
      console.error('Google API error:', data.error_message);
    }
    res.json(data);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Failed to fetch traffic data', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
