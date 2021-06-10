$(document).ready(() => {
    $.get("/api/chats", (data, status, xhr) => {
        if (xhr.status == 400) {
            alert("Could not get chat list.");
        } else {
            outputChatList(data, $(".resultsContainer"));
        }
    })
})

function outputChatList(chatList, container) {
    if (chatList.length == 0) {
        container.append("<span class='noResults'>Nothing to show.</span>")
        return;
    }
    chatList.forEach(chat => {
        const html = createChatHtml(chat);
        container.append(html);
    })
}

function createChatHtml(chatData) {
    const chatName = getChatName(chatData);
    const image = getChatImageElements(chatData);
    const latestMessage = "Latest messages will be here.";

    return `
    <a href="/messages/${chatData._id}" class="resultListItem">
        ${image}
        <div class="resultsDetailsContainer ellipsis">
            <span class="heading ellipsis">${chatName}</span>
            <span class="subText ellipsis">${latestMessage}</span>
        </div>
    </a>`
}

function getChatName(chatData) {
    let chatName = chatData.chatName;

    if (!chatName) {
        const otherChatUsers = getOtherChatUsers(chatData.users);
        const namesArray = otherChatUsers.map(user => user.firstName + " " + user.lastName);
        chatName = namesArray.join(", ");
    }

    return chatName;
}

function getOtherChatUsers(users) {
    if (users.length == 1) return users;
    return users.filter(user => user._id != userLoggedIn._id)
}

function getChatImageElements(chatData) {
    const otherChatUsers = getOtherChatUsers(chatData.users);

    let groupChatClass = "";
    let chatImage = getUserChatImageElement(otherChatUsers[0]);

    if (otherChatUsers.length > 1) {
        groupChatClass = "groupChatImage";
        chatImage += getUserChatImageElement(otherChatUsers[1]);
    }
    
    return `
        <div class="resultsImageContainer ${groupChatClass}">${chatImage}</div>
    `
}

function getUserChatImageElement(user) {
    if (!user || !user.profilePic) {
        return alert("User passed into function is invalid.");
    }

    return `
    <img src="${user.profilePic}" alt="User's profile pic">
    `
}