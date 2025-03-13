const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');


const MONGO_URI = 'mongodb://localhost:27017/realTimeNotifications';


mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));


const notificationSchema = new mongoose.Schema({
  type: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const Notification = mongoose.model('Notification', notificationSchema);

const app = express();
const server = http.createServer(app);

const io = new Server(server);


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', (socket) => {
  console.log('A user connected');
  Notification.find().then((notifications) => {
    socket.emit('loadNotifications', notifications);
  });
  socket.on('newNotification', async (data) => {
    try {
      const notification = new Notification(data);
      await notification.save();
      io.emit('notification', notification);
    } catch (err) {
      console.error('Error saving notification:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
