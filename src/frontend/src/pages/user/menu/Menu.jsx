import React, { useState, useEffect } from 'react'
// import axios from 'axios'; // Import Axios khi bạn sẵn sàng tích hợp API
import { useUser } from '../../../contexts/UserContext' // 👈 IMPORT CONTEXT
import BasePageLayout from '../../../components/layout/BasePageLayout'
import AddCategoryModal from './AddCategoryModal'
import CategoryDishes from './CategoryDishes'

// --- Dữ liệu Mock (Giữ nguyên) ---
const mockCategories = [
	// ... (mock data categories) ...
	{
		id: 1,
		name: 'Soups',
		image: 'https://images3.alphacoders.com/108/1088128.jpg',
		route: 'soups',
	},
	{
		id: 2,
		name: 'Salads',
		image:
			'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80',
		route: 'salads',
	},
	{
		id: 3,
		name: 'Rice Dishes',
		image:
			'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=500&q=80',
		route: 'rice-dishes',
	},
	{
		id: 4,
		name: 'Noodle Dishes',
		image:
			'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=500&q=80',
		route: 'noodle-dishes',
	},
	{
		id: 5,
		name: 'Seafood',
		image:
			'https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=500&q=80',
		route: 'seafood',
	},
	{
		id: 6,
		name: 'Grilled Specialties',
		image:
			'https://sofein.ch/cdn/shop/articles/zart-und-wuerzig-das-perfekte-steak-mit-unserer-speziellen-marinade-1727604884.webp?v=1729157602',
		route: 'grilled',
	},
	{
		id: 7,
		name: 'Vegetarian',
		image:
			'https://media.istockphoto.com/id/1416818056/photo/colourful-vegan-bowl-with-quinoa-and-sweet-potato.jpg?s=612x612&w=0&k=20&c=t1I58CqucV6bLRaa4iDy7PIVjnV8D9eWDjEsX9X-87k=',
		route: 'vegetarian',
	},
	{
		id: 8,
		name: 'Desserts',
		image: 'https://wallpapercave.com/wp/wp12572997.jpg',
		route: 'desserts',
	},
	{
		id: 9,
		name: 'Beverages',
		image:
			'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=500&q=80',
		route: 'beverages',
	},
]

// --- Sub-component: Delete Confirmation Modal (GIỮ NGUYÊN) ---
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, categoryName }) => {
	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm font-['Work_Sans',_sans-serif]">
			<div className="bg-[#1A202C] p-6 rounded-xl w-full max-w-sm shadow-2xl">
				<h3 className="text-xl font-bold text-red-400 mb-4">Confirm Deletion</h3>
				<p className="text-[#9dabb9] mb-6">
					Are you sure you want to delete the category &quot;{categoryName}
					&quot;? This action will permanently remove all associated dishes.
				</p>
				<div className="flex justify-end gap-3">
					<button
						onClick={onClose}
						className="h-10 px-4 rounded-lg bg-[#2D3748] text-white text-sm font-bold hover:bg-[#4A5568] transition-colors"
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						className="h-10 px-4 rounded-lg bg-[#dc2626] text-white text-sm font-bold hover:bg-red-700 transition-colors"
					>
						Yes, Delete
					</button>
				</div>
			</div>
		</div>
	)
}

