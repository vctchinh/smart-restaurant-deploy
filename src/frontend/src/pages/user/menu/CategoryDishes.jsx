// pages/tenant/CategoryDishes.jsx (Sửa đổi)

import React, { useState, useEffect } from 'react'
// import axios from "axios"; // 👈 IMPORT MỚI: Import Axios
import { useUser } from '../../../contexts/UserContext' // Lấy Context user (nếu cần)
import BasePageLayout from '../../../components/layout/BasePageLayout' // Giả định BasePageLayout được dùng
import AddDishModal from './AddDishModal' // Giả định Modal này tồn tại

// --- Dữ liệu Mock (Giữ nguyên) ---
const mockDishesData = {
	'noodle-dishes': [
		{
			id: 1,
			name: 'Spicy Miso Ramen',
			description:
				'A rich and flavorful ramen with a spicy miso broth, tender chashu pork, and a soft-boiled egg.',
			price: 15.5,
			image:
				'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?auto=format&fit=crop&w=500&q=80',
		},
		// Thêm các món khác nếu cần
		{
			id: 2,
			name: 'Classic Pad Thai',
			description:
				'Wok-fried rice noodles with shrimp, tofu, peanuts, bean sprouts, and a tangy tamarind sauce.',
			price: 14.0,
			image:
				'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCylxfP50ETWvYyVwTx3qbbPj27wYtyyW5GQ&s',
		},
		{
			id: 3,
			name: 'Vietnamese Pho',
			description: 'Traditional Vietnamese beef noodle soup with herbs and lime.',
			price: 13.75,
			image:
				'https://iamafoodblog.b-cdn.net/wp-content/uploads/2017/11/authentic-instant-pot-pho-recipe-1959w.jpg',
		},
	],
	soups: [],
	salads: [],
}

const formatCategoryName = (slug) => {
	if (!slug) return 'Dishes'
	return slug
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')
}

// 🚨 COMPONENT MỚI: Modal Xác nhận Xóa (Giả định phong cách tối màu)
const ConfirmationModal = ({ isOpen, title, message, onConfirm, onClose }) => {
	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
			<div className="bg-black/80 backdrop-blur-md rounded-lg shadow-2xl p-6 w-full max-w-sm border border-white/10">
				<h3 className="text-2xl font-bold text-red-500 mb-4">{title}</h3>
				<p className="text-[#9dabb9] mb-6">{message}</p>
				<div className="flex justify-end gap-3">
					<button
						onClick={onClose}
						className="px-4 py-2 rounded-lg bg-[#2D3748] text-white transition-colors hover:bg-[#4A5568]"
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						className="px-4 py-2 rounded-lg bg-red-600 text-white font-bold transition-colors hover:bg-red-700"
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	)
}

// 🚨 COMPONENT ĐÃ SỬA ĐỔI: Thẻ hình vuông, Tên & mô tả nổi trên ảnh, Giá riêng biệt
const DishCard = ({ dish, onDelete }) => {
	const [isHovering, setIsHovering] = useState(false)

	// Ngăn chặn sự kiện click thẻ khi nhấn nút X
	const handleDeleteClick = (e) => {
		e.stopPropagation() // Ngăn chặn kích hoạt hành vi mặc định (nếu DishCard là button)
		onDelete(dish) // Gửi toàn bộ object dish (hoặc ID và Name)
	}

	return (
		<div className="flex flex-col items-center">
			{/* 1. KHUNG CHÍNH (Hình vuông, Hình ảnh chiếm toàn bộ, Nội dung nổi) */}
			<div
				className="relative w-full aspect-square overflow-hidden rounded-xl bg-black/40 backdrop-blur-md transition-all group hover:shadow-2xl hover:scale-[1.02] border border-white/10"
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}
			>
				{/* Hình ảnh nền */}
				<div
					className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
					style={{ backgroundImage: `url('${dish.image}')` }}
				>
					{/* Lớp phủ */}
					<div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
				</div>

				{/* Nội dung nổi (Tên và Mô tả) */}
				<div className="absolute inset-0 z-10 flex flex-col justify-end p-4">
					<div className="p-3 bg-black/50 rounded-lg backdrop-blur-sm transition-colors duration-300 group-hover:bg-black/70">
						<h3 className="text-xl font-bold text-white m-0 leading-tight">
							{dish.name}
						</h3>
						<p className="text-xs text-[#E2E8F0] mt-1 line-clamp-2 m-0">
							{dish.description}
						</p>
					</div>
				</div>

				{/* Nút Xóa (Hiển thị khi hover) */}
				{isHovering && (
					<button
						onClick={handleDeleteClick}
						title={`Delete ${dish.name}`}
						className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-red-600/90 text-white transition-all hover:bg-red-700 active:scale-[0.98] border-none cursor-pointer p-0"
					>
						<span className="material-symbols-outlined text-base">close</span>
					</button>
				)}
			</div>

			{/* 2. KHU VỰC GIÁ (Nổi bật, Căn giữa) */}
			<div className="mt-3 text-center">
				<p className="text-3xl font-black text-[#137fec] mt-1 m-0">
					${(dish.price || 0).toFixed(2)}
				</p>
			</div>
		</div>
	)
}

