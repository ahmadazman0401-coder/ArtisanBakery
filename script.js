const WHATSAPP_NUMBER = "601XXXXXXXX";

const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const toast = document.querySelector("#toast");
let toastTimer;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3600);
}

function closeMenu() {
  menuButton?.setAttribute("aria-expanded", "false");
  siteNav?.classList.remove("open");
  document.body.classList.remove("menu-open");
}

menuButton?.addEventListener("click", () => {
  const opening = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(opening));
  siteNav?.classList.toggle("open", opening);
  document.body.classList.toggle("menu-open", opening);
});

siteNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const filterButtons = document.querySelectorAll("[data-filter]");
const products = document.querySelectorAll(".product[data-category]");

filterButtons.forEach((button) => {
  button.setAttribute("aria-pressed", String(button.classList.contains("active")));
  button.addEventListener("click", () => {
    const category = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    products.forEach((product) => {
      const categories = product.dataset.category.split(" ");
      product.classList.toggle("hidden", category !== "all" && !categories.includes(category));
    });

    showToast(category === "all" ? "Showing the full bakery menu." : `Showing ${button.textContent.trim().toLowerCase()}.`);
  });
});

function whatsappIsConfigured() {
  return /^601\d{7,9}$/.test(WHATSAPP_NUMBER);
}

async function openWhatsApp(message) {
  if (whatsappIsConfigured()) {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    return true;
  }

  try {
    await navigator.clipboard.writeText(message);
    showToast("Order message copied. Add the real WhatsApp number in script.js to open WhatsApp automatically.");
  } catch {
    showToast("Add the real WhatsApp number in script.js to activate ordering.");
  }
  return false;
}

document.querySelectorAll("[data-whatsapp-direct]").forEach((button) => {
  button.addEventListener("click", () => {
    openWhatsApp("Hi Crumb & Co.! I’d like to place an order. Could you share today’s menu, availability and pickup/delivery details?");
  });
});

document.querySelectorAll("[data-order-product]").forEach((button) => {
  button.addEventListener("click", () => {
    const product = button.dataset.orderProduct;
    openWhatsApp([
      "Hi Crumb & Co.! I’d like to ask about an item from your menu.",
      "",
      `Item: ${product}`,
      "Quantity: ",
      "Preferred date: ",
      "Pickup / delivery: ",
      "",
      "Please confirm availability and the final price. Thank you!"
    ].join("\n"));
  });
});

const cakeDate = document.querySelector("#cake-date");
if (cakeDate) {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split("T")[0];
  cakeDate.min = localDate;
}

document.querySelector("#cake-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const message = [
    "Hi Crumb & Co.! I’d like to request a custom cake.",
    "",
    `Name: ${data.get("name")}`,
    `WhatsApp: ${data.get("whatsapp")}`,
    `Occasion: ${data.get("occasion")}`,
    `Cake size: ${data.get("size")}`,
    `Flavour: ${data.get("flavour")}`,
    `Theme / colours: ${data.get("theme") || "Not specified"}`,
    `Date needed: ${data.get("date")}`,
    `Budget: ${data.get("budget")}`,
    `Reference image note: ${data.get("reference") || "No reference yet"}`,
    "",
    "I understand the design, price and availability still need confirmation. Thank you!"
  ].join("\n");
  openWhatsApp(message);
});

document.querySelectorAll("[data-placeholder-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showToast(`${link.dataset.placeholderLink} is still a placeholder. Add the business’s real link before publishing.`);
  });
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("visible"));
} else {
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      instance.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -35px" });
  revealItems.forEach((item) => observer.observe(item));
}

document.querySelector("#year").textContent = new Date().getFullYear();
