document.addEventListener("DOMContentLoaded", function () {
    const userLoggedIn = sessionStorage.getItem("userLoggedIn");
    const avatarUrl = sessionStorage.getItem("avatar");

    if (userLoggedIn && avatarUrl) {
        document.getElementById("avatarLi").style.display = "block";
        document.getElementById("avatar").innerHTML = `<img src="${avatarUrl}" alt="User Avatar" style="width:40px; height:40px; border-radius:50%;">`;
        document.getElementById("loginLink").style.display = "none";
        document.getElementById("registerLink").style.display = "none";
    } else {
        document.getElementById("avatarLi").style.display = "none";
        document.getElementById("loginLink").style.display = "block";
        document.getElementById("registerLink").style.display = "block";
    }
});

document.getElementById("logoutBtn")?.addEventListener("click", function () {
    sessionStorage.removeItem("userLoggedIn");
    sessionStorage.removeItem("avatar");
    window.location.href = "/login";
});