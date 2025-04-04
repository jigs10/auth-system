// server.js (Node.js with Express)
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware

const app = express();
const port = 5000; // Or any port you prefer

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Customer Registration Route
app.post('/customer-registration', (req, res) => {
  const { firstName, lastName, email, password, type } = req.body;
  console.log('Customer Registration Data:', { firstName, lastName, email, password });
  res.json({ message: 'Customer registration data received successfully!' }); // Send a response back to the client
});

// Admin Registration Route
app.post('/admin-registration', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  console.log('Admin Registration Data:', { firstName, lastName, email, password, type });
  res.json({ message: 'Admin registration data received successfully!' });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});