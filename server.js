// server.js
const express = require('express');
const { body, validationResult } = require('express-validator'); // Import express-validator functions
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (e.g., the HTML form)
app.use(express.static('public'));

// Define a route to handle form submissions with server-side validation
app.post('/submit-form', 
  // Validation rules
  [
    body('fullname')
      .isLength({ min: 3 }).withMessage('Full name must be at least 3 characters long.')
      .trim().escape(), // Sanitize input
    body('email')
      .isEmail().withMessage('Please provide a valid email address.')
      .normalizeEmail(), // Normalize email
    body('phone')
      .matches(/^[0-9\-]{10,}$/).withMessage('Phone number must contain at least 10 digits and can include hyphens.'),
    body('message')
      .isLength({ min: 20 }).withMessage('Message must be at least 20 characters long.')
      .trim().escape(), // Sanitize input
  ],
  (req, res) => {
    // Check validation results
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // If there are validation errors, return them to the client
      return res.status(400).json({ errors: errors.array() });
    }

    // If no validation errors, process the form data
    const { fullname, email, phone, message } = req.body;
    console.log('Form data received:');
    console.log(`Full Name: ${fullname}`);
    console.log(`Email: ${email}`);
    console.log(`Phone: ${phone}`);
    console.log(`Message: ${message}`);

    // Send a success response
    res.send('Form submission received and validated successfully!');
  }
);

app.post('/submit-form', (req, res) => {
    const honeypot = req.body.honeypot;
    
    // If honeypot field is filled, reject the form submission
    if (honeypot) {
      return res.status(400).send('Bot detected!');
    }
  
    // Process the form if honeypot is empty (legitimate user)
    const { fullname, email, phone, message } = req.body;
    console.log('Form data received:', fullname, email, phone, message);
    
    res.send('Form submitted successfully!');
  });

  app.post('/submit-form', (req, res) => {
    const timestamp = req.body.timestamp;
    const currentTime = Date.now();
    const timeDiff = (currentTime - timestamp) / 1000; // in seconds
  
    // If the form was submitted too quickly (e.g., less than 5 seconds), reject it
    if (timeDiff < 5) {
      return res.status(400).send('Bot detected! Form submitted too quickly.');
    }
  
    // Process the form if time difference is reasonable
    const { fullname, email, phone, message } = req.body;
    console.log('Form data received:', fullname, email, phone, message);
  
    res.send('Form submitted successfully!');
  });

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
