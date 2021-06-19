// Globals
let cropper;
let timer;
let selectedUsers = [];

$("#postTextarea, #replyTextarea").keyup(event => {
    const textbox = $(event.target);
    const value = textbox.val().trim();

    const isModal = textbox.parents(".modal").length == 1;
    const submitButton = isModal ? $("#submitReplyButton") : $("#submitPostButton");

    if (submitButton.length == 0) return alert("No submit button found");

    if (value == "") {
        submitButton.prop("disabled", true);
        return;
    }

    submitButton.prop("disabled", false);
});

$("#submitPostButton, #submitReplyButton").click(event => {
    const button = $(event.target);
    
    const isModal = button.parents(".modal").length == 1;
    const textbox = isModal ? $("#replyTextarea") : $("#postTextarea");
    
    const data = {
        content: textbox.val()
    };

    if (isModal) {
        const id = button.data().id;
        if (id == null) return alert("button id is null");

        data.replyTo = id;
    }

    $.post("/api/posts", data, postData => {

        if(postData.replyTo) {
            location.reload();
        } else {
            const html = createPostHtml(postData);
            $(".postsContainer").prepend(html);
            textbox.val("");
            button.prop("disabled", true);
        }
    })
});

$(document).on("click", ".likeButton", event => {
    const button = $(event.target);
    const postId = getPostIdFromElement(button);

    if (postId === undefined) return;
    $.ajax({
        url: `/api/posts/${postId}/like`,
        type: "PUT",
        success: postData => {
            button.find("span").text(postData.likes.length || "");
            if (postData.likes.includes(userLoggedIn._id)) {
                button.addClass("active");
            } else {
                button.removeClass("active");
            }
        }
    })
});

$(document).on("click", ".retweetButton", event => {
    const button = $(event.target);
    const postId = getPostIdFromElement(button);

    if (postId === undefined) return;
    $.ajax({
        url: `/api/posts/${postId}/retweet`,
        type: "POST",
        success: postData => {
            button.find("span").text(postData.retweetUsers.length || "");
            if (postData.retweetUsers.includes(userLoggedIn._id)) {
                button.addClass("active");
            } else {
                button.removeClass("active");
            }
        }
    })
});

$(document).on("click", ".post", event => {
    const element = $(event.target);
    const postId = getPostIdFromElement(element);
    if (postId !== undefined && !element.is("button")) {
        window.location.href = `/post/${postId}`;
    }
});

$(document).on("click", ".followButton", event => {
    const button = $(event.target);
    const userId = button.data().user;
    
    $.ajax({
        url: `/api/users/${userId}/follow`,
        type: "PUT",
        success: (data, status, xhr) => {
            if (xhr.status == 404) {
                return;
            }
            let difference = 1;
            if (data.following && data.following.includes(userId)) {
                button.addClass("following");
                button.text("Following");
            } else {
                button.removeClass("following");
                button.text("Follow");
                difference = -1;
            }
            const followersLabel = $("#followersValue");            
            if (followersLabel.length != 0) {
                let followersText = parseInt(followersLabel.text());
                followersLabel.text(followersText + difference);
            }
        }
    })
});

$(document).on("click", ".notification.active", event => {
    const container = $(event.target);
    const notificationId = container.data().id;
    const href = container.attr("href");
    event.preventDefault();
    
    const callback = () => window.location = href;
    markNotificationsAsOpened(notificationId, callback);
});

$("#replyModal").on("show.bs.modal", event => {
    const button = $(event.relatedTarget);
    const postId = getPostIdFromElement(button);
    $("#submitReplyButton").data("id", postId);
    $.get(`/api/posts/${postId}`, results => {
        outputPosts(results.postData, $("#originalPostContainer"))
    })
});

$("#replyModal").on("hidden.bs.modal", () => $("#originalPostContainer").html(""));

$("#deletePostModal").on("show.bs.modal", event => {
    const button = $(event.relatedTarget);
    const postId = getPostIdFromElement(button);
    $("#deletePostButton").data("id", postId);
});

