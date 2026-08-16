/* =========================================================
   LZ79 FREELANCE · GALIA
   Buscador + Chat + Menú + Modo pruebas
   Sin API externa
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
       CONTADOR DE BÚSQUEDAS
       ===================================================== */

    let searches = 0;

    const metric = document.querySelector("#metricText");

    function updateMetric() {

        if (!metric) return;

        metric.textContent =
            `${searches} ${searches === 1 ? "busca" : "buscas"}`;

    }


    /* =====================================================
       SEGURIDAD HTML
       ===================================================== */

    function esc(value) {

        return String(value).replace(/[&<>'"]/g, char => {

            const entities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "'": "&#39;",
                '"': "&quot;"
            };

            return entities[char];

        });

    }


    /* =====================================================
       BASE DE DATOS LOCAL DE GALIA
       ===================================================== */

    const places = [

        {
            keys: [
                "porriño",
                "o porriño",
                "porrino"
            ],
            title: "O Porriño",
            place: "Pontevedra · Galicia",
            icon: "📍",
            text:
                "Localidade galega coñecida pola súa relación coa arquitectura de Antonio Palacios, o granito e a súa situación no sur de Galicia."
        },

        {
            keys: [
                "antonio palacios",
                "palacios"
            ],
            title: "Antonio Palacios",
            place: "O Porriño · Galicia",
            icon: "🏛️",
            text:
                "Arquitecto nacido en O Porriño. Galia pode conectar patrimonio, arquitectura, historia local e lugares relacionados coa súa obra."
        },

        {
            keys: [
                "torre de hércules",
                "torre de hercules"
            ],
            title: "Torre de Hércules",
            place: "A Coruña · Galicia",
            icon: "🌊",
            text:
                "Faro romano situado na cidade da Coruña. Un dos grandes símbolos do patrimonio de Galicia."
        },

        {
            keys: [
                "praia das catedrais",
                "playa de las catedrales"
            ],
            title: "Praia das Catedrais",
            place: "Ribadeo · Lugo · Galicia",
            icon: "🏖️",
            text:
                "Un dos espazos naturais máis coñecidos da costa galega, famoso polos seus arcos e formacións rochosas."
        },

        {
            keys: [
                "camiño de santiago",
                "camino de santiago"
            ],
            title: "Camiño de Santiago",
            place: "Galicia",
            icon: "🥾",
            text:
                "Galia pode axudar a descubrir etapas, localidades, lugares para comer, durmir, transporte e servizos para peregrinos."
        },

        {
            keys: [
                "castro de vigo",
                "o castro de vigo"
            ],
            title: "O Castro de Vigo",
            place: "Vigo · Pontevedra",
            icon: "🏛️",
            text:
                "Espazo histórico e natural de Vigo con vistas sobre a cidade e a ría."
        },

        {
            keys: [
                "vigo"
            ],
            title: "Vigo",
            place: "Pontevedra · Galicia",
            icon: "📍",
            text:
                "Busca local de proba sobre Vigo: patrimonio, praias, gastronomía, eventos, negocios e lugares para descubrir."
        },

        {
            keys: [
                "restaurante",
                "restaurantes",
                "onde comer",
                "comer"
            ],
            title: "Restaurantes en Galicia",
            place: "Galicia",
            icon: "🍽️",
            text:
                "Galia poderá utilizar buscas locais para descubrir restaurantes, bares, cafeterías e outros negocios da zona."
        },

        {
            keys: [
                "eventos",
                "evento",
                "que facer",
                "hoxe"
            ],
            title: "Hoxe en Galicia",
            place: "Galicia",
            icon: "📅",
            text:
                "O módulo Hoxe está pensado para mostrar eventos, festas, actividades, cultura e cousas que facer segundo a localidade."
        },

        {
            keys: [
                "galicia"
            ],
            title: "Galicia",
            place: "Galicia",
            icon: "🌿",
            text:
                "Galia nace como unha porta dixital a Galicia para descubrir lugares, patrimonio, turismo, negocios, festas e información local."
        },

        {
            keys: [
                "contabilidade",
                "contable",
                "essential"
            ],
            title: "LZ79 Essential",
            place: "LZ79 Freelance",
            icon: "💼",
            text:
                "Aplicación de xestión e contabilidade orientada a autónomos e pequenas empresas."
        },

        {
            keys: [
                "comandas"
            ],
            title: "Comandas e mesas",
            place: "LZ79 Freelance",
            icon: "🍽️",
            text:
                "Solución LZ79 en desenvolvemento para hostalaría, mesas, pedidos, barra e cociña."
        },

        {
            keys: [
                "inventario"
            ],
            title: "Inventario e operacións",
            place: "LZ79 Freelance",
            icon: "📦",
            text:
                "Ferramentas para controlar produtos, entradas, saídas e operacións dun negocio."
        }

    ];


    /* =====================================================
       BUSCADOR
       ===================================================== */

    function findResult(query) {

        const original = query.trim();
        const text = original
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        if (!text) {
            return null;
        }

        for (const item of places) {

            for (const key of item.keys) {

                const normalizedKey = key
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "");

                if (text.includes(normalizedKey)) {
                    return item;
                }

            }

        }

        /* Resultado genérico para cualquier búsqueda */

        return {
            title: original,
            place: "Resultados de proba · Galia",
            icon: "🐝",
            text:
                `Galia recibiu a túa busca «${original}». Nesta versión de proba aínda non está conectado o buscador de Internet. O seguinte paso será conectar o motor de busca real.`
        };

    }


    /* =====================================================
       MOSTRAR RESULTADO
       ===================================================== */

    function renderResult(query, target) {

        if (!target) return;

        const result = findResult(query);

        if (!result) {
            target.innerHTML = "";
            target.classList.add("hidden");
            return;
        }

        target.classList.remove("hidden");

        target.innerHTML = `
            <article class="result-card">

                <div class="result-icon">
                    ${esc(result.icon)}
                </div>

                <div>

                    <span class="result-place">
                        ${esc(result.place)}
                    </span>

                    <h3>
                        ${esc(result.title)}
                    </h3>

                    <p>
                        ${esc(result.text)}
                    </p>

                    <div class="result-links">

                        <button
                            type="button"
                            class="result-more"
                            data-query="${esc(query)}">
                            Ver máis
                        </button>

                        <span>
                            Galia · modo probas
                        </span>

                    </div>

                </div>

            </article>
        `;

    }


    /* =====================================================
       EJECUTAR BUSQUEDA
       ===================================================== */

    function doSearch(query, target) {

        const value = String(query || "").trim();

        if (!value) {
            return;
        }

        searches++;

        updateMetric();

        renderResult(value, target);

    }


    /* =====================================================
       BUSCADOR PRINCIPAL DE LA WEB
       ===================================================== */

    const searchInput =
        document.querySelector("#searchInput");

    const searchBtn =
        document.querySelector("#searchBtn");

    const searchResult =
        document.querySelector("#searchResult");


    searchBtn?.addEventListener("click", () => {

        doSearch(
            searchInput?.value,
            searchResult
        );

    });


    searchInput?.addEventListener("keydown", event => {

        if (event.key === "Enter") {

            event.preventDefault();

            doSearch(
                searchInput.value,
                searchResult
            );

        }

    });


    /* =====================================================
       BUSCADOR DE GALIA
       ===================================================== */

    const overlaySearch =
        document.querySelector("#overlaySearch");

    const overlayBtn =
        document.querySelector("#overlaySearchBtn");

    const overlayResults =
        document.querySelector("#overlayResults");


    overlayBtn?.addEventListener("click", () => {

        doSearch(
            overlaySearch?.value,
            overlayResults
        );

    });


    overlaySearch?.addEventListener("keydown", event => {

        if (event.key === "Enter") {

            event.preventDefault();

            doSearch(
                overlaySearch.value,
                overlayResults
            );

        }

    });


    /* =====================================================
       BOTONES data-query
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

                doSearch(
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
                    .forEach(item =>
                        item.classList.remove("active")
                    );

                document
                    .querySelectorAll(".tab-panel")
                    .forEach(panel =>
                        panel.classList.remove("active")
                    );

                tab.classList.add("active");

                const panel =
                    document.getElementById(
                        tab.dataset.tab
                    );

                panel?.classList.add("active");

            });

        });


    /* =====================================================
       CHAT
       ===================================================== */

    const responses = [

        [
            "camiño",
            "Podo orientarte sobre etapas, localidades, lugares para comer, durmir e servizos do Camiño. Nesta versión o contido é ilustrativo."
        ],

        [
            "camino",
            "Podo orientarte sobre etapas, localidades, lugares para comer, durmir e servizos do Camiño. Nesta versión o contido é ilustrativo."
        ],

        [
            "galicia",
            "Galia está pensado como unha porta dixital a Galicia: busca, Hoxe, festas, turismo, patrimonio, negocios e chat."
        ],

        [
            "porriño",
            "O Porriño é unha localidade moi ligada a Antonio Palacios e ao granito. Galia poderá ofrecer información local, patrimonio, negocios e turismo."
        ],

        [
            "porrino",
            "O Porriño é unha localidade moi ligada a Antonio Palacios e ao granito. Galia poderá ofrecer información local, patrimonio, negocios e turismo."
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

        const normalized = String(text)
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        for (const [key, message] of responses) {

            const normalizedKey = key
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");

            if (normalized.includes(normalizedKey)) {
                return message;
            }

        }

        return (
            "🐝 Nesta versión de proba podo falarche de Galicia, " +
            "O Porriño, Vigo, lugares, Camiño e solucións LZ79. " +
            "Proba con «Porriño», «Vigo», «Antonio Palacios» ou «Camiño de Santiago»."
        );

    }


    /* =====================================================
       FORMULARIO CHAT
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
       "VER MÁS"
       ===================================================== */

    document.addEventListener("click", event => {

        const button =
            event.target.closest(".result-more");

        if (!button) return;

        const query =
            button.dataset.query || "";

        if (overlayResults) {

            doSearch(
                query,
                overlayResults
            );

        }

    });


    /* =====================================================
       INICIO
       ===================================================== */

    updateMetric();

});