// --- Sub-component: Category Button Card (ĐÃ SỬA ĐỔI) ---
const CategoryCard = ({ category, onClick, onDeleteRequest }) => {
	// Ngăn chặn sự kiện click thẻ khi nhấn nút X
	const handleDeleteClick = (e) => {
		e.stopPropagation() // Ngăn chặn kích hoạt onClick của thẻ
		onDeleteRequest(category) // Mở modal xác nhận
	}

	return (
		<button
			onClick={onClick}
			className="group relative flex w-full aspect-square bg-[#1A202C] rounded-lg overflow-hidden transition-all duration-200 hover:bg-[#2D3748] hover:shadow-xl active:scale-95 border border-transparent focus:outline-none focus:ring-2 focus:ring-[#137fec] p-0" // Bỏ p-5, thêm aspect-square
		>
			{/* 1. Image Container (Chiếm toàn bộ thẻ) */}
			<div className="h-full w-full overflow-hidden relative">
				{/* Lớp Overlay và hiệu ứng Hover Image */}
				<div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10"></div>
				<img
					src={category.image}
					alt={category.name}
					className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
				/>
			</div>

			{/* 2. Content Container (Tên nổi trên ảnh) */}
			<div className="absolute inset-0 z-20 flex flex-col items-start justify-end p-5 w-full text-left">
				<h3 className="text-2xl font-extrabold text-white group-hover:text-[#137fec] transition-colors text-left bg-black/50 p-2 leading-none rounded-lg backdrop-blur-sm shadow-lg">
					{category.name}
				</h3>
				{/* Mô tả đã bị loại bỏ theo yêu cầu */}
			</div>

			{/* 3. DELETE BUTTON (Hiện khi hover) */}
			<div className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
				<button
					onClick={handleDeleteClick}
					title={`Delete ${category.name}`}
					className="flex items-center justify-center w-8 h-8 rounded-full bg-black/50 text-red-400 hover:bg-red-600 hover:text-white transition-colors"
				>
					<span className="material-symbols-outlined text-base">close</span>
				</button>
			</div>
		</button>
	)
}

// --- Sub-component: Add Category Card (ĐÃ SỬA ĐỔI - Thêm aspect-square) ---
const AddCategoryCard = ({ onClick }) => (
	<button
		onClick={onClick}
		className="flex flex-col items-center justify-center w-full aspect-square bg-[#1A202C] rounded-lg p-6 text-center transition-all duration-200 hover:bg-[#2D3748] hover:shadow-xl active:scale-95 border border-dashed border-[#2D3748] hover:border-[#137fec] focus:outline-none focus:ring-2 focus:ring-[#137fec]"
	>
		<span className="material-symbols-outlined text-6xl text-[#137fec] opacity-80 mb-3">
			add_circle
		</span>
		<h3 className="text-xl font-bold text-white">Add New Category</h3>
		<p className="text-sm text-[#9dabb9] mt-1">Organize your menu structure.</p>
	</button>
)

