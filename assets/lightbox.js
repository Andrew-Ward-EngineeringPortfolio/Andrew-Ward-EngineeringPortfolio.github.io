// Simple image lightbox: click any <a class="zoom"> to view the image in a pop-up.
// Images with the same data-group can be stepped through with the arrow keys/buttons.
(function () {
  const links = Array.from(document.querySelectorAll("a.zoom"));
  if (!links.length || typeof HTMLDialogElement === "undefined") return;

  const dlg = document.createElement("dialog");
  dlg.className = "lightbox";
  dlg.setAttribute("aria-label", "Image viewer");
  dlg.innerHTML =
    '<button class="lb-close" type="button" aria-label="Close">&times;</button>' +
    '<button class="lb-prev" type="button" aria-label="Previous image">&#8249;</button>' +
    '<figure><img alt=""><figcaption></figcaption></figure>' +
    '<button class="lb-next" type="button" aria-label="Next image">&#8250;</button>';
  document.body.appendChild(dlg);

  const img = dlg.querySelector("img");
  const cap = dlg.querySelector("figcaption");
  const prev = dlg.querySelector(".lb-prev");
  const next = dlg.querySelector(".lb-next");
  let group = [], i = 0, opener = null;

  function show(n) {
    i = (n + group.length) % group.length;
    const a = group[i];
    img.src = a.getAttribute("href");
    img.alt = a.dataset.caption || "";
    cap.textContent = a.dataset.caption || "";
    const multi = group.length > 1;
    prev.hidden = next.hidden = !multi;
  }

  links.forEach((a) => {
    a.addEventListener("click", (ev) => {
      if (ev.ctrlKey || ev.metaKey || ev.shiftKey) return; // let users open in a new tab on purpose
      ev.preventDefault();
      opener = a;
      group = a.dataset.group ? links.filter((l) => l.dataset.group === a.dataset.group) : [a];
      show(group.indexOf(a));
      dlg.showModal();
      document.documentElement.classList.add("lb-open");
    });
  });

  prev.addEventListener("click", () => show(i - 1));
  next.addEventListener("click", () => show(i + 1));
  dlg.querySelector(".lb-close").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (ev) => { if (ev.target === dlg) dlg.close(); }); // backdrop click
  dlg.addEventListener("keydown", (ev) => {
    if (ev.key === "ArrowLeft" && group.length > 1) show(i - 1);
    if (ev.key === "ArrowRight" && group.length > 1) show(i + 1);
  });
  dlg.addEventListener("close", () => {
    document.documentElement.classList.remove("lb-open");
    img.removeAttribute("src");
    if (opener) opener.focus();
  });
})();
