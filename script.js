
/* =========================================
   1. INITIALIZATION
========================================= */

document.documentElement.classList.add("js-enabled");

document.addEventListener("DOMContentLoaded", () => {
    initLoader();
    initScrollReveal();
    initGalleryFilters();
    initMobileNavigation();
    initHeroInteraction();
    initSmoothNavigation();
});


/* =========================================
   2. LOADING SCREEN
========================================= */

function initLoader() {
    const loader = document.getElementById("loader");
    const progressBar = document.querySelector(".loader-progress");
    const percentage = document.querySelector(".loader-percentage");

    if (!loader) return;

    let progress = 0;
    let finished = false;

    const finishLoader = () => {
        if (finished) return;

        finished = true;

        if (progressBar) {
            progressBar.style.width = "100%";
        }

        if (percentage) {
            percentage.textContent = "100%";
        }

        window.setTimeout(() => {
            loader.classList.add("hidden");
        }, 250);
    };

    // Animate the loading indicator.
    const interval = window.setInterval(() => {
        progress = Math.min(progress + Math.random() * 12 + 4, 90);

        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        if (percentage) {
            percentage.textContent = `${Math.floor(progress)}%`;
        }
    }, 80);

    // Wait until the page resources finish loading.
    const completeLoading = () => {
        window.clearInterval(interval);
        finishLoader();
    };

    if (document.readyState === "complete") {
        completeLoading();
    } else {
        window.addEventListener("load", completeLoading, {
            once: true
        });
    }

    // Safety fallback for slow or unavailable external resources.
    window.setTimeout(() => {
        window.clearInterval(interval);
        finishLoader();
    }, 4000);
}


/* =========================================
   3. SCROLL REVEAL ANIMATIONS
========================================= */

function initScrollReveal() {
    const revealElements = document.querySelectorAll(".reveal");

    if (!revealElements.length) return;

    // Respect reduced-motion preferences.
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach(element => {
            element.classList.add("is-visible");
        });

        return;
    }

    const observer = new IntersectionObserver(
        (entries, observerInstance) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("is-visible");

                // Animate each element only once.
                observerInstance.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );

    revealElements.forEach(element => {
        observer.observe(element);
    });
}


/* =========================================
   4. PROJECT GALLERY FILTERS
========================================= */

function initGalleryFilters() {
    const filterButtons = document.querySelectorAll(".filter-button");
    const projectCards = document.querySelectorAll(".project-card");

    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const selectedFilter = button.dataset.filter;

            // Update active filter and accessibility state.
            filterButtons.forEach(filterButton => {
                const isActive = filterButton === button;

                filterButton.classList.toggle("active", isActive);
                filterButton.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

            // Show only projects belonging to the selected category.
            projectCards.forEach(card => {
                const category = card.dataset.category;

                const shouldShow =
                    selectedFilter === "all" ||
                    category === selectedFilter;

                card.classList.toggle(
                    "project-hidden",
                    !shouldShow
                );
            });
        });
    });
}


/* =========================================
   5. MOBILE NAVIGATION
========================================= */

function initMobileNavigation() {
    const menuButton = document.querySelector(".menu-toggle");
    const mobileNavigation = document.getElementById(
        "mobile-navigation"
    );

    if (!menuButton || !mobileNavigation) return;

    const closeMenu = () => {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

        mobileNavigation.hidden = true;
        document.body.classList.remove("menu-open");
    };

    const openMenu = () => {
        menuButton.setAttribute("aria-expanded", "true");
        menuButton.setAttribute(
            "aria-label",
            "Close navigation menu"
        );

        mobileNavigation.hidden = false;
        document.body.classList.add("menu-open");
    };

    menuButton.addEventListener("click", () => {
        const isOpen =
            menuButton.getAttribute("aria-expanded") === "true";

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close the menu when a navigation link is selected.
    mobileNavigation.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    // Close with the Escape key.
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    // Prevent the mobile menu from remaining open on desktop.
    window.addEventListener("resize", () => {
        if (window.innerWidth > 700) {
            closeMenu();
        }
    });
}


/* =========================================
   6. INTERACTIVE HERO OBJECT
========================================= */

function initHeroInteraction() {
    const visual = document.getElementById("hero-visual");
    const object = document.getElementById("hero-object");

    if (!visual || !object) return;

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const finePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    if (reduceMotion || !finePointer) return;

    let animationFrame = null;

    let pointerX = 0;
    let pointerY = 0;

    const updateObject = () => {
        animationFrame = null;

        object.style.transform = `
            translate3d(${pointerX}px, ${pointerY}px, 0)
            rotateX(${-25 - pointerY * 0.25}deg)
            rotateY(${-35 + pointerX * 0.3}deg)
            rotateZ(10deg)
        `;
    };

    visual.addEventListener("pointermove", event => {
        const bounds = visual.getBoundingClientRect();

        const normalizedX =
            (event.clientX - bounds.left) / bounds.width - 0.5;

        const normalizedY =
            (event.clientY - bounds.top) / bounds.height - 0.5;

        pointerX = normalizedX * 16;
        pointerY = normalizedY * 16;

        if (animationFrame === null) {
            animationFrame = window.requestAnimationFrame(
                updateObject
            );
        }
    });

    visual.addEventListener("pointerleave", () => {
        pointerX = 0;
        pointerY = 0;

        if (animationFrame === null) {
            animationFrame = window.requestAnimationFrame(
                updateObject
            );
        }
    });
}


/* =========================================
   7. SMOOTH NAVIGATION
========================================= */

function initSmoothNavigation() {
    const navigationLinks = document.querySelectorAll(
        'a[href^="#"]'
    );

    navigationLinks.forEach(link => {
        link.addEventListener("click", event => {
            const href = link.getAttribute("href");

            if (!href || href === "#") return;

            const target = document.querySelector(href);

            if (!target) return;

            event.preventDefault();

            const reduceMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            target.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
                block: "start"
            });

            // Keep the URL synchronized with the destination.
            if (window.location.hash !== href) {
                window.history.pushState(null, "", href);
            }
        });
    });
}
