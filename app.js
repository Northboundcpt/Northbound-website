(function () {
  const escapeHTML = (value = "") => String(value).replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[char]));

  const whatsappURL = (number, prompt = "I'd like to book a Northie.") =>
    `https://wa.me/${String(number).replace(/\D/g, "")}?text=${encodeURIComponent(`Hi Northbound! ${prompt}`)}`;

  fetch("content/site.json", { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error("Website content could not be loaded");
      return response.json();
    })
    .then((data) => {
      const { business, hero, services, deepCleanPrices, extras, propertyServices, about, faqs } = data;

      document.querySelector(".hero .eyebrow").textContent = hero.eyebrow;
      document.querySelector(".hero h1").textContent = hero.heading;
      document.querySelector(".hero h1 + p").textContent = hero.description;
      document.querySelector(".hero .small").textContent = hero.serviceLine;

      document.querySelector("#services .grid").innerHTML = services.map((service) => `
        <article class="card">
          <h3>${escapeHTML(service.name)}</h3>
          <div class="price">${escapeHTML(service.price)}</div>
          <p>${escapeHTML(service.description)}</p>
          <p><strong>Best for:</strong> ${escapeHTML(service.bestFor)}</p>
        </article>`).join("");

      document.querySelector("#pricing .price-list").innerHTML = deepCleanPrices.map((item) => `
        <div class="row"><span>${escapeHTML(item.label)}</span><strong>${escapeHTML(item.price)}</strong></div>`).join("");
      const extrasCard = document.querySelector("#pricing .card");
      extrasCard.innerHTML = `<h3>Add a little extra care</h3>
        <p><strong>Linen change</strong><br>${escapeHTML(extras.linenChange)}</p>
        <p><strong>Linen + laundry</strong><br>${escapeHTML(extras.linenLaundry)}</p>
        <p class="small" style="color:#d7dbea">${escapeHTML(extras.note)}</p>`;

      document.querySelector("#properties .grid").innerHTML = propertyServices.map((service) => `
        <div class="card"><h3>${escapeHTML(service.name)}</h3><p>${escapeHTML(service.description)}</p>
          <a class="btn primary" href="${whatsappURL(business.whatsapp, service.whatsappPrompt)}">${escapeHTML(service.button)}</a>
        </div>`).join("");

      const aboutSection = document.querySelector("#about");
      aboutSection.querySelector("h2").textContent = about.heading;
      aboutSection.querySelector(".grid .card").innerHTML = about.paragraphs.map((paragraph, index) =>
        `<p>${index === about.paragraphs.length - 1 ? `<strong>${escapeHTML(paragraph)}</strong>` : escapeHTML(paragraph)}</p>`
      ).join("") + `<p>— ${escapeHTML(business.founder)}, Founder of Northbound</p>`;

      const faqWrap = document.querySelector(".faq .wrap");
      faqWrap.querySelectorAll("details").forEach((detail) => detail.remove());
      faqWrap.insertAdjacentHTML("beforeend", faqs.map((faq) =>
        `<details><summary>${escapeHTML(faq.question)}</summary><p>${escapeHTML(faq.answer)}</p></details>`
      ).join(""));

      const bookingURL = whatsappURL(business.whatsapp);
      document.querySelectorAll('a[href*="wa.me"]').forEach((link) => {
        if (!link.closest("#properties")) link.href = bookingURL;
      });
      document.querySelector(".footer p:not(.small)").textContent = `${business.instagram} · ${business.website}`;
      document.querySelector(".footer .small").textContent = hero.serviceLine;
    })
    .catch((error) => console.warn(error.message));
})();
