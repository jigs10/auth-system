// server.js (Node.js with Express)
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const conn = require('./db/conn'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const app = express();
const port = 5000; 

// CORS
app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));



// Load email configuration from environment variables
// const transporter = nodemailer.createTransport({
//   host: "smtp.ethereal.email",
//   port: 587,
//   secure: false, // true for port 465, false for other ports
//   auth: {
//     user: "maddison53@ethereal.email",
//     pass: "jn7jnAPss4f63QBp6D",
//   },
// });

// async function sendVerificationEmail(email, verificationCode) {
//   const mailOptions = {
//     from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>',
//     to: email,
//     subject: 'Verify Your Email Address',
//     html: `
//       <p>Thank you for registering!</p>
//       <p>Please use the following code to verify your email address:</p>
//       <h2>${verificationCode}</h2>
//       <p>This code will expire in 1 hour.</p>
//     `,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log(`Verification email sent to: ${email}`);
//   } catch (error) {
//     console.error('Error sending verification email:', error);
//   }
// }

// Customer Registration
app.post('/customer-registration', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  console.log('Customer Registration Data:', { firstName, lastName, email, password });

  try {
    // Email validation
    const checkEmailQuery = 'SELECT email FROM users WHERE email = $1';
    const emailCheckResult = await conn.query(checkEmailQuery, [email]);

    if (emailCheckResult.rows.length > 0) {
      return res.status(409).json({ error: 'Email address already registered.' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // verification code
    // const verificationCode = crypto.randomBytes(20).toString('hex');
    // const verificationCodeExpiry = new Date(Date.now() + 3600000); // Expires in 1 hour (3600000 ms)

    // Inserting customer data into the users table
    const insertQuery = `
      INSERT INTO users (first_name, last_name, email, password, type, is_verified)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, first_name, last_name, email;
    `;

    const customerType = 2;
    const values = [firstName, lastName, email, hashedPassword, customerType, true];
    const result = await conn.query(insertQuery, values);
    const newUser = result.rows[0];

    //  verification email
    // await sendVerificationEmail(email, verificationCode);

    console.log('Customer registered successfully, verification email sent:', newUser);
    res.status(201).json({
      message: 'Customer registered successfully!',
      user: { id: newUser.id, firstName: newUser.first_name, lastName: newUser.last_name, email: newUser.email },
    });

  } catch (error) {
    console.error('Error during customer registration:', error);
    res.status(500).json({ error: 'Failed to register customer. Please try again later.' });
  }
});

// Admin Registration
app.post('/admin-registration', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  console.log('Admin Registration Data:', { firstName, lastName, email, password });

  try {
    // Email validation
    const checkEmailQuery = 'SELECT email FROM users WHERE email = $1';
    const emailCheckResult = await conn.query(checkEmailQuery, [email]);

    if (emailCheckResult.rows.length > 0) {
      return res.status(409).json({ error: 'Email address already registered.' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // unique verification code
    // const verificationCode = crypto.randomBytes(20).toString('hex');
    // const verificationCodeExpiry = new Date(Date.now() + 3600000); // Expires in 1 hour

    // Inserting admin data into the users table
    const insertQuery = `
      INSERT INTO users (first_name, last_name, email, password, type, is_verified)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, first_name, last_name, email;
    `;

    const adminType = 1;
    const values = [firstName, lastName, email, hashedPassword, adminType, true];
    const result = await conn.query(insertQuery, values);
    const newUser = result.rows[0];

    // Verification email
    // await sendVerificationEmail(email, verificationCode);

    console.log('Admin registered successfully, verification email sent:', newUser);
    res.status(201).json({
      message: 'Admin registered successfully!',
      user: { id: newUser.id, firstName: newUser.first_name, lastName: newUser.last_name, email: newUser.email },
    });

  } catch (error) {
    console.error('Error during admin registration:', error);
    res.status(500).json({ error: 'Failed to register admin. Please try again later.' });
  }
});


app.post('/admin-login', async (req, res) => {
  const { email, password } = req.body;

  try {
    
    const query = 'SELECT id, first_name, last_name, email, password, type FROM users WHERE email = $1 AND type = 1';
    const result = await conn.query(query, [email]);
    const adminUser = result.rows[0];

   
    if (!adminUser) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // password validation
    const passwordMatch = await bcrypt.compare(password, adminUser.password);

    if (passwordMatch) {
      const tokenPayload = {
        userId: adminUser.id,
        email: adminUser.email,
        type: adminUser.type,
      };

      const secretKey = process.env.JWT_SECRET;
      if (!secretKey) {
        console.error('JWT_SECRET environment variable not set!');
        return res.status(500).json({ message: 'Server error: JWT secret not configured.' });
      }

      const token = jwt.sign(tokenPayload, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour

      // Sending token to client
      return res.status(200).json({ message: 'Admin login successful!', token });
    } else {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
  } catch (error) {
    console.error('Error during admin login:', error);
    return res.status(500).json({ message: 'Server error: Failed to login.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});