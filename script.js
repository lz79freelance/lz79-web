/* =========================================================
   LZ79 FREELANCE · GALIA
   Script principal
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================
       MENÚ MÓVIL
       ========================================================= */

    const menu = document.querySelector('.menu-toggle');
    const nav = document.querySelector('#mainNav');

    menu?.addEventListener('click', () => {
        nav?.classList.toggle('open');
    });

    document.querySelectorAll('#mainNav a').forEach(link => {
        link.addEventListener('click', () => {
            nav?.classList.remove('open');
        });
    });


    /* =========================================================
       GALIA · OVERLAY
       ========================================================= */

    const overlay = document.querySelector('#galiaOverlay');

    const openGalia = () => {
        if (!overlay) return;

        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');

        setTimeout(() => {
            document.querySelector('#overlaySearch')?.focus();
        }, 120);
    };

    const closeGalia = () => {
        if (!overlay) return;

        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
    };

    [
        'openGalia',
        'heroGalia',
        'galiaSearchCta',
        'contactGalia'
    ].forEach(id => {
        document.getElementById(id)?.addEventListener('click', openGalia);
    });

    document.querySelector('#closeGalia')?.addEventListener('click', closeGalia);

    overlay?.addEventListener('click', event => {
        if (event.target === overlay) {
            closeGalia();
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeGalia();
        }
    });


    /* =========================================================
       MÉTRICA DE BÚSQUEDAS
       ========================================================= */

    let searches = 0;

    const metric = document.querySelector('#metricText');

    function updateMetric() {
        if (!metric) return;

        metric.textContent =
            `${searches} ${searches === 1 ? 'busca' : 'buscas'}`;
    }


    /* =========================================================
       RESULTADOS DEMO
       ========================================================= */

    const examples = {

        'antonio palacios': {
            title: 'Antonio Palacios · arquitecto',
            place: 'O Porriño · Galicia',
            icon: '🏛️',
            text: 'Arquitectura, patrimonio, biografía e conexión entre O Porriño e Madrid.'
        },

        'torre de hércules': {
            title: 'Torre de Hércules',
            place: 'A Coruña · Galicia',
            icon: '🌊',
            text: 'Patrimonio, historia e información para descubrir o faro romano.'
        },

        'praia das catedrais': {
            title: 'Praia das Catedrais',
            place: 'Ribadeo · Galicia',
            icon: '🏖️',
            text: 'Natureza, costa e información para planificar a visita.'
        },

        'camiño de santiago': {
            title: 'Camiño de Santiago',
            place: 'Galicia',
            icon: '🥾',
            text: 'Etapas, localidades, servizos e información útil para peregrinos.'
        },

        'o castro de vigo': {
            title: 'O Castro de Vigo',
            place: 'Vigo · Galicia',
            icon: '🏛️',
            text: 'Patrimonio, vistas da ría e un lugar perfecto para descubrir Vigo.'
        },

        'restaurantes en vigo': {
            title: 'Restaurantes en Vigo',
            place: 'Vigo · Galicia',
            icon: '🍽️',
            text: 'Busca local para descubrir restaurantes e servizos de hostalaría.'
        },

        'eventos en vigo hoxe': {
            title: 'Eventos en Vigo hoxe',
            place: 'Vigo · Galicia',
            icon: '🎭',
            text: 'Eventos, actividades e programación da localidade.'
        }
    };


    /* =========================================================
       ESCAPAR HTML
       ========================================================= */

    function esc(value) {

        return String(value).replace(
            /[&<>'"]/g,
            char => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[char])
        );
    }


    /* =========================================================
       BUSCADOR LOCAL
       ========================================================= */

    function findLocalResult(query) {

        const text = query
            .toLowerCase()
            .trim();

        /* Coincidencias exactas o contenidas */

        for (const key of Object.keys(examples)) {

            if (text.includes(key)) {
                return examples[key];
            }
        }


        /* Vigo */

        if (text.includes('vigo')) {

            return {
                title: 'Vigo',
                place: 'Pontevedra · Galicia',
                icon: '📍',
                text: 'Información local sobre patrimonio, eventos, gastronomía, praias e negocios.'
            };
        }


        /* O Porriño */

        if (
            text.includes('porriño') ||
            text.includes('porrino')
        ) {

            return {
                title: 'O Porriño',
                place: 'Pontevedra · Galicia',
                icon: '📍',
                text: 'Localidade do sur de Galicia. Descubre patrimonio, negocios, gastronomía, servizos e lugares próximos.'
            };
        }


        /* Pontevedra */

        if (text.includes('pontevedra')) {

            return {
                title: 'Pontevedra',
                place: 'Galicia',
                icon: '🏛️',
                text: 'Patrimonio, casco histórico, cultura, gastronomía e información local.'
            };
        }


        /* Galicia */

        if (text.includes('galicia')) {

            return {
                title: 'Galicia',
                place: 'Galicia',
                icon: '🌿',
                text: 'Unha porta dixital para descubrir patrimonio, turismo, festas, gastronomía, negocios e información local.'
            };
        }


        /* Restaurante */

        if (
            text.includes('restaurante') ||
            text.includes('comer') ||
            text.includes('onde comer')
        ) {

            return {
                title: 'Onde comer',
                place: 'Busca local',
                icon: '🍽️',
                text: 'Galia pode axudar a descubrir restaurantes, bares, cafeterías e outros negocios locais.'
            };
        }


        /* Turismo */

        if (
            text.includes('turismo') ||
            text.includes('visitar') ||
            text.includes('que facer')
        ) {

            return {
                title: 'Que facer',
                place: 'Galicia',
                icon: '🎉',
                text: 'Lugares, patrimonio, natureza, cultura e actividades para descubrir.'
            };
        }


        /* Resultado genérico */

        return {
            title: query,
            place: 'Galia · busca local',
            icon: '🐝',
            text: `Galia recibiu a túa busca "${query}". Este resultado é actualmente unha demostración local. O seguinte paso é conectar o buscador cun servizo real de Internet.`
        };
    }


    /* =========================================================
       PINTAR RESULTADO
       ========================================================= */

    function renderResult(query, target) {

        if (!target) return;

        const result = findLocalResult(query);

        target.classList.remove('hidden');

        target.innerHTML = `
            <article class="result-card">

                <div class="result-icon">
                    ${result.icon}
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


    /* =========================================================
       EJECUTAR BÚSQUEDA
       ========================================================= */

    function doSearch(query, target) {

        if (!query) return;

        query = query.trim();

        if (!query) return;

        searches++;

        updateMetric();

        renderResult(query, target);
    }


    /* =========================================================
       BUSCADOR PRINCIPAL DE LA WEB
       ========================================================= */

    const searchInput =
        document.querySelector('#searchInput');

    const searchBtn =
        document.querySelector('#searchBtn');

    const searchResult =
        document.querySelector('#searchResult');


    searchBtn?.addEventListener('click', () => {

        doSearch(
            searchInput?.value || '',
            searchResult
        );

    });


    searchInput?.addEventListener('keydown', event => {

        if (event.key === 'Enter') {

            event.preventDefault();

            doSearch(
                searchInput?.value || '',
                searchResult
            );
        }

    });


    /* =========================================================
       BUSCADOR DENTRO DE GALIA
       ========================================================= */

    const overlaySearch =
        document.querySelector('#overlaySearch');

    const overlayBtn =
        document.querySelector('#overlaySearchBtn');

    const overlayResults =
        document.querySelector('#overlayResults');


    overlayBtn?.addEventListener('click', () => {

        doSearch(
            overlaySearch?.value || '',
            overlayResults
        );

    });


    overlaySearch?.addEventListener('keydown', event => {

        if (event.key === 'Enter') {

            event.preventDefault();

            doSearch(
                overlaySearch?.value || '',
                overlayResults
            );
        }

    });


    /* =========================================================
       BOTONES CON data-query
       ========================================================= */

    document.querySelectorAll('[data-query]').forEach(button => {

        button.addEventListener('click', () => {

            const query =
                button.dataset.query || '';

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


    /* =========================================================
       PESTAÑAS DE GALIA
       ========================================================= */

    document.querySelectorAll('.tab').forEach(tab => {

        tab.addEventListener('click', () => {

            document
                .querySelectorAll('.tab')
                .forEach(item => {
                    item.classList.remove('active');
                });

            document
                .querySelectorAll('.tab-panel')
                .forEach(panel => {
                    panel.classList.remove('active');
                });

            tab.classList.add('active');

            const panel =
                document.getElementById(tab.dataset.tab);

            panel?.classList.add('active');
        });

    });


    /* =========================================================
       CHAT DEMO
       ========================================================= */

    const responses = [

        [
            'camiño',
            'Podo orientarte sobre etapas, localidades e servizos do Camiño. Nesta versión o contido é ilustrativo.'
        ],

        [
            'galicia',
            'Galia está pensado como unha porta dixital a Galicia: busca, hoxe, festas, turismo, negocios e chat.'
        ],

        [
            'vigo',
            'Para Vigo podes buscar eventos, O Castro, restaurantes ou calquera servizo local.'
        ],

        [
            'porriño',
            'O Porriño é unha das localidades que Galia pode utilizar como referencia para información local.'
        ],

        [
            'antonio palacios',
            'Antonio Palacios é un exemplo perfecto para Galia: patrimonio, O Porriño e a súa conexión con Madrid.'
        ],

        [
            'contabilidade',
            'LZ79 Essential é a aplicación de xestión e contabilidade de LZ79.'
        ],

        [
            'comandas',
            'A solución de comandas está en desenvolvemento para hostalaría.'
        ],

        [
            'empresa',
            'LZ79 crea e comercializa solucións dixitais para profesionais e pequenas empresas.'
        ]
    ];


    function answer(text) {

        const query =
            text.toLowerCase().trim();

        for (const [key, response] of responses) {

            if (query.includes(key)) {
                return response;
            }

        }

        return '🐝 Nesta demo podo falarche de Galicia, lugares, Camiño, Galia e solucións LZ79. Proba “Vigo”, “O Porriño”, “Antonio Palacios” ou “Camiño de Santiago”.';
    }


    const form =
        document.querySelector('#chatForm');

    const input =
        document.querySelector('#chatInput');

    const messages =
        document.querySelector('#chatMessages');


    form?.addEventListener('submit', event => {

        event.preventDefault();

        const text =
            input?.value.trim();

        if (!text || !messages) return;


        /* Mensaxe usuario */

        messages.insertAdjacentHTML(
            'beforeend',
            `
            <div class="bubble user">
                ${esc(text)}
            </div>
            `
        );


        /* Resposta Galia */

        messages.insertAdjacentHTML(
            'beforeend',
            `
            <div class="bubble bot">
                ${esc(answer(text))}
            </div>
            `
        );


        input.value = '';

        messages.scrollTop =
            messages.scrollHeight;
    });


    /* =========================================================
       INICIALIZACIÓN
       ========================================================= */

    updateMetric();

});
