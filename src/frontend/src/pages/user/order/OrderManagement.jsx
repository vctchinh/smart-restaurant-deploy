import React, { useState, useEffect } from 'react'
// import axios from 'axios'; // 👈 IMPORT MỚI: Import Axios khi bạn sẵn sàng tích hợp API
import { useUser } from '../../../contexts/UserContext' // Lấy Context user (nếu cần)
import BasePageLayout from '../../../components/layout/BasePageLayout' // 👈 IMPORT LAYOUT CHUNG

// --- CONSTANTS ---
const TIME_LIMIT_MINUTES = 30 // 30 phút là thời gian chờ tối đa
const TIME_LIMIT_MS = TIME_LIMIT_MINUTES * 60 * 1000

// Helper tạo timestamp giả lập
const getMockTime = (minutesAgo) => {
	const d = new Date()
	d.setMinutes(d.getMinutes() - minutesAgo)
	return d.getTime()
}

// --- Dữ liệu Mock (Loại bỏ progress, timeRemaining, isDelayed, isTable) ---
const mockActiveOrders = [
	{
		id: 'A3F8B',
		destination: 'Table 5',
		items: 3,
		totalPrice: 45.0,
		placedTime: getMockTime(15),
	}, // 15 mins ago
	{
		id: 'C1D9E',
		destination: 'Table 12',
		items: 5,
		totalPrice: 62.5,
		placedTime: getMockTime(35),
	}, // 35 mins ago (Delayed)
	{
		id: 'E4F2A',
		destination: 'Takeaway',
		items: 2,
		totalPrice: 23.75,
		placedTime: getMockTime(5),
	}, // 5 mins ago
	{
		id: 'B7G8H',
		destination: 'Table 3',
		items: 1,
		totalPrice: 15.0,
		placedTime: getMockTime(10),
	},
	{
		id: 'K9M2N',
		destination: 'Table 8',
		items: 6,
		totalPrice: 88.2,
		placedTime: getMockTime(20),
	},
	{
		id: 'F5P6Q',
		destination: 'Table 2',
		items: 4,
		totalPrice: 12.75,
		placedTime: getMockTime(30),
	}, // Boundary
]

const mockPendingOrders = [
	// Giả định Pending orders có placedTime để sắp xếp chính xác
	{
		id: 'L1V4T',
		destination: 'Table 9',
		items: 4,
		time: '12:45 PM',
		totalPrice: 45.5,
		placedTime: getMockTime(2),
	},
	{
		id: 'R8S3Y',
		destination: 'John D.',
		items: 6,
		time: '12:42 PM',
		totalPrice: 112.0,
		placedTime: getMockTime(3),
	},
]

// --- Dữ liệu Mock Chi tiết Order (GIỮ NGUYÊN) ---
const mockOrderDetails = {
	A3F8B: {
		id: 'A3F8B',
		table: 'Table 5',
		totalPrice: 45.0,
		status: 'Preparing',
		items: [
			{ name: 'Spicy Miso Ramen', qty: 1, price: 15.5, notes: 'Extra spicy' },
			{ name: 'Coca Cola', qty: 2, price: 4.5, notes: 'No ice' },
			{ name: 'Fries', qty: 1, price: 8.0, notes: 'Extra salt' },
		],
	},
	L1V4T: {
		id: 'L1V4T',
		table: 'Table 9',
		totalPrice: 45.5,
		status: 'Pending',
		items: [
			{ name: 'Caesar Salad', qty: 1, price: 12.0, notes: 'Dressing on side' },
			{ name: 'Grilled Salmon', qty: 1, price: 33.5, notes: '' },
		],
	},
}

// Định nghĩa các class màu
const getColor = (name) => {
	switch (name) {
		case 'primary':
			return '#137fec'
		case 'red-400':
			return '#f87171'
		case 'yellow-300':
			return '#fde047'
		case 'yellow-500':
			return '#eab308'
		case 'green-400':
			return '#4ade80'
		case 'red-800':
			return '#e53e3e'
		default:
			return 'white'
	}
}

