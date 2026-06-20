import express from "express";
import cors from "cors"

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Twitter Spaces Backend' });
});

// Error handling
app.use((err:any, req:any, res:any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
