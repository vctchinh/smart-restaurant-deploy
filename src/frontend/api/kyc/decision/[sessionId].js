// Vercel Serverless Function - Proxy for Didit KYC Decision/Result
// This bypasses CORS restrictions by making the request server-side

export default async function handler(req, res) {
	// Enable CORS
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

	// Handle preflight
	if (req.method === 'OPTIONS') {
		return res.status(200).end()
	}

	// Only allow GET
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' })
	}

	try {
		const { sessionId } = req.query

		if (!sessionId) {
			return res.status(400).json({ error: 'Session ID is required' })
		}

		const DIDIT_API_KEY = process.env.VITE_DIDIT_API_KEY

		if (!DIDIT_API_KEY) {
			console.error('❌ VITE_DIDIT_API_KEY not configured')
			return res.status(500).json({ error: 'Server configuration error' })
		}

		// Forward request to Didit API
		const response = await fetch(
			`https://verification.didit.me/v2/session/${sessionId}/decision/`,
			{
				method: 'GET',
				headers: {
					'X-Api-Key': DIDIT_API_KEY,
				},
			},
		)

		const data = await response.json()

		if (!response.ok) {
			console.error('❌ Didit API error:', response.status, data)
			return res.status(response.status).json(data)
		}

		// Return successful response
		return res.status(200).json(data)
	} catch (error) {
		console.error('❌ KYC Decision API error:', error)
		return res.status(500).json({
			error: 'Failed to fetch verification result',
			message: error.message,
		})
	}
}
