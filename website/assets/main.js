(function () {
  var root = document.documentElement;
  var cfg = window.SAMSOFT || { whatsapp: "", messages: { si: {}, en: {} } };

  function getLang() {
    var q = new URLSearchParams(location.search).get("lang");
    if (q === "si" || q === "en") return q;
    try { return localStorage.getItem("samsoft-ui-lang") || "en"; } catch (e) { return "en"; }
  }
  function setLang(l) {
    root.setAttribute("data-lang", l);
    root.setAttribute("lang", l);
    try { localStorage.setItem("samsoft-ui-lang", l); } catch (e) {}
    updateWa();
    document.querySelectorAll(".js-demo").forEach(function (a) {
      a.setAttribute("href", a.getAttribute("data-demo") + "&lang=" + l);
    });
  }

  // WhatsApp links: wa.me/<number>?text=<message>. With no number yet, they scroll to #contact.
  function updateWa() {
    var l = root.getAttribute("data-lang");
    var msgs = (cfg.messages && cfg.messages[l]) || {};
    document.querySelectorAll(".js-wa").forEach(function (a) {
      if (!cfg.whatsapp) { a.setAttribute("href", "#contact"); a.removeAttribute("target"); return; }
      var text = msgs[a.getAttribute("data-msg")] || msgs.general || "";
      a.setAttribute("href", "https://wa.me/" + cfg.whatsapp + "?text=" + encodeURIComponent(text));
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener");
    });
  }

  document.getElementById("langBtn").addEventListener("click", function () {
    setLang(root.getAttribute("data-lang") === "en" ? "si" : "en");
  });

  var nav = document.getElementById("nav");
  var menuBtn = document.getElementById("menuBtn");
  menuBtn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }
  });

  document.querySelectorAll(".card").forEach(function (c) {
    c.addEventListener("mousemove", function (e) { var b = c.getBoundingClientRect(); c.style.setProperty("--mx", ((e.clientX - b.left) / b.width * 100) + "%"); });
  });

  document.getElementById("year").textContent = new Date().getFullYear();
  setLang(getLang());
})();
