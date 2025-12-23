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
			return res
				.status(500)
				.json({ error: 'Server configuration error: Missing API key' })
		}

		// Log request for debugging
		console.log('📝 KYC Session request:', {
			body: req.body,
			hasApiKey: !!DIDIT_API_KEY,
		})

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
			const errorDetail = {
				status: response.status,
				statusText: response.statusText,
				data,
				requestBody: req.body,
			}
			console.error('❌ Didit API error:', errorDetail)

			// Return complete error with message
			return res.status(response.status).json({
				error: 'Didit API rejected the request',
				message: data.message || data.error || data.detail || 'Unknown error from Didit',
				details: data,
				statusCode: response.status,
			})
		}
				statusCode: response.status,
			})
		}

		console.log('✅ KYC Session created:', data.session_id)
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
