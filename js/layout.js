document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.getElementById("sidebar")
  const sidebarToggle = document.getElementById("sidebarToggle")
  const sidebarOverlay = document.getElementById("sidebarOverlay")
  const logoutButton = document.getElementById("logout")
  const currentDateEl = document.getElementById("currentDate")
  const currentTimeEl = document.getElementById("currentTime")
  const userMenuToggle = document.getElementById("userMenuToggle")
  const userMenu = document.getElementById("userMenu")
  const currentUserNameEl = document.getElementById("currentUserName")

  const ACTIVE_CLASSES = [
    "bg-white/15",
    "font-semibold",
    "text-white",
    "shadow-inner",
    "backdrop-blur-sm",
  ]

  const updateActiveNav = () => {
    const overrideTarget = document.body?.dataset?.activeNav || ""
    const currentPage =
      overrideTarget || window.location.pathname.split("/").pop() || "home.html"
    document
      .querySelectorAll('[data-nav-link="true"]')
      .forEach((linkElement) => {
        const target = linkElement.getAttribute("href")
        if (!target) return
        const isActive = target === currentPage
        ACTIVE_CLASSES.forEach((className) => {
          linkElement.classList.toggle(className, isActive)
        })
        linkElement.setAttribute("aria-current", isActive ? "page" : "false")
      })
  }

  const updateTime = () => {
    if (!currentTimeEl) return
    const now = new Date()
    const options = {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }
    currentTimeEl.textContent = now.toLocaleTimeString("en-GB", options)
  }

  const updateDate = () => {
    if (!currentDateEl) return
    const now = new Date()
    const options = {
      timeZone: "Asia/Jakarta",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    currentDateEl.textContent = now.toLocaleDateString("id-ID", options)
  }

  if (currentDateEl || currentTimeEl) {
    updateDate()
    updateTime()
    setInterval(updateTime, 1000)
  }

  if (currentUserNameEl) {
    const storedUsername = sessionStorage.getItem("username") || "Pengguna"
    currentUserNameEl.textContent = storedUsername
  }

  const openSidebar = () => {
    if (!sidebar) return
    sidebar.classList.remove("-translate-x-full")
    if (sidebarOverlay) {
      sidebarOverlay.classList.remove("hidden")
    }
  }

  const closeSidebar = () => {
    if (!sidebar) return
    sidebar.classList.add("-translate-x-full")
    if (sidebarOverlay) {
      sidebarOverlay.classList.add("hidden")
    }
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      const isHidden = sidebar?.classList.contains("-translate-x-full")
      if (isHidden) {
        openSidebar()
      } else {
        closeSidebar()
      }
    })
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeSidebar)
  }

  window.addEventListener("resize", () => {
    if (!sidebar) return
    if (window.innerWidth >= 768) {
      sidebar.classList.remove("-translate-x-full")
      sidebarOverlay?.classList.add("hidden")
    } else {
      sidebar.classList.add("-translate-x-full")
    }
  })

  const closeUserMenu = () => userMenu?.classList.add("hidden")

  if (userMenuToggle && userMenu) {
    userMenuToggle.addEventListener("click", (event) => {
      event.stopPropagation()
      userMenu.classList.toggle("hidden")
    })

    document.addEventListener("click", (event) => {
      if (
        userMenu.classList.contains("hidden") ||
        userMenu.contains(event.target) ||
        userMenuToggle.contains(event.target)
      ) {
        return
      }
      closeUserMenu()
    })

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeUserMenu()
      }
    })
  }

  const performLogout = () => {
    sessionStorage.removeItem("isLoggedIn")
    sessionStorage.removeItem("username")
    window.location.href = "index.html"
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", performLogout)
  }

  updateActiveNav()
})

