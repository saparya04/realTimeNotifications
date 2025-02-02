const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

// MongoDB connection URI
const MONGO_URI = 'mongodb://localhost:27017/realTimeNotifications';

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Define the Notification schema and model
const notificationSchema = new mongoose.Schema({
  type: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const Notification = mongoose.model('Notification', notificationSchema);

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Set up Socket.io
const io = new Server(server);

// Serve a basic HTML page for testing
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Real-time notifications using Socket.io
io.on('connection', (socket) => {
  console.log('A user connected');

  // Send all previous notifications to the newly connected client
  Notification.find().then((notifications) => {
    socket.emit('loadNotifications', notifications);
  });

  // Listen for new notifications
  socket.on('newNotification', async (data) => {
    try {
      // Save the notification to the database
      const notification = new Notification(data);
      await notification.save();

      // Broadcast the notification to all connected clients
      io.emit('notification', notification);
    } catch (err) {
      console.error('Error saving notification:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