// 💡 HÀM TÍNH TOÁN DỮ LIỆU TIMER (PROGRESS, TIME REMAINING, DELAYED)
const calculateTimeData = (placedTime) => {
	const elapsed = Date.now() - placedTime
	const remainingMs = TIME_LIMIT_MS - elapsed
	const isDelayed = remainingMs <= 0

	let progress = Math.min(100, (elapsed / TIME_LIMIT_MS) * 100)

	// Format thời gian còn lại (hoặc thời gian trễ)
	let displayTime
	let absRemaining = Math.abs(remainingMs)
	const minutes = Math.floor(absRemaining / 60000)
	const seconds = Math.floor((absRemaining % 60000) / 1000)

	displayTime = `${minutes.toString().padStart(2, '0')}:${seconds
		.toString()
		.padStart(2, '0')}`

	return {
		progress: progress,
		timeRemaining: displayTime,
		isDelayed: isDelayed,
		// Dùng cho API update
		timeStatus: isDelayed ? 'Delayed' : 'Preparing',
	}
}

// =========================================================
// 🚨 COMPONENT MỚI: OrderDetailModal (GIỮ NGUYÊN)
// =========================================================
const OrderDetailModal = ({ isOpen, onClose, details }) => {
	if (!isOpen || !details) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm font-['Work_Sans',_sans-serif]">
			<div className="relative w-full max-w-xl transform overflow-hidden rounded-xl bg-black/80 backdrop-blur-md p-8 shadow-2xl transition-all border border-white/10">
				<div className="flex justify-between items-start mb-6 border-b border-white/10 pb-3">
					<div>
						<h3 className="text-2xl font-bold text-white m-0">Order Details</h3>
						<p className="text-sm text-[#9dabb9] mt-1">
							ID: {details.id} | To: {details.table}
						</p>
					</div>
					<button
						onClick={onClose}
						className="absolute top-4 right-4 text-[#9dabb9] hover:text-red-400 transition-colors"
					>
						<span className="material-symbols-outlined text-2xl">close</span>
					</button>
				</div>

				<div className="space-y-4 max-h-96 overflow-y-auto pr-4">
					{details.items.map((item, index) => (
						<div
							key={index}
							className="flex justify-between items-center bg-black/40 backdrop-blur-md p-3 rounded-lg"
						>
							<div className="flex flex-col">
								<p className="text-white font-semibold">
									{item.qty}x {item.name}
								</p>
								{item.notes && (
									<p className="text-xs text-yellow-300/80">Note: {item.notes}</p>
								)}
							</div>
							<span className="text-base font-bold text-white">
								${(item.qty * item.price).toFixed(2)}
							</span>
						</div>
					))}
				</div>

				<div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
					<p className="text-xl font-bold text-white">Total:</p>
					<p className="text-3xl font-black text-[#4ade80]">
						${details.totalPrice.toFixed(2)}
					</p>
				</div>
			</div>
		</div>
	)
}

