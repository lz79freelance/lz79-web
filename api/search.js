/* ============================================================
   GALIA BUSCADOR + METRICS · PROTOTIPO REAL
   ============================================================ */
const GALIA_SEARCH = {
    ENDPOINT: "/api/search",
    STORAGE_KEY: "galia_metrics_v1",
    SESSION_KEY: "galia_session_v1"
};

function idiomaBusqueda(texto) {
    const t = texto.toLowerCase();
    const eu = /(zer|zein|nola|non|noiz|bilatu|bilatzen|turismoa|jatetxe|etxe|landa|galizia|nahi|dezake|daiteke|egingo|ikusi)/.test(t);
    const cat = /(què|quina|quin|com|on|quan|buscar|cerca|restaurants|turisme|casa rural|galícia|puc|pots|vull|fer|veure)/.test(t);
    const gl = /(onde|como|canto|podo|podes|quero|queres|hai|unha|unhas|facer|atopar|buscar|casa rural|galicia|visitar|comer)/.test(t);
    const es = /(qué|dónde|cómo|cuánto|puedo|puedes|quiero|quieres|hay|una|unas|hacer|encontrar|buscar|casa rural|galicia|visitar|comer)/.test(t);

    if (eu && !cat && !gl && !es) return "eu";
    if (cat && !eu && !gl && !es) return "cat";
    if (gl && !eu && !cat && !es) return "gl";
    if (es && !eu && !cat && !gl) return "es";

    return document.querySelector(".galia-lang.active")?.dataset.galiaLang || "es";
}

function cargarMetricas() {
    let data;
    try { data = JSON.parse(localStorage.getItem(GALIA_SEARCH.STORAGE_KEY) || "{}"); }
    catch (_) { data = {}; }

    if (!data.date) data.date = new Date().toISOString().slice(0,10);
    if (!data.visits) data.visits = 0;
    if (!data.searches) data.searches = 0;
    if (!data.sessions) data.sessions = 0;
    if (!data.languages) data.languages = {es:0, gl:0, eu:0, cat:0};
    return data;
}

function guardarMetricas(data) {
    localStorage.setItem(GALIA_SEARCH.STORAGE_KEY, JSON.stringify(data));
}

function registrarVisita() {
    const data = cargarMetricas();
    const session = sessionStorage.getItem(GALIA_SEARCH.SESSION_KEY);
    if (!session) {
        sessionStorage.setItem(GALIA_SEARCH.SESSION_KEY, "1");
        data.sessions += 1;
    }
    data.visits += 1;
    guardarMetricas(data);
    renderMetricas();
}

function registrarBusqueda(lang) {
    const data = cargarMetricas();
    data.searches += 1;
    data.languages[lang] = (data.languages[lang] || 0) + 1;
    guardarMetricas(data);
    renderMetricas();
}

function renderMetricas() {
    const data = cargarMetricas();
    const visitsEl = document.getElementById("metric-visits");
    const searchesEl = document.getElementById("metric-searches");
    const sessionsEl = document.getElementById("metric-sessions");
    
    if (visitsEl) visitsEl.textContent = data.visits;
    if (searchesEl) searchesEl.textContent = data.searches;
    if (sessionsEl) sessionsEl.textContent = data.sessions;

    ["es","gl","eu","cat"].forEach(l => {
        const el = document.getElementById("m-" + l);
        if (el) el.textContent = data.languages[l] || 0;
    });
    
    const total = (data.languages.es || 0) + (data.languages.gl || 0) + (data.languages.eu || 0) + (data.languages.cat || 0);
    ["es","gl","eu","cat"].forEach(l => {
        const bar = document.getElementById("bar-" + l);
        if (bar) bar.style.width = total ? Math.round(((data.languages[l] || 0) / total) * 100) + "%" : "0%";
    });
}

function mostrarResultados(results, query) {
    const container = document.getElementById("search-results");
    const status = document.getElementById("search-status");
    if (!container) return;
    
    container.innerHTML = "";

    if (!results || results.length === 0) {
        if (status) status.textContent = `Non se atoparon resultados para: "${query}"`;
        return;
    }

    results.forEach(r => {
        const card = document.createElement("a");
        card.href = r.url || "#";
        card.target = r.url && r.url !== "#" ? "_blank" : "_self";
        card.rel = "noopener noreferrer";
        card.className = "block bg-gray-900 border border-gray-800 hover:border-techCian/50 rounded-xl p-4 transition-all";

        const title = document.createElement("div");
        title.className = "font-semibold text-white text-base";
        title.textContent = r.title || "Resultado";

        const url = document.createElement("div");
        url.className = "text-[11px] text-techCian mt-1 break-all";
        url.textContent = r.url || "";

        const snippet = document.createElement("div");
        snippet.className = "text-sm text-gray-400 mt-2 leading-relaxed";
        snippet.textContent = r.extract || r.snippet || "Sen descrición dispoñible.";

        card.append(title, url, snippet);
        container.appendChild(card);
    });

    if (status) {
        status.textContent = `${results.length} resultados atopados para: "${query}"`;
    }
}

async function ejecutarBusqueda() {
    const input = document.getElementById("search-input");
    if (!input) return;
    
    const query = input.value.trim();
    if (!query) return;

    const button = document.getElementById("search-button");
    const status = document.getElementById("search-status");
    const lang = idiomaBusqueda(query);

    if (button) {
        button.disabled = true;
        button.classList.add("opacity-50");
    }
    if (status) status.textContent = "Galia está buscando...";

    registrarBusqueda(lang);

    try {
        // Petición real al backend serverless configurado en /api/search
        const response = await fetch(`${GALIA_SEARCH.ENDPOINT}?q=${encodeURIComponent(query)}`);

        if (!response.ok) {
            throw new Error("Erro na resposta do servidor");
        }

        const data = await response.json();
        mostrarResultados(data.results, query);

    } catch (error) {
        console.error("Erro na busca:", error);
        if (status) status.textContent = "Hoube un erro ao realizar a busca.";
    } finally {
        if (button) {
            button.disabled = false;
            button.classList.remove("opacity-50");
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    registrarVisita();
    renderMetricas();

    const searchBtn = document.getElementById("search-button");
    const searchInput = document.getElementById("search-input");

    if (searchBtn) {
        searchBtn.addEventListener("click", ejecutarBusqueda);
    }

    if (searchInput) {
        searchInput.addEventListener("keydown", e => {
            if (e.key === "Enter") {
                e.preventDefault();
                ejecutarBusqueda();
            }
        });
    }

    document.querySelectorAll(".search-suggestion").forEach(btn => {
        btn.addEventListener("click", () => {
            if (searchInput) {
                searchInput.value = btn.dataset.query || "";
                searchInput.focus();
                ejecutarBusqueda();
            }
        });
    });

    const resetBtn = document.getElementById("reset-metrics");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            localStorage.removeItem(GALIA_SEARCH.STORAGE_KEY);
            renderMetricas();
        });
    }
});
