// components/modals/AddDishModal.jsx (Đã gỡ bỏ Context và logic thừa)

import React, { useState } from 'react'
// import axios from 'axios'; // Import Axios khi bạn sẵn sàng tích hợp API

const AddDishModal = ({ isOpen, onClose, onSave, categorySlug, categoryName }) => {
	// 1. State quản lý form data (Không trùng lặp với state của CategoryDishes)
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		price: '',
		imageFile: null,
	})
	const [previewImage, setPreviewImage] = useState(null)
	const [loading, setLoading] = useState(false)

	// 2. Hàm xử lý thay đổi input
	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	// 3. Hàm xử lý chọn ảnh và tạo preview
	const handleFileChange = (e) => {
		const file = e.target.files[0]
		if (file) {
			setFormData((prev) => ({ ...prev, imageFile: file }))
			// Tạo URL preview cho ảnh
			const reader = new FileReader()
			reader.onloadend = () => {
				setPreviewImage(reader.result)
			}
			reader.readAsDataURL(file)
		}
	}

	// 4. Hàm xử lý submit form
	const handleSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)

		// Comment: BẮT ĐẦU: Logic gọi API thêm Dish mới
		console.log(`Submitting new dish to ${categorySlug}:`, formData)

		// 🚨 CHÚ Ý: Cần sử dụng FormData vì có file upload
		// const payload = new FormData();
		// payload.append('name', formData.name);
		// payload.append('description', formData.description);
		// payload.append('price', parseFloat(formData.price));
		// payload.append('categorySlug', categorySlug); // Gửi slug/ID category
		// if (formData.imageFile) {
		//     payload.append('image', formData.imageFile);
		// }

		// try {
		//     // API endpoint: POST /api/tenant/menu/dishes
		//     const response = await axios.post('/api/tenant/menu/dishes', payload, {
		//         headers: { 'Content-Type': 'multipart/form-data' }
		//     });
		//     onSave(response.data.newDish); // Truyền món ăn mới về component cha
		//     onClose(); // Đóng modal
		// } catch (error) {
		//     console.error("Error adding dish:", error);
		//     alert("Failed to add dish.");
		// } finally {
		//     setLoading(false);
		// }

		// Giả định thành công
		setTimeout(() => {
			alert(`Dish "${formData.name}" added! (Simulated)`)
			if (onSave) {
				// Giả lập dữ liệu món ăn mới
				onSave({
					id: Date.now(),
					name: formData.name,
					price: parseFloat(formData.price),
					description: formData.description,
					image: previewImage || 'default_image_url',
				})
			}
			setLoading(false)
			onClose()
			// Reset form
			setFormData({ name: '', description: '', price: '', imageFile: null })
			setPreviewImage(null)
		}, 1000)
		// Comment: KẾT THÚC
	}

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm font-['Work_Sans',_sans-serif]">
			<div className="relative w-full max-w-lg transform overflow-hidden rounded-xl bg-black/80 backdrop-blur-md p-8 shadow-2xl transition-all border border-white/10">
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-[#9dabb9] hover:text-white transition-colors"
				>
					<span className="material-symbols-outlined text-2xl">close</span>
				</button>

				<div className="mb-8">
					<h2 className="text-2xl font-bold text-white m-0">
						Add Dish to {categoryName}
					</h2>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Dish Name */}
					<div className="space-y-2">
						<label htmlFor="name" className="block text-sm font-medium text-gray-300">
							Dish Name
						</label>
						<input
							type="text"
							id="name"
							name="name"
							value={formData.name}
							onChange={handleChange}
							placeholder="e.g., Chicken Curry, Margherita Pizza"
							required
							className="w-full bg-[#2D3748] border border-[#4b5563] text-white rounded-lg p-2.5 outline-none transition-colors focus:border-[#137fec] focus:ring-1 focus:ring-[#137fec] placeholder-gray-400"
						/>
					</div>

					{/* Price */}
					<div className="space-y-2">
						<label htmlFor="price" className="block text-sm font-medium text-gray-300">
							Price ($)
						</label>
						<input
							type="number"
							step="0.01"
							id="price"
							name="price"
							value={formData.price}
							onChange={handleChange}
							placeholder="e.g., 12.99"
							required
							className="w-full bg-[#2D3748] border border-[#4b5563] text-white rounded-lg p-2.5 outline-none transition-colors focus:border-[#137fec] focus:ring-1 focus:ring-[#137fec] placeholder-gray-400"
						/>
					</div>

					{/* Description */}
					<div className="space-y-2">
						<label
							htmlFor="description"
							className="block text-sm font-medium text-gray-300"
						>
							Description
						</label>
						<textarea
							id="description"
							name="description"
							rows="3"
							value={formData.description}
							onChange={handleChange}
							placeholder="Briefly describe the ingredients and flavor profile."
							className="w-full bg-[#2D3748] border border-[#4b5563] text-white rounded-lg p-2.5 outline-none transition-colors focus:border-[#137fec] focus:ring-1 focus:ring-[#137fec] placeholder-gray-400 resize-y"
						></textarea>
					</div>

					{/* Image Upload */}
					<div className="space-y-2">
						<label className="block text-sm font-medium text-gray-300">Dish Image</label>
						<div className="flex items-center gap-6">
							{/* Image Preview */}
							<div className="shrink-0">
								<div
									className="w-24 h-24 bg-[#2D3748] rounded-lg flex items-center justify-center border-2 border-dashed border-[#4b5563] overflow-hidden bg-cover bg-center"
									style={
										previewImage
											? {
													backgroundImage: `url(${previewImage})`,
													border: 'none',
											  }
											: {}
									}
								>
									{!previewImage && (
										<span className="material-symbols-outlined text-gray-500 text-4xl">
											image
										</span>
									)}
								</div>
							</div>

							{/* Upload Button */}
							<div className="flex-1">
								<label
									htmlFor="dish-file-upload"
									className="cursor-pointer inline-flex items-center justify-center rounded-lg h-10 px-4 bg-[#137fec] text-white text-sm font-bold tracking-[0.015em] hover:bg-[#137fec]/90 transition-colors"
								>
									<span>{formData.imageFile ? 'Change Image' : 'Upload Image'}</span>
									<input
										id="dish-file-upload"
										name="dish-file-upload"
										type="file"
										className="sr-only"
										accept="image/*"
										onChange={handleFileChange}
									/>
								</label>
								{formData.imageFile && (
									<p className="text-xs text-[#9dabb9] mt-1 truncate max-w-full">
										{formData.imageFile.name}
									</p>
								)}
							</div>
						</div>
					</div>

					{/* Actions */}
					<div className="flex justify-end items-center gap-4 pt-4 border-t border-[#374151]">
						<button
							type="button"
							onClick={onClose}
							className="flex items-center justify-center min-w-[84px] h-10 px-4 rounded-lg bg-transparent text-gray-300 text-sm font-bold hover:bg-[#4b5563] transition-colors"
							disabled={loading}
						>
							<span className="truncate">Cancel</span>
						</button>
						<button
							type="submit"
							className="flex items-center justify-center min-w-[84px] h-10 px-4 rounded-lg bg-[#137fec] text-white text-sm font-bold hover:bg-[#137fec]/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
							disabled={loading || !formData.name || !formData.price}
						>
							{loading ? (
								<span className="truncate">Saving...</span>
							) : (
								<span className="truncate">Save Dish</span>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default AddDishModal
