$(document).ready(() => {
    $.get("/api/notifications/", (data) => {
        outputNotificationList(data, $(".resultsContainer"));
    })
});

$("#markNotificationsAsRead").click(() => markNotificationsAsOpened());

function outputNotificationList(notifications, container) {
    notifications.forEach(notification => {
        const html = createNotificationHtml(notification);
        container.append(html);
    })
    if (notifications.length == 0) {
        container.append("<span class='noResults'>Nothing to show.</span>");
    }
};

function createNotificationHtml(notification) {
    const userFrom = notification.userFrom;
    const text = getNotificationText(notification);
    const href = getNotificationUrl(notification);
    let className = notification.opened ? "" : "active";
    return `
        <a href=${href} class="resultListItem notification ${className}" data-id="${notification._id}">
            <div class="resultsImageContainer">
                <img src="${userFrom.profilePic}" alt="user's profile picture">
            </div>
            <div class="resultsDetailsContainer ellipsis">
                <span class="ellipsis">${text}</span>
            </div>
        </a>
    `;
};

function getNotificationText(notification) {
    const userFrom = notification.userFrom;
    if (!userFrom.firstName || !userFrom.lastName) {
        return alert("user from data not populated")
    };
    const userFromName = `${userFrom.firstName} ${userFrom.lastName}`;
    let text;
    if (notification.notificationType == "retweet") {
        text = `${userFromName} retweeted one of your posts`;
    } else if (notification.notificationType == "postLike") {
        text = `${userFromName} liked one of your posts`;

    } else if (notification.notificationType == "reply") {
        text = `${userFromName} replied one of your posts`;
    } else if (notification.notificationType == "follow") {
        text = `${userFromName} followed you`;
    };

    return `<span class="ellipsis">${text}</span>`;
};

function getNotificationUrl(notification) {
    let url = '#';
    if (notification.notificationType == "retweet" || 
        notification.notificationType == "postLike" || 
        notification.notificationType == "reply") {
        url = `/post/${notification.entityId}`;
    } else if (notification.notificationType == "follow") {
        url = `/profile/${notification.entityId}`;
    };

    return url;
};