$("#deletePostButton").click(event => {
    const postId = $(event.target).data("id");
    
    $.ajax({
        url: `/api/posts/${postId}`,
        type: "DELETE",
        success: (data, status, xhr) => {
            if (xhr.status != 202) {
                alert("Could not delete the post");
                return;
            }
            location.reload();
        }
    })
});

$("#confirmPinModal").on("show.bs.modal", event => {
    const button = $(event.relatedTarget);
    const postId = getPostIdFromElement(button);
    $("#confirmPinButton").data("id", postId);
});

$("#confirmPinButton").click(event => {
    const postId = $(event.target).data("id");
    $.ajax({
        url: `/api/posts/${postId}`,
        type: "PUT",
        data: { pinned: true },
        success: (data, status, xhr) => {
            if (xhr.status != 204) {
                alert("Could not pin the post");
                return;
            }
            location.reload();
        }
    })
});

$("#unpinModal").on("show.bs.modal", event => {
    const button = $(event.relatedTarget);
    const postId = getPostIdFromElement(button);
    $("#unpinButton").data("id", postId);
});

$("#unpinButton").click(event => {
    const postId = $(event.target).data("id");
    $.ajax({
        url: `/api/posts/${postId}`,
        type: "PUT",
        data: { pinned: false },
        success: (data, status, xhr) => {
            if (xhr.status != 204) {
                alert("Could not unpin the post");
                return;
            }
            location.reload();
        }
    })
});

$("#filePhoto").change(event => {
    const input = $(event.target)[0];
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const image = document.getElementById("imagePreview");
            image.src = e.target.result;
            if (cropper !== undefined) {
                cropper.destroy();
            }
            cropper = new Cropper(image, {
                aspectRatio: 1 / 1,
                background: false
            })
        }
        reader.readAsDataURL(input.files[0]);
    }
});

$("#imageUploadButton").click(() => {
    const canvas = cropper.getCroppedCanvas();
    if (canvas == null) return alert("Could not upload image.");
    canvas.toBlob(blob => {
        const formData = new FormData();
        formData.append("croppedImage", blob);
        $.ajax({
            url: "/api/users/profilePicture",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: () => {
                location.reload();
            }
        })
    })
})

$("#coverPhoto").change(event => {
    const input = $(event.target)[0];
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const image = document.getElementById("coverPhotoPreview");
            image.src = e.target.result;
            if (cropper !== undefined) {
                cropper.destroy();
            }
            cropper = new Cropper(image, {
                aspectRatio: 16 / 9,
                background: false
            })
        }
        reader.readAsDataURL(input.files[0]);
    }
});

$("#coverPhotoUploadButton").click(() => {
    const canvas = cropper.getCroppedCanvas();
    if (canvas == null) return alert("Could not upload image.");
    canvas.toBlob(blob => {
        const formData = new FormData();
        formData.append("croppedImage", blob);
        $.ajax({
            url: "/api/users/coverPhoto",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: () => {
                location.reload();
            }
        })
    })
})

$("#userSearchTextbox").keydown(event => {
    clearTimeout(timer);
    const textbox = $(event.target);
    let value = textbox.val();

    if (value == "" && (event.which == 8 || event.keyCode == 8)) {
        selectedUsers.pop();
        updateSelectedUsersHtml();
        $(".resultsContainer").html("");

        if (selectedUsers.length == 0) {
            $("#createChatButton").prop("disabled", true);
        }

        return;
    }
    timer = setTimeout(() => {
        value = textbox.val().trim();

        if (value == "") {
            $(".resultsContainer").html("");
        } else {
            searchUsers(value);
        }
    }, 1000);
});

$("#createChatButton").click(event => {
    const data = JSON.stringify(selectedUsers);

    $.post("/api/chats", { users: data }, chat => {
        if (!chat || !chat._id) return alert("Invalid response from server.");
        window.location.href = `/messages/${chat._id}`;
    })
});

