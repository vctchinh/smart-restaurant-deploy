// services/apiClient.js
// Axios client configuration for Backend API Gateway

import axios from 'axios'

const API_KEY =
	'lT0O|c_/4<{;K|.Ann[Cuib+7l+LL#W_-Y,T>w}8Mmeu}Z[el<1*|v.p&Wg}Mp%y:0$]4m&;5,8m5JN-,S<h#}'

// Create axios instance
const apiClient = axios.create({
	baseURL: '/api/v1',
	withCredentials: false,
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 30000,
})

// Request Interceptor - Attach access token
apiClient.interceptors.request.use(
	(config) => {
		const accessToken = window.accessToken || ''
		config.headers.Authorization = `Bearer ${accessToken}`
		return config
	},
	(error) => {
		return Promise.reject(error)
	},
)

// Response Interceptor - Handle token refresh & errors
apiClient.interceptors.response.use(
	(response) => {
		const newAccessToken = response.headers['x-new-access-token']

		if (newAccessToken) {
			console.log('🔄 Access token refreshed automatically by backend')
			window.accessToken = newAccessToken
			apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`
		}

		return response
	},
	async (error) => {
		const originalRequest = error.config

		if (!error.response) {
			console.error('❌ Network Error:', error.message)
			return Promise.reject({
				code: 9002,
				message: 'Unable to connect to server. Please check your connection.',
				error: error.message,
			})
		}

		const { status, data } = error.response

		// Handle 401 Unauthorized
		if (status === 401) {
			const errorCode = data?.code

			if (errorCode === 1002 && !originalRequest._retry) {
				originalRequest._retry = true

				try {
					console.log('🔄 Attempting manual token refresh...')

					const refreshResponse = await axios.get('/api/v1/identity/auth/refresh', {
						withCredentials: false,
					})

					if (refreshResponse.data.code === 1000) {
						const newAccessToken = refreshResponse.data.data.accessToken

						window.accessToken = newAccessToken
						apiClient.defaults.headers.common[
							'Authorization'
						] = `Bearer ${newAccessToken}`
						originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

						console.log('✅ Token refreshed, retrying request...')
						return apiClient(originalRequest)
					}
				} catch (refreshError) {
					console.error('❌ Token refresh failed:', refreshError)

					window.accessToken = null
					localStorage.removeItem('user')
					window.location.href = '/login'

					return Promise.reject({
						code: 1002,
						message: 'Session expired. Please login again.',
					})
				}
			}

			console.error('❌ Unauthorized:', data)
			return Promise.reject(data)
		}

		// Handle 403 Forbidden
		if (status === 403) {
			console.error('❌ Forbidden:', data)
			return Promise.reject({
				code: data?.code || 1005,
				message: data?.message || 'You do not have permission to access this resource.',
			})
		}

		// Handle 400 Bad Request
		if (status === 400) {
			console.error('❌ Validation Error:', data)
			if (data.errors && Array.isArray(data.errors)) {
				console.error('📋 Validation Details:', data.errors)
			}
			return Promise.reject(data)
		} // Handle 500 Internal Server Error
		if (status === 500) {
			console.error('❌ Server Error:', data)
			return Promise.reject({
				code: data?.code || 9001,
				message: data?.message || 'Internal server error. Please try again later.',
			})
		}

		// Other errors
		console.error('❌ API Error:', data)
		return Promise.reject(data)
	},
)

export default apiClient
