# Real-Time Notifications System

This is a **real-time notifications system** built using **Node.js, Express, MongoDB, and Socket.io**, with email notifications powered by **Nodemailer**. The application allows users to send and receive real-time notifications via WebSockets, store them in a database, and send email alerts.

## 🚀 Features
- Real-time notifications using **Socket.io**
- Email alerts using **Nodemailer**
- MongoDB for storing notifications
- REST API for serving the frontend
- CORS-enabled for flexibility
- Uses **.env** file for configuration

## 📂 Project Structure
```
project-root/
│── index.html          # Static files (HTML, CSS)
│── .env            # Environment variables
│── seed.js       # for seeding the database with a sample data
│── package.json    # Project dependencies
│── app.js           # main file
```

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/saparya04/realTimeNotifications.git
cd realTimeNotifications
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file in the root directory and add the following:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/realTimeNotifications
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
RECIPIENT_EMAIL=recipient-email@gmail.com
```

### 4️⃣ Start the Server
```sh
npm start
```

## 📡 WebSocket Events
- `newNotification` - Send a new notification
- `notification` - Broadcasts received notifications
- `loadNotifications` - Sends previous notifications on connection

## 📧 Email Notifications
- When a new notification is sent, an **email alert** is triggered to the configured recipient email.

## 🖥️ Frontend Integration
The frontend is served from the `public` directory. Modify `public/index.html` for UI customization.

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m 'Added feature X'`)
4. Push to the branch (`git push origin feature-name`)
5. Create a Pull Request

🌟 **Star this repo** if you found it useful! 🚀

