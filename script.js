document.addEventListener("DOMContentLoaded", () => {
  // Mobile Hamburger Menu Toggle
  const hamburgerMenu = document.querySelector(".hamburger-menu");
  const mobileMenu = document.querySelector(".mobile-menu");
  const body = document.body;

  if (hamburgerMenu && mobileMenu) {
    hamburgerMenu.addEventListener("click", () => {
      hamburgerMenu.classList.toggle("active");
      mobileMenu.classList.toggle("active");

      // Prevent body scrolling when menu is open
      if (mobileMenu.classList.contains("active")) {
        body.style.overflow = "hidden";
      } else {
        body.style.overflow = "";
      }
    });

    // Close mobile menu when clicking on a link
    const mobileMenuLinks = mobileMenu.querySelectorAll("li, a, button");
    mobileMenuLinks.forEach(link => {
      link.addEventListener("click", () => {
        hamburgerMenu.classList.remove("active");
        mobileMenu.classList.remove("active");
        body.style.overflow = "";
      });
    });

    // Close mobile menu when clicking outside
    mobileMenu.addEventListener("click", (e) => {
      if (e.target === mobileMenu) {
        hamburgerMenu.classList.remove("active");
        mobileMenu.classList.remove("active");
        body.style.overflow = "";
      }
    });
  }

  // Video Tab Switching
  const tabButtons = document.querySelectorAll(".tab-item");
  const videoPlayer = document.getElementById("videoPlayer");
  const videoSource = videoPlayer ? videoPlayer.querySelector("source") : null;

  if (tabButtons.length && videoPlayer && videoSource) {
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        const newVideo = button.getAttribute("data-video");
        if (newVideo) {
          videoSource.setAttribute("src", newVideo);
          videoPlayer.load();
          videoPlayer.play();
        }
      });
    });
  }

  // Tabs container horizontal scrolling enhancement for touch devices
  const tabsContainer = document.querySelector(".tabs-container");

  if (tabsContainer) {
    let isDown = false;
    let startX;
    let scrollLeft;

    tabsContainer.addEventListener('mousedown', (e) => {
      isDown = true;
      tabsContainer.classList.add('active');
      startX = e.pageX - tabsContainer.offsetLeft;
      scrollLeft = tabsContainer.scrollLeft;
    });

    tabsContainer.addEventListener('mouseleave', () => {
      isDown = false;
      tabsContainer.classList.remove('active');
    });

    tabsContainer.addEventListener('mouseup', () => {
      isDown = false;
      tabsContainer.classList.remove('active');
    });

    tabsContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - tabsContainer.offsetLeft;
      const walk = (x - startX) * 2;
      tabsContainer.scrollLeft = scrollLeft - walk;
    });

    // Touch events for mobile
    tabsContainer.addEventListener('touchstart', (e) => {
      isDown = true;
      startX = e.touches[0].pageX - tabsContainer.offsetLeft;
      scrollLeft = tabsContainer.scrollLeft;
    });

    tabsContainer.addEventListener('touchend', () => {
      isDown = false;
    });

    tabsContainer.addEventListener('touchmove', (e) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - tabsContainer.offsetLeft;
      const walk = (x - startX) * 2;
      tabsContainer.scrollLeft = scrollLeft - walk;
    });
  }

  // Window resize handler to close mobile menu if screen size increases
  window.addEventListener('resize', () => {
    if (window.innerWidth > 765) {
      if (hamburgerMenu && mobileMenu) {
        hamburgerMenu.classList.remove("active");
        mobileMenu.classList.remove("active");
        body.style.overflow = "";
      }
    }
  });

  /* -------------------------
     PRICING TOGGLE
     ------------------------- */
  const monthlyBtn = document.getElementById("monthly-btn");
  const yearlyBtn = document.getElementById("yearly-btn");
  const proPrice = document.getElementById("pro-price");

  if (monthlyBtn && yearlyBtn && proPrice) {
    const MONTHLY = "$19.00";
    const YEARLY = "$30.00";

    function setPrice(isYearly) {
      proPrice.textContent = isYearly ? YEARLY : MONTHLY;
      yearlyBtn.classList.toggle("active", isYearly);
      monthlyBtn.classList.toggle("active", !isYearly);
    }

    monthlyBtn.addEventListener("click", () => setPrice(false));
    yearlyBtn.addEventListener("click", () => setPrice(true));
    setPrice(false); // default to monthly
  }

  /* -------------------------
     TESTIMONIAL SLIDER
     ------------------------- */
  const track = document.querySelector(".testimonial-track");
  const dots = document.querySelectorAll(".dot");
  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");

  let index = 0;
  const totalSlides = 2; // adjust as needed

  function updateSlider() {
    if (!track) return;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
  }

  if (nextBtn && prevBtn && track) {
    nextBtn.addEventListener("click", () => {
      index = (index + 1) % totalSlides;
      updateSlider();
    });

    prevBtn.addEventListener("click", () => {
      index = (index - 1 + totalSlides) % totalSlides;
      updateSlider();
    });

    dots.forEach((dot, i) =>
      dot.addEventListener("click", () => {
        index = i;
        updateSlider();
      })
    );
  }

  /* -------------------------
     FAQ ACCORDION
     ------------------------- */
  const faqToggles = document.querySelectorAll(".js-faq-toggle");

  faqToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const item = toggle.closest(".faq-item");
      if (!item) return;

      const wasExpanded = item.classList.contains("expanded");

      // Close all open items
      document.querySelectorAll(".faq-item.expanded").forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove("expanded");
          const openBtn = openItem.querySelector(".arrow-btn");
          if (openBtn) {
            openBtn.classList.remove("expanded");
            openBtn.setAttribute("aria-expanded", "false");
          }
        }
      });

      // Toggle clicked one
      const btn = item.querySelector(".arrow-btn");
      item.classList.toggle("expanded", !wasExpanded);
      if (btn) {
        btn.classList.toggle("expanded", !wasExpanded);
        btn.setAttribute("aria-expanded", !wasExpanded ? "true" : "false");
      }
    });
  });

  /* -------------------------
     BEFORE/AFTER IMAGE SLIDER
     ------------------------- */
  const comparisonSlider = document.querySelector(".comparison-slider");
  const afterImage = document.querySelector(".image-after");
  const sliderControl = document.querySelector(".slider-control");

  if (comparisonSlider && afterImage && sliderControl) {
    function setPositionPercent(percent) {
      percent = Math.max(0, Math.min(100, percent));
      // Control the visible portion using clip-path instead of width
      afterImage.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
      sliderControl.style.left = percent + "%";
    }

    function updateFromClientX(clientX) {
      const rect = comparisonSlider.getBoundingClientRect();
      let x = Math.min(Math.max(clientX, rect.left), rect.right);
      const percent = ((x - rect.left) / rect.width) * 100;
      setPositionPercent(percent);
    }

    comparisonSlider.addEventListener("mousemove", (e) =>
      updateFromClientX(e.clientX)
    );
    comparisonSlider.addEventListener("mouseenter", (e) =>
      updateFromClientX(e.clientX)
    );
    comparisonSlider.addEventListener(
      "touchmove",
      (e) => {
        if (e.touches && e.touches[0]) {
          updateFromClientX(e.touches[0].clientX);
          e.preventDefault();
        }
      },
      { passive: false }
    );

    setPositionPercent(50);
  }
});




const tabButtons = document.querySelectorAll(".tab-item");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons
    tabButtons.forEach((btn) => {
      btn.classList.remove("active");
      // reset icon to default (white)
      const img = btn.querySelector("img");
      img.src = btn.getAttribute("data-default-icon");
    });

    // Add active class to clicked one
    button.classList.add("active");

    // Change its icon to active (black)
    const img = button.querySelector("img");
    img.src = button.getAttribute("data-active-icon");

    // Optional: handle video switching if you have a video player
    const videoSrc = button.getAttribute("data-video");
    const videoElement = document.querySelector("#videoPlayer");
    if (videoElement) {
      videoElement.src = videoSrc;
      videoElement.play();
    }
  });
});




