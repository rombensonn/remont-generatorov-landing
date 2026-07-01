import { animate, inView, scroll, stagger } from "https://cdn.jsdelivr.net/npm/motion@12.42.2/+esm";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const siteHeader = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const siteMenu = document.querySelector("#site-menu");

if (siteHeader && menuToggle && siteMenu) {
    const setMenuOpen = (isOpen) => {
        siteHeader.classList.toggle("nav-open", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
    };

    menuToggle.addEventListener("click", (event) => {
        event.stopPropagation();
        setMenuOpen(!siteHeader.classList.contains("nav-open"));
    });

    siteMenu.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    siteMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setMenuOpen(false));
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setMenuOpen(false);
        }
    });

    document.addEventListener("click", (event) => {
        if (siteHeader.classList.contains("nav-open") && !siteHeader.contains(event.target)) {
            setMenuOpen(false);
        }
    });
}

if (!prefersReducedMotion) {
    document.documentElement.classList.add("motion-ready");

    requestAnimationFrame(() => {
        const heroItems = document.querySelectorAll("[data-hero-motion]");

        animate(
            heroItems,
            { opacity: [0, 1], y: [18, 0], filter: ["blur(8px)", "blur(0px)"] },
            { duration: .8, delay: stagger(.07), ease: [.22, 1, .36, 1] }
        );

        const progressBar = document.querySelector(".scroll-progress");
        if (progressBar) {
            scroll(animate(progressBar, { scaleX: [0, 1] }, { ease: "linear" }));
        }

        document.querySelectorAll("[data-motion]").forEach((section) => {
            inView(
                section,
                (element) => {
                    const items = element.querySelectorAll("[data-motion-item]");

                    if (items.length > 0) {
                        animate(
                            items,
                            { opacity: [0, 1], y: [28, 0], filter: ["blur(7px)", "blur(0px)"] },
                            { duration: .72, delay: stagger(.08), ease: [.22, 1, .36, 1] }
                        );
                    } else {
                        animate(
                            element,
                            { opacity: [0, 1], y: [26, 0], filter: ["blur(6px)", "blur(0px)"] },
                            { duration: .72, ease: [.22, 1, .36, 1] }
                        );
                    }
                },
                { amount: .18, margin: "0px 0px -12% 0px" }
            );
        });

        document.querySelectorAll("[data-count]").forEach((counter) => {
            inView(counter, (element) => {
                const target = Number(element.dataset.count);
                const decimals = Number(element.dataset.decimals || 0);
                const formatter = new Intl.NumberFormat("ru-RU", {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals,
                });

                animate(0, target, {
                    duration: 1.15,
                    ease: "easeOut",
                    onUpdate: (latest) => {
                        element.textContent = formatter.format(latest);
                    },
                });
            });
        });

        document.querySelectorAll("[data-tilt]").forEach((card) => {
            card.addEventListener("pointerenter", () => {
                animate(card, { y: -8, scale: 1.01 }, { duration: .28, ease: "easeOut" });
            });

            card.addEventListener("pointerleave", () => {
                animate(card, { y: 0, scale: 1 }, { duration: .34, ease: [.22, 1, .36, 1] });
            });
        });

        document.querySelectorAll("[data-glass]").forEach((glass) => {
            glass.addEventListener("pointermove", (event) => {
                const rect = glass.getBoundingClientRect();
                const x = ((event.clientX - rect.left) / rect.width) * 100;
                const y = ((event.clientY - rect.top) / rect.height) * 100;

                glass.style.setProperty("--glass-x", `${x}%`);
                glass.style.setProperty("--glass-y", `${y}%`);
            });

            glass.addEventListener("pointerleave", () => {
                animate(
                    glass,
                    { "--glass-x": "50%", "--glass-y": "50%" },
                    { duration: .45, ease: [.22, 1, .36, 1] }
                );
            });
        });

        document.querySelectorAll(".button, .header-call, .menu-toggle, .nav-links a, .service-action").forEach((control) => {
            control.addEventListener("pointerdown", () => {
                animate(control, { scale: .975 }, { duration: .12, ease: "easeOut" });
            });

            control.addEventListener("pointerup", () => {
                animate(control, { scale: 1 }, { type: "spring", stiffness: 480, damping: 24 });
            });

            control.addEventListener("pointercancel", () => {
                animate(control, { scale: 1 }, { duration: .18, ease: "easeOut" });
            });
        });
    });
} else {
    document.documentElement.classList.add("motion-reduced");
}
