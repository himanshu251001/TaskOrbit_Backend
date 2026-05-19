import { io } from "socket.io-client";

// Ensure your server is running before executing this!
const URL = "http://localhost:3000"; // Update port if necessary

console.log("Connecting two simulated clients...");

// Create two distinct socket connections
const user1Socket = io(URL);
const user2Socket = io(URL);

let registeredCount = 0;

// Connect User 1 (e.g., Ravi Shankar - ID 1)
user1Socket.on("connect", () => {
    console.log(`[User 1] Connected with socket ID: ${user1Socket.id}`);
    user1Socket.emit("user:register", { userId: 1 });
});

// Connect User 2 (e.g., Anita Menon - ID 2)
user2Socket.on("connect", () => {
    console.log(`[User 2] Connected with socket ID: ${user2Socket.id}`);
    user2Socket.emit("user:register", { userId: 2 });
});

function onUserRegistered() {
    registeredCount++;
    // Once both users are registered and have implicitly joined their rooms
    if (registeredCount === 2) {
        console.log("\nBoth users registered! Waiting a moment for room joins to settle...\n");
        setTimeout(() => {
            console.log("[User 1] Sending a message to 'TaskOrbit General'...");
            user1Socket.emit("message:group", {
                groupName: "TaskOrbit General",
                message: "Hello from User 1! Is this working?",
            });
        }, 1000);
    }
}

user1Socket.on("user:registered", onUserRegistered);
user2Socket.on("user:registered", onUserRegistered);

// --- TEST ASSERTIONS ---

// User 1 (Sender) should ONLY receive 'message:sent'
user1Socket.on("message:sent", (payload) => {
    console.log(`✅ [User 1] Received 'message:sent' confirmation: "${payload.message}"`);
});

user1Socket.on("message:group", (payload) => {
    console.log(`❌ [User 1] ERROR: Received 'message:group'! Sender shouldn't receive this.`);
});

// User 2 (Receiver) should ONLY receive 'message:group'
user2Socket.on("message:group", (payload) => {
    console.log(`✅ [User 2] Successfully received 'message:group': "${payload.message}"`);
    
    // Test completed successfully
    setTimeout(() => {
        console.log("\nTest passed! Disconnecting clients...");
        user1Socket.disconnect();
        user2Socket.disconnect();
        process.exit(0);
    }, 1000);
});

// Listen for errors
user1Socket.on("error", (err) => console.error("[User 1] Error:", err));
user2Socket.on("error", (err) => console.error("[User 2] Error:", err));
