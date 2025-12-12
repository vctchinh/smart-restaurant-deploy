import React, { useState } from 'react'
// import axios from 'axios'; // Import Axios khi bạn sẵn sàng tích hợp API

const AddCategoryModal = ({ isOpen, onClose, onSave }) => {
	// 1. State quản lý form data
	const [formData, setFormData] = useState({
		categoryName: '',
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

		// Comment: BẮT ĐẦU: Logic gọi API thêm Category mới
		console.log('Submitting new category:', formData)

		// const payload = new FormData();
		// payload.append('name', formData.categoryName);
		// payload.append('description', formData.description);
		// if (formData.imageFile) {
		//     payload.append('image', formData.imageFile);
		// }

		// try {
		//     const response = await axios.post('/api/tenant/menu/categories', payload, {
		//         headers: { 'Content-Type': 'multipart/form-data' }
		//     });
		//     onSave(response.data); // Truyền dữ liệu mới về component cha để cập nhật list
		//     onClose(); // Đóng modal
		// } catch (error) {
		//     console.error("Error adding category:", error);
		//     alert("Failed to add category.");
		// } finally {
		//     setLoading(false);
		// }

		// Giả định thành công
		setTimeout(() => {
			alert('Category added successfully! (Simulated)')
			// Gọi callback onSave để cập nhật UI cha (nếu có)
			if (onSave)
				onSave({
					id: Date.now(),
					name: formData.categoryName,
					image: previewImage || 'default_image_url',
				})
			setLoading(false)
			onClose()
			// Reset form
			setFormData({ categoryName: '', imageFile: null })
			setPreviewImage(null)
		}, 1000)
		// Comment: KẾT THÚC
	}

	// Nếu modal không mở, không render gì cả
	if (!isOpen) return null

	return (
		// Overlay: Lớp nền mờ bao phủ toàn màn hình
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm font-['Work_Sans',_sans-serif]">
			{/* Modal Container */}
			<div className="relative w-full max-w-2xl transform overflow-hidden rounded-xl bg-black/80 backdrop-blur-md p-8 shadow-2xl transition-all border border-white/10">
				{/* Close Button (Optional X icon at top right) */}
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-[#9dabb9] hover:text-white transition-colors"
				>
					<span className="material-symbols-outlined text-2xl">close</span>
				</button>

				{/* Header */}
				<div className="mb-8">
					<h2 className="text-2xl font-bold text-white m-0">Add New Category</h2>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-8">
					{/* Category Name */}
					<div className="space-y-2">
						<label
							htmlFor="categoryName"
							className="block text-sm font-medium text-gray-300"
						>
							Category Name
						</label>
						<input
							type="text"
							id="categoryName"
							name="categoryName"
							value={formData.categoryName}
							onChange={handleChange}
							placeholder="e.g., Appetizers, Main Courses"
							required
							className="w-full bg-[#2D3748] border border-[#4b5563] text-white rounded-lg p-2.5 outline-none transition-colors focus:border-[#137fec] focus:ring-1 focus:ring-[#137fec] placeholder-gray-400"
						/>
					</div>

					{/* Image Upload */}
					<div className="space-y-2">
						<label className="block text-sm font-medium text-gray-300">
							Category Icon/Image
						</label>
						<div className="flex items-center gap-6">
							{/* Image Preview */}
							<div className="shrink-0">
								<div
									className="w-32 h-32 bg-[#2D3748] rounded-lg flex items-center justify-center border-2 border-dashed border-[#4b5563] overflow-hidden bg-cover bg-center"
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
										<span className="material-symbols-outlined text-gray-500 text-5xl">
											image
										</span>
									)}
								</div>
							</div>

							{/* Upload Button & Details */}
							<div className="flex-1">
								<p className="text-gray-400 text-sm mb-4 m-0">
									Upload an image or select an icon for the category. Recommended size:
									200x200px.
								</p>
								<label
									htmlFor="file-upload"
									className="cursor-pointer inline-flex items-center justify-center rounded-lg h-10 px-4 bg-[#137fec] text-white text-sm font-bold tracking-[0.015em] hover:bg-[#137fec]/90 transition-colors"
								>
									<span>Upload Image</span>
									<input
										id="file-upload"
										name="file-upload"
										type="file"
										className="sr-only"
										accept="image/*"
										onChange={handleFileChange}
									/>
								</label>
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
							disabled={loading}
						>
							{loading ? (
								<span className="truncate">Saving...</span>
							) : (
								<span className="truncate">Save Category</span>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default AddCategoryModal
