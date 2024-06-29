// socketManager.js
const { Server } = require("socket.io");

let io;

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*", // Adjust this as necessary for your setup
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("a user connected: ", socket.id);

    socket.on("disconnect", () => {
      console.log("user disconnected: ", socket.id);
    });

    // Handle user registration
    socket.on("register", (email) => {
      // Store user information as needed
      console.log(`User registered: ${email} with socket ID: ${socket.id}`);
    });

    // Handle offer
    socket.on("offer", (data) => {
      const { to, offer } = data;
      // Find recipient socket ID based on email or other identifier
      const recipientSocketId = findSocketIdByEmail(to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("offer", { from: socket.id, offer });
      }
    });

    // Handle answer
    socket.on("answer", (data) => {
      const { to, answer } = data;
      const recipientSocketId = findSocketIdByEmail(to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("answer", { from: socket.id, answer });
      }
    });

    // Handle ICE candidates
    socket.on("candidate", (data) => {
      const { to, candidate } = data;
      const recipientSocketId = findSocketIdByEmail(to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("candidate", {
          from: socket.id,
          candidate,
        });
      }
    });
  });
}

function findSocketIdByEmail(email) {
  // Implement your logic to find socket ID based on email
  // Example: return socketId stored in a database or memory
  // Here, assume `users` is an object storing socket IDs by email
  // Replace with your actual implementation
  const socketId = Object.keys(users).find((id) => users[id] === email);
  return socketId;
}

module.exports = {
  initializeSocket,
};
