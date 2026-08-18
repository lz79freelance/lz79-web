async function ejecutarBusqueda() {
    const input = document.getElementById("search-input");
    const query = input.value.trim();
    if (!query) return;

    const container = document.getElementById("search-results");
    const status = document.getElementById("search-status");

    // Limpiamos antes de empezar
    container.innerHTML = '<div class="text-gray-500 text-sm">Buscando en Galia...</div>';
    
    try {
        // Hacemos la petición real al endpoint que creamos
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        // Limpiamos el mensaje de "Buscando..."
        container.innerHTML = "";

        if (data.results && data.results.length > 0) {
            data.results.forEach(r => {
                const card = document.createElement("div");
                card.className = "bg-gray-900 border border-gray-800 rounded-xl p-4 mb-3 hover:border-techCian/50 transition-all";
                card.innerHTML = `
                    <a href="${r.url}" target="_blank" class="block">
                        <div class="text-techCian font-bold text-lg hover:underline">${r.title}</div>
                        <div class="text-gray-500 text-xs mb-2">${r.url}</div>
                        <div class="text-gray-300 text-sm">${r.extract || "Sen descrición."}</div>
                    </a>
                `;
                container.appendChild(card);
            });
            status.textContent = `Resultados atopados para: "${query}"`;
        } else {
            status.textContent = "Non se atoparon resultados reais.";
        }

    } catch (error) {
        status.textContent = "Erro de conexión. Asegúrate de que o backend estea activo.";
    }
}