// --- Sub-component: Active Order Card ---
const ActiveOrderCard = ({ order, onServe, onView, timeData }) => {
	// 🚨 NHẬN timeData
	const timeBoxClass = timeData.isDelayed ? 'bg-red-600' : 'bg-black/50 backdrop-blur-md'
	const timeBoxTextColor = timeData.isDelayed
		? `text-[${getColor('yellow-400')}]`
		: 'text-white'
	const timeValueColor = timeData.isDelayed
		? `text-[${getColor('yellow-300')}]`
		: 'text-white'
	const progressBarColor = timeData.isDelayed ? getColor('red-800') : getColor('primary')

	return (
		<div
			onClick={() => onView(order.id)} // 🚨 Kích hoạt xem chi tiết khi click vào card
			className="bg-black/40 backdrop-blur-md rounded-xl p-4 flex flex-col gap-3 text-left border border-white/10 cursor-pointer 
                       transition-all duration-200 hover:bg-black/50 hover:shadow-lg active:scale-[0.99] 
                       focus:ring-2 focus:ring-[#137fec]"
		>
			<div className="flex justify-between items-center">
				<p className="text-white font-bold m-0">{order.id}</p>
				<p className="text-white font-semibold m-0">{order.destination}</p>
			</div>
			<p className="text-sm text-gray-300 m-0">{order.items} items</p>

			<div className={`rounded-lg p-3 text-center ${timeBoxClass}`}>
				<p className={`text-xs ${timeBoxTextColor} m-0 mb-1`}>
					{timeData.isDelayed ? 'DELAYED' : 'TIME REMAINING'}
				</p>
				<p className={`text-xl font-bold ${timeValueColor} m-0`}>
					{timeData.timeRemaining}
				</p>
			</div>

			<div className="h-2 w-full bg-black/20 rounded-full overflow-hidden mt-1 mb-3">
				<div
					className="h-full rounded-full"
					style={{
						width: `${timeData.progress}%`,
						backgroundColor: progressBarColor,
					}}
				></div>
			</div>

			{/* NÚT XÁC NHẬN HOÀN THÀNH (Served Button) */}
			<button
				onClick={(e) => {
					e.stopPropagation()
					onServe(order.id)
				}} // Ngăn chặn nổi bọt click card
				className="w-full h-10 rounded-lg bg-[#4ade80]/20 text-[#4ade80] text-sm font-bold transition-colors hover:bg-green-600/30 active:scale-[0.98] border border-[#4ade80]/50"
			>
				Mark as Served
			</button>
		</div>
	)
}

// --- Sub-component: Pending Order Item ---
const PendingOrderItem = ({ order, onApprove, onDecline, onView }) => {
	const handleApproveClick = () => onApprove(order.id)
	const handleDeclineClick = () => onDecline(order.id)

	return (
		<div
			onClick={() => onView(order.id)} // 🚨 Kích hoạt xem chi tiết khi click vào card
			className="bg-black/30 backdrop-blur-md rounded-lg m-4 p-4 flex items-center justify-between transition-all duration-200 hover:bg-black/40 hover:shadow-md cursor-pointer border border-white/10"
		>
			<div className="flex flex-col gap-1">
				<p className="text-white font-semibold m-0">{order.destination}</p>
				<div className="flex items-center gap-4 text-sm text-gray-300">
					<span className="flex items-center">
						<span className="material-symbols-outlined text-sm mr-1">schedule</span>
						{/* 🚨 Dùng placedTime để hiển thị thời gian đã đặt */}
						{new Date(order.placedTime).toLocaleTimeString('en-US', {
							hour: '2-digit',
							minute: '2-digit',
						})}
					</span>
					<span className="font-bold text-white">${order.totalPrice.toFixed(2)}</span>
				</div>
			</div>

			<div className="flex items-center gap-2">
				<button
					onClick={(e) => {
						e.stopPropagation()
						handleDeclineClick()
					}} // Ngăn chặn nổi bọt click card
					title="Decline"
					className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-600/20 text-[#f87171] hover:bg-red-600/30 transition-colors"
				>
					<span className="material-symbols-outlined text-base">close</span>
				</button>
				<button
					onClick={(e) => {
						e.stopPropagation()
						handleApproveClick()
					}} // Ngăn chặn nổi bọt click card
					title="Approve"
					className="flex items-center justify-center w-9 h-9 rounded-lg bg-green-600/20 text-[#4ade80] hover:bg-green-600/30 transition-colors"
				>
					<span className="material-symbols-outlined text-base">check</span>
				</button>
			</div>
		</div>
	)
}

const OrderManagement = () => {
	const { user, loading: contextLoading } = useUser()

	// 1. State cho Dữ liệu
	const [activeOrders, setActiveOrders] = useState([]) // Khởi tạo rỗng, sẽ được tính toán
	const [pendingOrders, setPendingOrders] = useState([]) // Khởi tạo rỗng, sẽ được tính toán
	const [loading, setLoading] = useState(true)

	// 🚨 STATE MỚI: Modal và Chi tiết Order
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
	const [orderDetails, setOrderDetails] = useState(null) // Chi tiết món ăn đang xem
	const [tick, setTick] = useState(0) // State để force re-render timer

	// 2. Hàm Fetch Data (Polling)
	const fetchOrders = async () => {
		// Comment: BẮT ĐẦU: Logic gọi API để lấy dữ liệu liên tục (hoặc polling)
		console.log('Fetching active and pending orders...')
		// setLoading(true);

		// try {
		//     const activeRes = await axios.get('/api/tenant/orders/active');
		//     const pendingRes = await axios.get('/api/tenant/orders/pending');

		//     const fetchedActive = activeRes.data.orders;
		//     const fetchedPending = pendingRes.data.orders;

		//     // Sắp xếp theo placedTime (sớm nhất ở trên cùng)
		//     const sortedActive = fetchedActive.sort((a, b) => a.placedTime - b.placedTime);
		//     const sortedPending = fetchedPending.sort((a, b) => a.placedTime - b.placedTime);

		//     setActiveOrders(sortedActive);
		//     setPendingOrders(sortedPending);
		// } catch (error) {
		//     console.error("Error fetching orders:", error);
		// } finally {
		//     setLoading(false);
		// }

		// Giả lập (Sắp xếp mock data)
		const sortedMockActive = [...mockActiveOrders].sort(
			(a, b) => a.placedTime - b.placedTime,
		)
		const sortedMockPending = [...mockPendingOrders].sort(
			(a, b) => a.placedTime - b.placedTime,
		)
		setActiveOrders(sortedMockActive)
		setPendingOrders(sortedMockPending)

		setTimeout(() => setLoading(false), 500)
		// Comment: KẾT THÚC: Logic gọi API để lấy dữ liệu liên tục (hoặc polling)
	}

	// 3. Hàm Fetch Chi tiết Order (MỚI)
	const handleViewDetails = async (orderId) => {
		// Comment: BẮT ĐẦU: Logic gọi API GET Order Details
		console.log(`Fetching details for Order ID: ${orderId}`)
		setIsDetailModalOpen(true)
		setOrderDetails(null) // Clear previous details

		// try {
		//     // API endpoint: GET /api/tenant/orders/:id/details
		//     const res = await axios.get(`/api/tenant/orders/${orderId}/details`);
		//     setOrderDetails(res.data);
		// } catch (error) {
		//     console.error("Error fetching order details:", error);
		//     setOrderDetails(mockOrderDetails['A3F8B']); // Fallback name
		// }

		// Giả lập
		setTimeout(() => {
			setOrderDetails(mockOrderDetails[orderId] || mockOrderDetails['A3F8B']) // Fallback mock
		}, 300)
		// Comment: KẾT THÚC: Logic gọi API GET Order Details
	}

	// 4. Hàm Xử lý Served (PUT - Món đã phục vụ)
	const handleServe = async (orderId) => {
		// Comment: BẮT ĐẦU: Logic gọi API PUT Mark as Served
		console.log(`Marking order ${orderId} as served.`)

		const servedOrder = activeOrders.find((order) => order.id === orderId)
		setActiveOrders((prev) => prev.filter((order) => order.id !== orderId))

		// try {
		//     // API endpoint: PUT /api/tenant/orders/serve/:id
		//     await axios.put(`/api/tenant/orders/serve/${orderId}`);
		//     console.log(`Order ${orderId} successfully served.`);
		// } catch (error) {
		//     console.error("Error marking as served:", error);
		//     setActiveOrders(prev => [...prev, servedOrder]);
		//     fetchOrders();
		//     alert(`Failed to mark order ${orderId} as served. Please try again.`);
		// }
		// Comment: KẾT THÚC: Logic gọi API PUT Mark as Served
	}

	// 5. Hàm Xử lý Approve (PUT)
	const handleApprove = async (orderId) => {
		// Comment: BẮT ĐẦU: Logic gọi API PUT Approve Order
		console.log(`Approving order: ${orderId}`)

		const approvedOrder = pendingOrders.find((o) => o.id === orderId)
		if (approvedOrder) {
			setPendingOrders((prev) => prev.filter((o) => o.id !== orderId))

			// 🚨 TÍNH TOÁN DỮ LIỆU BAN ĐẦU CHO ACTIVE ORDER
			const currentTimeData = calculateTimeData(approvedOrder.placedTime)

			setActiveOrders((prev) =>
				[
					...prev,
					{
						...approvedOrder,
						destination: approvedOrder.destination, // Giữ nguyên destination
						...currentTimeData, // Thêm các trường tính toán từ timer
					},
				].sort((a, b) => (a.placedTime || 0) - (b.placedTime || 0)),
			) // Sắp xếp lại Active List
		}

		// try {
		//     // API endpoint: PUT /api/tenant/orders/approve/:id
		//     await axios.put(`/api/tenant/orders/approve/${orderId}`);
		// } catch (error) {
		//     console.error("Error approving order:", error);
		// }
		// Comment: KẾT THÚC: Logic gọi API PUT Approve Order
	}

	// 6. Hàm Xử lý Decline (DELETE/PUT)
	const handleDecline = async (orderId) => {
		// Comment: BẮT ĐẦU: Logic gọi API PUT/DELETE Decline Order
		console.log(`Declining order: ${orderId}`)

		setPendingOrders((prev) => prev.filter((o) => o.id !== orderId))

		// try {
		//     // API endpoint: PUT /api/tenant/orders/decline/:id (Hoặc DELETE)
		//     await axios.put(`/api/tenant/orders/decline/${orderId}`);
		// } catch (error) {
		//     console.error("Error declining order:", error);
		// }
		// Comment: KẾT THÚC: Logic gọi API PUT/DELETE Decline Order
	}

	// 7. Setup Timer (Re-render mỗi giây)
	useEffect(() => {
		if (!loading) {
			const interval = setInterval(() => {
				setTick((prev) => prev + 1) // Cập nhật state giả để force re-render
			}, 1000)
			return () => clearInterval(interval)
		}
	}, [loading])

	useEffect(() => {
		if (!contextLoading) {
			fetchOrders()
			// Comment: Setup Polling: Lấy dữ liệu mới mỗi 30 giây (nếu cần dữ liệu server-side mới)
			// const intervalId = setInterval(fetchOrders, 30000);
			// return () => clearInterval(intervalId);
		}
	}, [contextLoading])

	if (contextLoading) {
		return (
			<div className="flex min-h-screen bg-[#101922] w-full items-center justify-center">
				<p className="text-white">Loading User Context...</p>
			</div>
		)
	}

	const pageContent = (
		<div className="w-full h-full">
			<header className="mb-8">
				<h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
					Order Management
				</h1>
				<p className="text-gray-300 text-base mt-2">
					Monitor and manage all active and incoming orders.
				</p>
			</header>

			<div className="flex flex-col lg:flex-row gap-8 h-full">
				{/* Active Orders Column (3/5 width) */}
				<div className="flex flex-col flex-3 lg:w-3/5">
					<div className="section-header mb-6">
						<h2 className="text-2xl font-bold text-white m-0">Active Orders</h2>
						<p className="text-gray-300 text-sm">
							Orders currently in preparation or delivery.
						</p>
					</div>

					<div className="flex-1 overflow-hidden">
						{/* active-orders-grid là div chứa toàn bộ grid, cần overflow-y:auto và padding-right để cuộn */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-4 -mr-4 h-full">
							{loading ? (
								<p className="text-[#9dabb9] lg:col-span-3">Loading active orders...</p>
							) : (
								activeOrders.map((order) => (
									<ActiveOrderCard
										key={order.id}
										order={order}
										onServe={handleServe}
										onView={handleViewDetails}
										// 🚨 TRUYỀN DỮ LIỆU TIMER TÍNH TOÁN MỖI LẦN TICK
										timeData={calculateTimeData(order.placedTime)}
									/>
								))
							)}
						</div>
					</div>
				</div>

				{/* Pending Orders Column (2/5 width) */}
				<div className="flex flex-col flex-2 lg:w-2/5 bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10">
					<header className="section-header mb-6">
						<h2 className="text-2xl font-bold text-white m-0">
							Pending Orders ({pendingOrders.length})
						</h2>
						<p className="text-gray-300 text-sm">
							Approve or decline new incoming orders.
						</p>
					</header>

					<div className="pending-orders-list flex-1 space-y-4 overflow-y-auto pr-4 -mr-4">
						{loading ? (
							<p className="text-[#9dabb9]">Loading pending list...</p>
						) : pendingOrders.length > 0 ? (
							pendingOrders.map((order) => (
								<PendingOrderItem
									key={order.id}
									order={order}
									onApprove={handleApprove}
									onDecline={handleDecline}
									onView={handleViewDetails}
								/>
							))
						) : (
							<p className="text-[#9dabb9] text-center py-10">
								No new orders waiting for approval.
							</p>
						)}
					</div>
				</div>
			</div>

			{/* 🚨 MODAL CHI TIẾT */}
			<OrderDetailModal
				isOpen={isDetailModalOpen}
				onClose={() => setIsDetailModalOpen(false)}
				details={orderDetails}
			/>
		</div>
	)

	return <BasePageLayout activeRoute="Order">{pageContent}</BasePageLayout>
}

export default OrderManagement
