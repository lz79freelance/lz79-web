/* =========================================================
   LZ79 FREELANCE · GALIA
   Buscador real + Chat + Menú + Modo pruebas
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       MENÚ
       ===================================================== */

    const menu = document.querySelector(".menu-toggle");
    const nav = document.querySelector("#mainNav");

    menu?.addEventListener("click", () => {
        nav?.classList.toggle("open");
    });

    document.querySelectorAll("#mainNav a").forEach(link => {
        link.addEventListener("click", () => {
            nav?.classList.remove("open");
        });
    });


    /* =====================================================
       GALIA OVERLAY
       ===================================================== */

    const overlay = document.querySelector("#galiaOverlay");

    const openGalia = () => {
        if (!overlay) return;

        overlay.classList.add("open");
        overlay.setAttribute("aria-hidden", "false");
        document.body.classList.add("no-scroll");

        setTimeout(() => {
            document.querySelector("#overlaySearch")?.focus();
        }, 150);
    };

    const closeGalia = () => {
        if (!overlay) return;

        overlay.classList.remove("open");
        overlay.setAttribute("aria-hidden", "true");
        document.body.classList.remove("no-scroll");
    };

    [
        "openGalia",
        "heroGalia",
        "galiaSearchCta",
        "contactGalia"
    ].forEach(id => {
        document
            .getElementById(id)
            ?.addEventListener("click", openGalia);
    });

    document
        .querySelector("#closeGalia")
        ?.addEventListener("click", closeGalia);

    overlay?.addEventListener("click", event => {
        if (event.target === overlay) {
            closeGalia();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeGalia();
        }
    });


    /* =====================================================
       CONTADOR
       ===================================================== */

    let searches = 0;

    const metric = document.querySelector("#metricText");

    function updateMetric() {
        if (!metric) return;

        metric.textContent =
            `${searches} ${searches === 1 ? "busca" : "buscas"}`;
    }


    /* =====================================================
       SEGURIDAD
       ===================================================== */

    function esc(value) {
        return String(value).replace(/[&<>'"]/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "'": "&#39;",
            '"': "&quot;"
        }[char]));
    }


    /* =====================================================
       ICONO SEGÚN RESULTADO
       ===================================================== */

    function getIcon(title = "") {

        const text = title.toLowerCase();

        if (
            text.includes("praia") ||
            text.includes("playa") ||
            text.includes("costa")
        ) {
            return "🏖️";
        }

        if (
            text.includes("torre") ||
            text.includes("faro")
        ) {
            return "🌊";
        }

        if (
            text.includes("camino") ||
            text.includes("camiño")
        ) {
            return "🥾";
        }

        if (
            text.includes("restaurante") ||
            text.includes("gastronom")
        ) {
            return "🍽️";
        }

        if (
            text.includes("arquitect") ||
            text.includes("palacios") ||
            text.includes("monumento")
        ) {
            return "🏛️";
        }

        if (
            text.includes("galicia") ||
            text.includes("españa") ||
            text.includes("espana")
        ) {
            return "🌿";
        }

        return "🐝";
    }


    /* =====================================================
       RENDER RESULTADOS REALES
       ===================================================== */

    function renderResults(data, target, query) {

        if (!target) return;

        if (!data || !Array.isArray(data.results)) {

            target.innerHTML = `
                <div class="empty-state">
                    <strong>🐝 Galia</strong>
                    <p>
                        Non se recibiron resultados.
                        Proba con outra busca.
                    </p>
                </div>
            `;

            target.classList.remove("hidden");
            return;
        }

        if (data.results.length === 0) {

            target.innerHTML = `
                <div class="empty-state">
                    <strong>🐝 Sen resultados</strong>
                    <p>
                        Non atopamos resultados para
                        <b>${esc(query)}</b>.
                    </p>
                </div>
            `;

            target.classList.remove("hidden");
            return;
        }

        target.classList.remove("hidden");

        target.innerHTML = data.results.map(result => {

            const title = result.title || "Sen título";
            const extract =
                result.extract ||
                "Non hai descrición dispoñible.";

            const url = result.url || "#";
            const image = result.image || "";

            return `
                <article class="result-card">

                    <div class="result-icon">
                        ${
                            image
                                ? `<img src="${esc(image)}"
                                    alt="${esc(title)}"
                                    style="width:64px;height:64px;object-fit:cover;border-radius:14px;">`
                                : getIcon(title)
                        }
                    </div>

                    <div style="flex:1">

                        <span class="result-place">
                            GALIA · WIKIPEDIA
                        </span>

                        <h3>
                            ${esc(title)}
                        </h3>

                        <p>
                            ${esc(extract)}
                        </p>

                        <div class="result-links">

                            <a
                                href="${esc(url)}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Ver máis →
                            </a>

                            <span>
                                Resultado real
                            </span>

                        </div>

                    </div>

                </article>
            `;

        }).join("");
    }


    /* =====================================================
       BUSCAR EN LA API
       ===================================================== */

    async function searchAPI(query, target) {

        const value = String(query || "").trim();

        if (!value || !target) {
            return;
        }

        searches++;
        updateMetric();

        target.classList.remove("hidden");

        target.innerHTML = `
            <div class="empty-state">
                🐝 <strong>Buscando...</strong>
                <p>
                    Galia está consultando os resultados.
                </p>
            </div>
        `;

        try {

            const response = await fetch(
                `/api/search?q=${encodeURIComponent(value)}`,
                {
                    method: "GET",
                    headers: {
                        "Accept": "application/json"
                    }
                }
            );

            if (!response.ok) {

                throw new Error(
                    `Erro HTTP ${response.status}`
                );

            }

            const data = await response.json();

            renderResults(
                data,
                target,
                value
            );

        } catch (error) {

            console.error(
                "Erro buscando en Galia:",
                error
            );

            target.classList.remove("hidden");

            target.innerHTML = `
                <div class="empty-state">

                    <strong>⚠️ Galia non puido realizar a busca</strong>

                    <p>
                        O servizo de busca non respondeu correctamente.
                    </p>

                    <small>
                        ${esc(error.message)}
                    </small>

                </div>
            `;
        }
    }


    /* =====================================================
       BUSCADOR PRINCIPAL
       ===================================================== */

    const searchInput =
        document.querySelector("#searchInput");

    const searchBtn =
        document.querySelector("#searchBtn");

    const searchResult =
        document.querySelector("#searchResult");

    searchBtn?.addEventListener("click", () => {

        searchAPI(
            searchInput?.value,
            searchResult
        );

    });

    searchInput?.addEventListener("keydown", event => {

        if (event.key === "Enter") {

            event.preventDefault();

            searchAPI(
                searchInput.value,
                searchResult
            );
        }

    });


    /* =====================================================
       BUSCADOR DEL OVERLAY GALIA
       ===================================================== */

    const overlaySearch =
        document.querySelector("#overlaySearch");

    const overlayBtn =
        document.querySelector("#overlaySearchBtn");

    const overlayResults =
        document.querySelector("#overlayResults");

    overlayBtn?.addEventListener("click", () => {

        searchAPI(
            overlaySearch?.value,
            overlayResults
        );

    });

    overlaySearch?.addEventListener("keydown", event => {

        if (event.key === "Enter") {

            event.preventDefault();

            searchAPI(
                overlaySearch.value,
                overlayResults
            );
        }

    });


    /* =====================================================
       BOTONES DE EJEMPLO
       ===================================================== */

    document
        .querySelectorAll("[data-query]")
        .forEach(button => {

            button.addEventListener("click", () => {

                const query =
                    button.dataset.query || "";

                openGalia();

                document
                    .querySelector('[data-tab="buscar"]')
                    ?.click();

                if (overlaySearch) {
                    overlaySearch.value = query;
                }

                searchAPI(
                    query,
                    overlayResults
                );

            });

        });


    /* =====================================================
       TABS
       ===================================================== */

    document
        .querySelectorAll(".tab")
        .forEach(tab => {

            tab.addEventListener("click", () => {

                document
                    .querySelectorAll(".tab")
                    .forEach(item => {
                        item.classList.remove("active");
                    });

                document
                    .querySelectorAll(".tab-panel")
                    .forEach(panel => {
                        panel.classList.remove("active");
                    });

                tab.classList.add("active");

                const panel =
                    document.getElementById(
                        tab.dataset.tab
                    );

                panel?.classList.add("active");
            });

        });


    /* =====================================================
       CHAT DEMO
       ===================================================== */

    const responses = [

        [
            "camiño",
            "Podo orientarte sobre etapas, localidades, lugares para comer, durmir e servizos do Camiño."
        ],

        [
            "camino",
            "Podo orientarte sobre etapas, localidades, lugares para comer, durmir e servizos do Camiño."
        ],

        [
            "galicia",
            "Galia está pensado como unha porta dixital a Galicia: busca, Hoxe, festas, turismo, patrimonio, negocios e chat."
        ],

        [
            "porriño",
            "O Porriño está moi ligado a Antonio Palacios, ao granito e ao patrimonio galego."
        ],

        [
            "porrino",
            "O Porriño está moi ligado a Antonio Palacios, ao granito e ao patrimonio galego."
        ],

        [
            "vigo",
            "Para Vigo podes buscar eventos, O Castro, restaurantes, praias ou calquera servizo local."
        ],

        [
            "antonio palacios",
            "Antonio Palacios é un exemplo perfecto para Galia: patrimonio, arquitectura, O Porriño e a súa conexión con Madrid."
        ],

        [
            "contabilidade",
            "LZ79 Essential é a aplicación de xestión e contabilidade de LZ79."
        ],

        [
            "comandas",
            "A solución de comandas está en desenvolvemento para hostalaría."
        ],

        [
            "empresa",
            "LZ79 crea e comercializa solucións dixitais para profesionais, autónomos e pequenas empresas."
        ]

    ];


    function answer(text) {

        const normalized =
            String(text)
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");

        for (const [key, message] of responses) {

            const normalizedKey =
                key
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "");

            if (normalized.includes(normalizedKey)) {
                return message;
            }
        }

        return (
            "🐝 Nesta versión podo falarche de Galicia, " +
            "O Porriño, Vigo, lugares, Camiño e solucións LZ79."
        );
    }


    /* =====================================================
       CHAT
       ===================================================== */

    const form =
        document.querySelector("#chatForm");

    const chatInput =
        document.querySelector("#chatInput");

    const messages =
        document.querySelector("#chatMessages");

    form?.addEventListener("submit", event => {

        event.preventDefault();

        if (!chatInput || !messages) {
            return;
        }

        const text =
            chatInput.value.trim();

        if (!text) {
            return;
        }

        const userMessage =
            document.createElement("div");

        userMessage.className =
            "bubble user";

        userMessage.textContent =
            text;

        const botMessage =
            document.createElement("div");

        botMessage.className =
            "bubble bot";

        botMessage.textContent =
            answer(text);

        messages.appendChild(userMessage);
        messages.appendChild(botMessage);

        chatInput.value = "";

        messages.scrollTop =
            messages.scrollHeight;

    });


    /* =====================================================
       INICIO
       ===================================================== */

    updateMetric();

});
