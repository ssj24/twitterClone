let curTab = "allNoti";

$(document).ready(() => {
    getNotifications();
});

$("#markNotificationsAsRead").click(() => markNotificationsAsOpened());

$("#allNoti, #followNoti, #replyNoti, #retweetNoti, #likeNoti").click((event) => {
    const button = event.target;
    button.classList.add("active");
    document.getElementById(curTab).classList.remove("active");
    curTab = event.target.id;
    getNotifications(curTab);
})

function outputNotificationList(notifications, container) {
    container.html("");
    notifications.forEach(notification => {
        const html = createNotificationHtml(notification);
        container.append(html);
    })
    if (notifications.length == 0) {
        container.append("<span class='noResults'>Nothing to show.</span>");
    }
};

function getNotifications(tab="allNoti") {
    tab = tab.slice(0,-4);
    if (tab == "like") tab = "postLike";
    $.get("/api/notifications/", { field: tab }, (data) => {
        outputNotificationList(data, $(".resultsContainer"));
    })
}