function getPostIdFromElement(element) {
    const isRoot = element.hasClass("post");
    const rootElement = isRoot ? element : element.closest(".post");
    const postId = rootElement.data().id;
    if (postId === undefined) return alert("Post id undefined");
    return postId;
};

function createPostHtml(postData, largeFont = false) {
    if (postData == null) return alert("post object is null");
    const isRetweet = postData.retweetData !== undefined;
    const retweetedBy = isRetweet ? postData.postedBy.username : null;
    postData = isRetweet ? postData.retweetData : postData;
    const postedBy = postData.postedBy;
    const displayName = postedBy.firstName + " " + postedBy.lastName;
    const timestamp = timeDifference(new Date(), new Date(postData.createdAt));
    const likeButtonActiveClass = postData.likes.includes(userLoggedIn._id) ? "active" : "";
    const retweetButtonActiveClass = postData.retweetUsers.includes(userLoggedIn._id) ? "active" : "";
    const largeFontClass = largeFont ? "largeFont" : "";

    let retweetText = '';
    if (isRetweet) {
        retweetText = `<i class="fas fa-retweet"></i>&nbsp;<span>Retweeted by <a href='/profile/${retweetedBy}'>@${retweetedBy}</a></span>`
    }

    let replyFlag = "";
    if (postData.replyTo && postData.replyTo._id) {
        if (!postData.replyTo.postedBy._id) return alert("Reply to is not populated");
        const replyToUsername = postData.replyTo.postedBy.username;
        replyFlag = `
        <div class="replyFlag">
            Replying to <a href="/profile/${replyToUsername}">@${replyToUsername}</a>
        </div>
        `;
    }

    let buttons = ``;
    let pinnedPostText = "";
    if (postedBy._id == userLoggedIn._id) {
        let pinnedClass = "";
        let dataTarget = "#confirmPinModal";
        if (postData.pinned === true) {
            pinnedClass = "active";
            dataTarget = "#unpinModal";
            pinnedPostText = `
                <i class="fas fa-thumbtack"></i>
                 <span>Pinned post</span>
            `;
        }
        buttons = `
        <button class="confirmPinButton ${pinnedClass}" data-id="${postData._id}" data-toggle="modal" data-target=${dataTarget}><i class="fas fa-thumbtack"></i></button>
        <button class="deletePostButton" data-id="${postData._id}" data-toggle="modal" data-target="#deletePostModal"><i class="fas fa-times"></i></button>
        `
    };
    return `
    <div class="post ${largeFontClass}" data-id="${postData._id}">
        <div class="postActionContainer">
            ${pinnedPostText} &nbsp; ${retweetText}
        </div>
        <div class="mainContentContainer">
            <div class="userImageContainer">
                <img src="${postedBy.profilePic}">
            </div>
            <div class="postContentContainer">
                <div class="postHeader">
                    <a href="/profile/${postedBy.username}" class="displayName">${displayName}</a>
                    <span class="username">@${postedBy.username}</span>
                    <span class="date">${timestamp}</span>
                    ${buttons}
                </div>
                ${replyFlag}
                <div class="postBody">
                    <span>${postData.content}</span>
                </div>
                <div class="postFooter">
                    <div class="postButtonContainer">
                        <button class="replyButton green" data-toggle="modal" data-target="#replyModal">
                            <i class="far fa-comment"></i>
                            <span>${postData.likes.length || ""}</span>
                        </button>
                    </div>
                    <div class="postButtonContainer">
                        <button class="retweetButton ${retweetButtonActiveClass} blue">
                            <i class="fas fa-retweet"></i>
                            <span>${postData.retweetUsers.length || ""}</span>
                        </button>
                    </div>
                    <div class="postButtonContainer">
                        <button class="likeButton ${likeButtonActiveClass} red">
                            <i class="far fa-heart"></i>
                            <span>${postData.likes.length || ""}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
};

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if(elapsed/1000 < 30) return "Just now";
        return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
        return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
        return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
};

function outputPosts(results, container) {
    if (container[0].className == "pinnedPostContainer" && results.length == 0) {
        container.hide();
        return;
    } 
    container.html("");
    if (!Array.isArray(results)) {
        results = [results];
    }
    results.forEach(result => {
        const html = createPostHtml(result);
        container.append(html);
    });
    if (!results.length) {
        container.append("<span class='noResults'>Nothing to show.</span>");
    }
};

function outputPostsWithReplies(results, container) {
    container.html("");
    if (results.replyTo !== undefined && results.replyTo._id !== undefined) {
        const html = createPostHtml(results.replyTo);
        container.append(html);

    }
    const mainPostHtml = createPostHtml(results.postData, true);
    container.append(mainPostHtml);

    results.replies.forEach(result => {
        const html = createPostHtml(result)
        container.append(html);
    });
};

function outputUsers(results, container) {
    container.html("");
    results.forEach(result => {
        const html = createUserHtml(result, true);
        container.append(html);
    });

    if (results.length == 0) {
        container.append("<span class='noResults'>No results found</span>")
    }
};

function createUserHtml(userData, showFollowButton) {
    const name = userData.firstName + " " + userData.lastName;
    const isFollowing = userLoggedIn.following && userLoggedIn.following.includes(userData._id);
    const text = isFollowing ? "Following" : "Follow";
    const buttonClass = isFollowing ? "followButton following" : "followButton";
    let followButton = "";
    if (showFollowButton && userLoggedIn._id != userData._id) {
        followButton = `
        <div class="followButtonContainer">
            <button class="${buttonClass}" data-user="${userData._id}">${text}</button>
        </div>
        `;
    }
    return `
    <div class="user">
        <div class="userImageContainer">
            <img src="${userData.profilePic}">
        </div>
        <div class="userDetailsContainer">
            <div class="header">
                <a href="/profile/${userData.username}">${name}</a>
                <span class="username">@${userData.username}</span>
            </div>
        </div>
        ${followButton}
    </div>
    `;
};

function searchUsers(searchTerm) {
    $.get("/api/users", { search: searchTerm }, results => {
        outputSelectableUsers(results, $(".resultsContainer"));
    });
};

function outputSelectableUsers(results, container) {
    container.html("");
    results.forEach(result => {
        if (result._id == userLoggedIn._id || selectedUsers.some(u => u._id == result._id)) {
            return;
        }
        const html = createUserHtml(result, false);
        const element = $(html);
        element.click(() => userSelected(result))
        container.append(element);
    });

    if (results.length == 0) {
        container.append("<span class='noResults'>No results found</span>")
    }
};

function userSelected(user) {
    selectedUsers.push(user);
    updateSelectedUsersHtml();
    $("#userSearchTextbox").val("").focus();
    $(".resultsContainer").html("");
    $("#createChatButton").prop("disabled", false);
};

function updateSelectedUsersHtml() {
    let elements = [];
    selectedUsers.forEach(user => {
        const name = user.firstName + " " + user.lastName;
        const userElement = $(`<span class="selectedUser">${name}</span>`);
        elements.push(userElement);

    })
    $(".selectedUser").remove();
    $("#selectedUsers").prepend(elements);
};

function getChatName(chatData) {
    let chatName = chatData.chatName;

    if (!chatName) {
        const otherChatUsers = getOtherChatUsers(chatData.users);
        const namesArray = otherChatUsers.map(user => user.firstName + " " + user.lastName);
        chatName = namesArray.join(", ");
    }

    return chatName;
};

function getOtherChatUsers(users) {
    if (users.length == 1) return users;
    return users.filter(user => user._id != userLoggedIn._id)
};

function messageReceived(newMsg) {
    if ($(".chatContainer").length == 0) {
        // Show popup notification
    } else {
        addChatMessageHtml(newMsg);
    }
};

function markNotificationsAsOpened(notificationId = null, callback = null) {
    if (callback == null) callback = () => location.reload();

    const url = notificationId != null ? `/api/notifications/${notificationId}/markAsOpened` : `/api/notifications/markAsOpened`;
    $.ajax({
        url: url,
        type: "PUT",
        success: () => callback()
    });
}