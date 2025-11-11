$(document).ready(function () {
  $("#loginForm").on("submit", function (e) {
    e.preventDefault()

    const validCredentials = {
      admin: "admin",
    }

    const username = $("#username").val()
    const password = $("#password").val()

    if (validCredentials[username] === password) {
      sessionStorage.setItem("isLoggedIn", "true")

      Swal.fire({
        title: "Login Berhasil!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        window.location.href = "home.html"
      })
    } else {
      Swal.fire({
        title: "Login Gagal!",
        text: "Nama Pengguna atau Kata Sandi salah.",
        icon: "error",
        confirmButtonColor: "#d33",
      })
    }
  })
})