// --- Sub-component: Add Dish Card (Kích hoạt Modal, Hình vuông) ---
const AddDishCard = ({ onClick }) => (
	<button
		onClick={onClick}
		className="flex flex-col items-center justify-center w-full aspect-square bg-black/30 backdrop-blur-md rounded-xl border-2 border-dashed border-white/20 h-full p-6 text-center transition-all duration-200 hover:bg-black/50 hover:border-blue-400 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#137fec]"
	>
		<span className="material-symbols-outlined text-7xl text-[#137fec] opacity-90 mb-2">
			add_circle
		</span>
		<h3 className="text-lg font-bold text-white">Add New Dish</h3>
	</button>
)

const CategoryDishes = ({ categorySlug, onBack }) => {
	// Lấy Context user (nếu cần dùng BasePageLayout)
	const { user, loading: contextLoading, logout } = useUser()

	const [dishes, setDishes] = useState([])
	const [categoryName, setCategoryName] = useState('')
	const [loading, setLoading] = useState(true)

	// 🚨 STATE MỚI: Quản lý Modal/Form thêm món ăn
	const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false)

	// 🚨 STATE MỚI: Quản lý Modal xác nhận xóa
	// Lưu trữ object món ăn cần xóa { id: number, name: string }
	const [dishToDelete, setDishToDelete] = useState(null)

	const fetchDishes = async (slug) => {
		// Comment: BẮT ĐẦU: Logic gọi API lấy danh sách món ăn theo category
		console.log(`Fetching dishes for category: ${slug}`)
		setLoading(true)

		// try {
		//      // API endpoint ví dụ: GET /api/tenant/menu/:categorySlug/dishes
		//      // Cần gửi Header Authorization (JWT Token) để xác định nhà hàng
		//      const response = await axios.get(`/api/tenant/menu/${slug}/dishes`);
		//      setDishes(response.data.dishes);
		//      setCategoryName(response.data.categoryDisplayName);
		// } catch (error) {
		//      console.error("Error fetching dishes:", error);
		//      setDishes([]);
		//      setCategoryName(formatCategoryName(slug)); // Fallback name
		// } finally {
		//      setLoading(false);
		// }

		// Giả định dữ liệu mock
		setTimeout(() => {
			// 🚨 FIX: Tạo bản sao sâu để đảm bảo dữ liệu mock có thể được thay đổi (xóa) mà không ảnh hưởng đến object gốc
			const data = JSON.parse(JSON.stringify(mockDishesData[slug] || []))
			setDishes(data)
			setCategoryName(formatCategoryName(slug))
			setLoading(false)
		}, 500)
		// Comment: KẾT THÚC: Logic gọi API lấy danh sách món ăn theo category
	}

	// 🚨 HÀM XỬ LÝ LƯU MÓN ĂN MỚI (CALLBACK TỪ MODAL)
	const handleSaveDish = (newDish) => {
		// Comment: BẮT ĐẦU: Logic API POST đã được xử lý trong AddDishModal (hoặc đây là kết quả thành công)
		// Cập nhật dishes state (Optimistic update)
		setDishes((prev) => [...prev, newDish])
		// Comment: KẾT THÚC: Logic API POST
	}

	// 🚨 HÀM KÍCH HOẠT MODAL XÁC NHẬN XÓA (Truyền vào DishCard)
	const openDeleteConfirmation = (dish) => {
		// Lưu trữ món ăn cần xóa vào state, tự động mở ConfirmationModal
		setDishToDelete(dish)
	}

	// 🚨 HÀM THỰC THI XÓA MÓN ĂN (Gắn vào nút Confirm của Modal)
	const executeDeleteDish = async () => {
		if (!dishToDelete) return

		const dishId = dishToDelete.id
		const dishName = dishToDelete.name

		// Đóng modal ngay lập tức
		setDishToDelete(null)

		// Comment: BẮT ĐẦU: Logic gọi API DELETE món ăn
		console.log(`Attempting to delete dish ID: ${dishId}`)

		// Tạm thời xóa khỏi UI (Optimistic UI Update)
		const prevDishes = dishes
		setDishes(prevDishes.filter((dish) => dish.id !== dishId))

		try {
			// API endpoint ví dụ: DELETE /api/tenant/menu/dishes/:dishId
			// const response = await axios.delete(`/api/tenant/menu/dishes/${dishId}`, {
			//      headers: { Authorization: `Bearer ${user.token}` }, // Giả định có token
			// });

			// Giả lập API call thành công
			await new Promise((resolve) => setTimeout(resolve, 300))

			console.log(`Dish ${dishId} deleted successfully.`)
			// Sau khi xóa thành công, không cần làm gì thêm vì state đã được cập nhật
		} catch (error) {
			console.error('Error deleting dish:', error)
			// Hoàn tác (Rollback) state nếu API call thất bại
			setDishes(prevDishes)
			alert(`Failed to delete dish: ${error.message}. Please try again.`)
		}
		// Comment: KẾT THÚC: Logic gọi API DELETE món ăn
	}

	useEffect(() => {
		// Comment: Chỉ fetch khi categorySlug thay đổi
		fetchDishes(categorySlug)
	}, [categorySlug])

	// Nút kích hoạt modal thêm món ăn (Gắn vào AddDishCard)
	const openAddDishForm = () => {
		// Logic mở Modal/Form thêm món ăn
		setIsAddDishModalOpen(true)
	}

	// Logic BasePageLayout (Giả định user đã load)
	if (contextLoading) {
		return (
			<div className="flex min-h-screen w-full items-center justify-center">
				<p className="text-white">Loading User Context...</p>
			</div>
		)
	}
	const simpleUserProfile = {
		name: user?.name,
		role: user?.role,
		avatarUrl: user?.avatarUrl,
	}

	return (
		<div>
			<header className="mb-8 flex flex-wrap justify-between items-end gap-4">
				<div className="flex flex-col gap-1">
					{/* Breadcrumb có chức năng Back */}
					<div className="flex items-center gap-2 text-[#9dabb9]">
						<button
							onClick={onBack}
							className="text-sm text-[#9dabb9] hover:text-[#137fec] transition-colors no-underline bg-transparent border-none cursor-pointer p-0"
						>
							Menu Management
						</button>
						<span className="material-symbols-outlined text-lg">chevron_right</span>
						<span className="text-sm text-white font-medium">{categoryName}</span>
					</div>

					<h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] m-0 mt-2">
						{categoryName}
					</h1>
				</div>

				{/* Nút Back lớn (Optional) */}
				<button
					onClick={onBack}
					className="flex items-center justify-center h-10 px-4 rounded-lg bg-[#2D3748] text-white text-sm font-bold gap-2 transition-colors hover:bg-[#4A5568] border-none cursor-pointer"
				>
					<span className="material-symbols-outlined text-xl">arrow_back</span>
					Back to Categories
				</button>
			</header>

			{/* Dishes Grid */}
			<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{loading ? (
					<p className="text-[#9dabb9] lg:col-span-3 xl:col-span-4 text-center py-10">
						Loading dishes...
					</p>
				) : dishes.length > 0 ? (
					// 🚨 TRUYỀN HÀM KÍCH HOẠT MODAL VÀO DishCard
					dishes.map((dish) => (
						<DishCard
							key={dish.id}
							dish={dish}
							onDelete={openDeleteConfirmation} // 👈 Gửi dish object
						/>
					))
				) : (
					<p className="text-[#9dabb9] lg:col-span-3 xl:col-span-4 text-center py-10">
						No dishes found in this category.
					</p>
				)}

				{/* 🚨 THẺ THÊM MÓN ĂN MỚI LUÔN Ở CUỐI */}
				<AddDishCard onClick={openAddDishForm} />
			</div>

			{/* 🚨 MODAL THÊM MÓN ĂN */}
			{isAddDishModalOpen && (
				// Comment: Nơi Modal/Form thêm món ăn sẽ được render
				<AddDishModal
					categorySlug={categorySlug}
					categoryName={categoryName}
					onSave={handleSaveDish} // 👈 Xử lý lưu và cập nhật UI
					onClose={() => setIsAddDishModalOpen(false)}
					isOpen={isAddDishModalOpen}
				/>
			)}

			{/* 🚨 MODAL XÁC NHẬN XÓA MÓN ĂN */}
			<ConfirmationModal
				isOpen={!!dishToDelete} // Mở nếu dishToDelete có giá trị (không null)
				title="Confirm Dish Deletion"
				message={
					dishToDelete
						? `Are you sure you want to permanently delete the dish: "${dishToDelete.name}"? This action cannot be undone.`
						: ''
				}
				onConfirm={executeDeleteDish} // 👈 Hàm thực thi xóa và gọi API
				onClose={() => setDishToDelete(null)} // Đóng modal
			/>
		</div>
	)
}

export default CategoryDishes
