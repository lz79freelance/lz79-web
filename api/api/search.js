export default async function handler(req, res) {
    // Solo permitimos GET
    if (req.method !== "GET") {
        return res.status(405).json({
            error: "Método no permitido"
        });
    }

    try {
        const query = String(req.query?.q || "").trim();

        if (!query) {
            return res.status(400).json({
                error: "Falta la búsqueda"
            });
        }

        /*
         * Por ahora usamos Wikipedia como fuente pública.
         * No necesita API key.
         */

        const url =
            "https://es.wikipedia.org/w/api.php" +
            "?action=query" +
            "&generator=search" +
            "&gsrsearch=" + encodeURIComponent(query) +
            "&gsrnamespace=0" +
            "&gsrlimit=5" +
            "&prop=pageimages|extracts|info" +
            "&exintro=1" +
            "&explaintext=1" +
            "&exchars=500" +
            "&piprop=thumbnail" +
            "&pithumbsize=500" +
            "&format=json" +
            "&origin=*";

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                `Wikipedia respondió ${response.status}`
            );
        }

        const data = await response.json();

        const pages = data.query?.pages || {};

        const results = Object.values(pages)
            .sort((a, b) => (a.index || 0) - (b.index || 0))
            .map(page => ({
                title: page.title || "",
                extract: page.extract || "",
                url:
                    page.fullurl ||
                    `https://es.wikipedia.org/wiki/${encodeURIComponent(
                        page.title
                    )}`,
                image:
                    page.thumbnail?.source || null
            }));

        return res.status(200).json({
            ok: true,
            query,
            source: "Wikipedia",
            results
        });

    } catch (error) {

        console.error("Error en /api/search:", error);

        return res.status(500).json({
            ok: false,
            error: "Non se puido realizar a busca."
        });

    }
}