// --- Main Component ---
const MenuCategoryManagement = () => {
	const { user, loading: contextLoading } = useUser()

	const [categories, setCategories] = useState(mockCategories)
	const [loading, setLoading] = useState(false)
	const [isAddModalOpen, setIsAddModalOpen] = useState(false)
	const [selectedCategorySlug, setSelectedCategorySlug] = useState(null)

	// 🚀 STATE XÓA: Quản lý modal xóa và đối tượng cần xóa
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [categoryToDelete, setCategoryToDelete] = useState(null)

	// 2. Hàm Fetch Data (GET) - Giữ nguyên
	const fetchCategories = async () => {
		// Comment: BẮT ĐẦU: Logic gọi API lấy danh sách Category
		console.log('Fetching menu categories...')
		// setLoading(true);
		// try {
		//      const response = await axios.get('/api/tenant/menu/categories');
		//      setCategories(response.data.categories);
		// } catch (error) {
		//      console.error("Error fetching categories:", error);
		// } finally {
		//      setLoading(false);
		// }
		// Comment: KẾT THÚC: Logic gọi API lấy danh sách Category
	}

	useEffect(() => {
		// if (!contextLoading) fetchCategories();
	}, [contextLoading])

	// 3. Hàm Xử lý Xóa (DELETE)
	const handleDeleteCategory = async (category) => {
		// Comment: MỞ MODAL xác nhận
		setCategoryToDelete(category)
		setIsDeleteModalOpen(true)
	}

	const confirmDelete = async () => {
		if (!categoryToDelete) return

		const categoryId = categoryToDelete.id
		const categoryName = categoryToDelete.name

		setIsDeleteModalOpen(false)
		setLoading(true)

		// 🚀 BƯỚC 1: CẬP NHẬT UI NGAY LẬP TỨC (Optimistic Update)
		setCategories((prev) => prev.filter((c) => c.id !== categoryId))
		setCategoryToDelete(null) // Reset đối tượng

		// Comment: BẮT ĐẦU: Logic gọi API xóa Category
		console.log(`DELETING Category: ${categoryId}`)

		// try {
		//      // API endpoint: DELETE /api/tenant/menu/categories/:id
		//      // Backend cần đảm bảo xóa sạch món ăn liên quan
		//      await axios.delete(`/api/tenant/menu/categories/${categoryId}`);
		//      console.log(`Category ${categoryId} deleted successfully.`);
		// } catch (error) {
		//      console.error("Error deleting category:", error);
		//      // Khắc phục trạng thái: Nếu xóa thất bại, fetch lại toàn bộ danh sách
		//      fetchCategories();
		//      alert(`Xóa ${categoryName} thất bại! Vui lòng kiểm tra console.`);
		// } finally {
		//      setLoading(false);
		// }
		// Comment: KẾT THÚC: Logic gọi API xóa Category
		setLoading(false) // Vì đang dùng mock data nên set lại loading
	}

	// --- Các hàm khác (giữ nguyên) ---
	const handleCardClick = (route) => {
		setSelectedCategorySlug(route)
	}

	const handleBackToCategories = () => {
		setSelectedCategorySlug(null)
	}

	const handleAddCategory = () => {
		setIsAddModalOpen(true)
	}

	const handleSaveCategory = (newCategory) => {
		const categoryWithRoute = {
			...newCategory,
			route: newCategory.name.toLowerCase().replace(/\s+/g, '-'),
			id: Date.now(),
		}
		setCategories((prev) => [...prev, categoryWithRoute])
	}

	const handleAddDish = () => {
		alert('Opening form to add new dish directly.')
	}
	// --- Kết thúc các hàm khác ---

	// Xử lý loading state của Context
	if (contextLoading) {
		return (
			<div className="flex min-h-screen bg-[#101922] w-full items-center justify-center">
				<p className="text-white">Loading...</p>
			</div>
		)
	}

	const renderCategoryListView = () => {
		return (
			<>
				{/* Page Header (Giữ nguyên) */}
				<header className="flex flex-wrap justify-between items-center gap-4 mb-8">
					<div className="flex flex-col gap-2">
						<h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
							Menu Categories
						</h1>
						<p className="text-[#9dabb9] text-base">
							Manage your restaurant&apos;s menu by category.
						</p>
					</div>
				</header>

				{/* Category Grid (CĂN CHỈNH ĐẸP MẮT) */}
				<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
					{loading ? (
						<p className="text-[#9dabb9] lg:col-span-3 text-center py-10">
							Loading categories...
						</p>
					) : (
						categories.map((category) => (
							<CategoryCard
								key={category.id}
								category={category}
								onClick={() => handleCardClick(category.route)}
								// 🚨 Gắn hàm xóa vào thẻ
								onDeleteRequest={handleDeleteCategory}
							/>
						))
					)}

					{/* THẺ ADD CATEGORY LUÔN Ở CUỐI */}
					<AddCategoryCard onClick={handleAddCategory} />
				</div>

				{/* MODALS */}
				<AddCategoryModal
					isOpen={isAddModalOpen}
					onClose={() => setIsAddModalOpen(false)}
					onSave={handleSaveCategory}
				/>

				{/* 🚨 MODAL XÁC NHẬN XÓA */}
				<DeleteConfirmationModal
					isOpen={isDeleteModalOpen}
					onClose={() => setIsDeleteModalOpen(false)}
					onConfirm={confirmDelete}
					categoryName={categoryToDelete?.name}
				/>
			</>
		)
	}

	return (
		<BasePageLayout activeRoute="Menu">
			{selectedCategorySlug ? (
				// Render trang Dishes nếu có category được chọn
				<CategoryDishes
					categorySlug={selectedCategorySlug}
					onBack={handleBackToCategories}
				/>
			) : (
				// Render trang quản lý Categories
				renderCategoryListView()
			)}
		</BasePageLayout>
	)
}

export default MenuCategoryManagement
