// Vercel Serverless Function - Proxy for Didit KYC Session Creation
// This bypasses CORS restrictions by making the request server-side

export default async function handler(req, res) {
	// Enable CORS
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

	// Handle preflight
	if (req.method === 'OPTIONS') {
		return res.status(200).end()
	}

	// Only allow POST
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' })
	}

	try {
		const DIDIT_API_KEY = process.env.VITE_DIDIT_API_KEY

		if (!DIDIT_API_KEY) {
			console.error('❌ VITE_DIDIT_API_KEY not configured')
			return res.status(500).json({ error: 'Server configuration error' })
		}

		// Forward request to Didit API
		const response = await fetch('https://verification.didit.me/v2/session/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Api-Key': DIDIT_API_KEY,
			},
			body: JSON.stringify(req.body),
		})

		const data = await response.json()

		if (!response.ok) {
			console.error('❌ Didit API error:', response.status, data)
			return res.status(response.status).json(data)
		}

		// Return successful response
		return res.status(200).json(data)
	} catch (error) {
		console.error('❌ KYC Session API error:', error)
		return res.status(500).json({
			error: 'Failed to create verification session',
			message: error.message,
		})
	}
}
