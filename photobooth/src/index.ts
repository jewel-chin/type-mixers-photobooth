const CORS_HEADERS = {
	'Access-Control-Allow-Origin': '*', // replace "*" with your frontend URL in production
	'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		// Handle preflight OPTIONS request
		if (request.method === 'OPTIONS') {
			return new Response(null, { status: 204, headers: CORS_HEADERS });
		}

		// POST /upload
		if (request.method === 'POST' && url.pathname === '/upload') {
			try {
				const id = crypto.randomUUID();
				const imageBuffer = await request.arrayBuffer();

				await env.BUCKET.put(id, imageBuffer, {
					httpMetadata: { contentType: 'image/png' },
					expirationTtl: 120, // 2 minutes
				});

				return new Response(JSON.stringify({ id }), {
					headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
				});
			} catch (err) {
				return new Response(JSON.stringify({ error: err.message }), {
					status: 500,
					headers: CORS_HEADERS,
				});
			}
		}

		// GET /p/:id
		if (request.method === 'GET' && url.pathname.startsWith('/p/')) {
			const id = url.pathname.replace('/p/', '');
			const object = await env.BUCKET.get(id);

			if (!object) {
				return new Response('Expired', { status: 404, headers: CORS_HEADERS });
			}

			return new Response(object.body, {
				headers: {
					...CORS_HEADERS,
					'Content-Type': 'image/png',
					'Cache-Control': 'no-store',
				},
			});
		}

		// Default fallback
		return new Response('Not found', { status: 404, headers: CORS_HEADERS });
	},
};
