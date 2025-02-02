const mongoose = require('mongoose');

// MongoDB connection string
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

// Sample notifications to seed the database
const seedData = [
  { type: 'inquiry', message: 'New inquiry for property ID 101.' },
  { type: 'booking', message: 'Booking confirmed for property ID 202.' },
  { type: 'agreement', message: 'Agreement finalized for property ID 303.' },
];

// Insert the sample data
Notification.insertMany(seedData)
  .then(() => {
    console.log('Sample notifications added successfully!');
    mongoose.connection.close(); // Close the connection
  })
  .catch((err) => {
    console.error('Error inserting seed data:', err);
    mongoose.connection.close(); // Ensure the connection closes on error
  });
