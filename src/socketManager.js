// socketManager.js
const { Server } = require("socket.io");
const User = require("./src/models/userModel"); // Import user model

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

    socket.on("register", async (email) => {
      try {
        // Update user's socket ID in the database
        await User.findOneAndUpdate({ email }, { socketId: socket.id });
        console.log(`User registered: ${email} with socket ID: ${socket.id}`);
      } catch (error) {
        console.error("Error updating socket ID:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("user disconnected: ", socket.id);
    });

    socket.on("offer", async (data) => {
      const { to, offer } = data;
      const recipientSocketId = await findSocketIdByEmail(to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("offer", { from: socket.id, offer });
      }
    });

    socket.on("answer", async (data) => {
      const { to, answer } = data;
      const recipientSocketId = await findSocketIdByEmail(to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("answer", { from: socket.id, answer });
      }
    });

    socket.on("candidate", async (data) => {
      const { to, candidate } = data;
      const recipientSocketId = await findSocketIdByEmail(to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("candidate", {
          from: socket.id,
          candidate,
        });
      }
    });
  });
}

async function findSocketIdByEmail(email) {
  try {
    const user = await User.findOne({ email });
    return user ? user.socketId : null;
  } catch (error) {
    console.error("Error finding socket ID:", error);
    return null;
  }
}

module.exports = {
  initializeSocket,
};
