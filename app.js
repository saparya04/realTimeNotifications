require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const nodemailer = require('nodemailer');
const cors = require('cors');

const MONGO_URI = 'mongodb://localhost:27017/realTimeNotifications';

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ Error connecting to MongoDB:', err));

// Notification Schema
const notificationSchema = new mongoose.Schema({
  type: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Notification = mongoose.model('Notification', notificationSchema);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (change for production)
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Function to send Email using Nodemailer
const sendEmail = async (message) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.RECIPIENT_EMAIL) {
    console.error("❌ Email credentials not found in .env file.");
    return;
  }

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECIPIENT_EMAIL,
    subject: "New Notification Alert",
    text: `New Notification: ${message}`
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.response);
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
  }
};

// WebSocket Connection
io.on('connection', (socket) => {
  console.log('🔗 A user connected');

  // Load previous notifications
  Notification.find()
    .then((notifications) => {
      socket.emit('loadNotifications', notifications);
    })
    .catch((err) => console.error('❌ Error loading notifications:', err));

  // New notification event
  socket.on('newNotification', async (data) => {
    if (!data.message || !data.type) {
      console.error("❌ Invalid notification data received:", data);
      return;
    }

    try {
      const notification = new Notification(data);
      await notification.save();
      io.emit('notification', notification);

      // Send Email when a new notification arrives
      await sendEmail(data.message);

    } catch (err) {
      console.error('❌ Error saving notification:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔌 A user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
