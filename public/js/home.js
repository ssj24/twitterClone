$(document).ready(() => {
    $.get("/api/posts", { followingOnly: true }, results => {
        outputPosts(results, $(".postsContainer"));
    });
    $.get(`/api/posts/likes`, (data, status, xhr) => {
        if (xhr.status == 400) {
            alert("Could not get liked posts.");
        } else {
            outputPosts(data, $(".likedPostsContainer"));
        }
    });
});
