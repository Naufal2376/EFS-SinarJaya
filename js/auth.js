if (sessionStorage.getItem("isLoggedIn") !== "true") {
  alert("Anda harus login untuk mengakses halaman ini!")
  window.location.href = "index.html"
}
