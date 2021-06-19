let connected = false;

let socket = io("http://localhost:3003");
socket.emit("setup", userLoggedIn);

socket.on("connected", () => connected = true);
socket.on("message received", newMsg => messageReceived(newMsg));

socket.on("notification received", (newNotification) => {
    $.get("/api/notifications/latest", (notificationData) => {
        showNotificationPopup(notificationData);
        refreshNotificationsBadge();
    })
});

function emitNotification(userId) {
    if (userId == userLoggedIn._id) return;
    socket.emit("notification received", userId);
}