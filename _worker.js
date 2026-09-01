let memoryStore = null;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Endpoint API para sincronización en la nube multidispositivo en tiempo real
    if (url.pathname === '/api/cms-data') {
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      };

      if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
      }

      if (request.method === 'PUT' || request.method === 'POST') {
        try {
          const body = await request.json();
          memoryStore = body;
          return new Response(JSON.stringify({ success: true, data: memoryStore, savedAt: new Date().toISOString() }), {
            headers: corsHeaders
          });
        } catch (err) {
          return new Response(JSON.stringify({ error: err.message }), { status: 400, headers: corsHeaders });
        }
      }

      // GET: devuelve los datos guardados en la nube
      return new Response(JSON.stringify(memoryStore || { empty: true }), {
        headers: corsHeaders
      });
    }

    // Servir activos estáticos de la web
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }
    return fetch(request);
  }
};
