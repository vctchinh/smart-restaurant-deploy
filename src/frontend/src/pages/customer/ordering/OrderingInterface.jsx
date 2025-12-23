import React, { useState, useMemo, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
// import axios from 'axios'; // Import Axios khi bạn sẵn sàng tích hợp API

// --- CONSTANTS & DATA MOCK ---
const mockCategories = [
	{
		id: 1,
		name: 'Soups',
		image: 'https://images3.alphacoders.com/108/1088128.jpg',
		route: 'soups',
		status: 'ACTIVE',
	},
	{
		id: 4,
		name: 'Noodle Dishes',
		image:
			'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=500&q=80',
		route: 'noodle-dishes',
		status: 'ACTIVE',
	},
	{
		id: 7,
		name: 'Vegetarian',
		image:
			'https://media.istockphoto.com/id/1416818056/photo/colourful-vegan-bowl-with-quinoa-and-sweet-potato.jpg?s=612x612&w=0&k=20&c=t1I58CqucV6bLRaa4iDy7PIVjnV8D9eWDjEsX9X-87k=',
		route: 'vegetarian',
		status: 'ACTIVE',
	},
]

const mockDishesData = {
	soups: [
		{
			id: 'D4',
			name: 'Tomato Soup',
			description: 'Creamy classic tomato soup.',
			price: 8.0,
			imageUrl:
				'https://images.unsplash.com/photo-1547592166-23acbe3a624b?auto=format&fit=crop&w=500&q=80',
			available: true,
			published: true,
			modifiers: [],
		},
		{
			id: 'D5',
			name: 'Chicken Noodle Soup',
			description: 'Hearty chicken soup with vegetables.',
			price: 9.5,
			imageUrl:
				'https://images.unsplash.com/photo-1588566565463-180a5b2090d2?auto=format&fit=crop&w=500&q=80',
			available: true,
			published: true,
			modifiers: [
				{
					id: '7',
					groupName: 'Spice Level',
					label: 'Mild',
					priceDelta: 0,
					type: 'single',
				},
				{
					id: '8',
					groupName: 'Spice Level',
					label: 'Spicy',
					priceDelta: 0,
					type: 'single',
				},
			],
		},
		{
			id: 'D6',
			name: 'Miso Soup',
			description: 'Traditional Japanese soup.',
			price: 6.0,
			imageUrl:
				'https://images.unsplash.com/photo-1606844724698-d4a8f3c2a1e7?auto=format&fit=crop&w=500&q=80',
			available: false,
			published: true,
			modifiers: [],
		},
	],
	'noodle-dishes': [
		{
			id: 1,
			name: 'Spicy Miso Ramen',
			description: 'Ramen with a spicy miso broth, tender chashu pork.',
			price: 15.5,
			imageUrl:
				'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?auto=format&fit=crop&w=500&q=80',
			available: true,
			published: true,
			modifiers: [
				{
					id: '1',
					groupName: 'Size',
					label: 'Small',
					priceDelta: -2,
					type: 'single',
				},
				{
					id: '2',
					groupName: 'Size',
					label: 'Medium',
					priceDelta: 0,
					type: 'single',
				},
				{
					id: '3',
					groupName: 'Size',
					label: 'Large',
					priceDelta: 3,
					type: 'single',
				},
				{
					id: '4',
					groupName: 'Add-ons',
					label: 'Extra Egg',
					priceDelta: 2,
					type: 'multiple',
				},
				{
					id: '5',
					groupName: 'Add-ons',
					label: 'Extra Pork',
					priceDelta: 4,
					type: 'multiple',
				},
				{
					id: '6',
					groupName: 'Add-ons',
					label: 'Extra Noodles',
					priceDelta: 2.5,
					type: 'multiple',
				},
			],
		},
		{
			id: 2,
			name: 'Classic Pad Thai',
			description: 'Wok-fried rice noodles with shrimp and peanuts.',
			price: 14.0,
			imageUrl:
				'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCylxfP50ETWvYyVwTx3qbbPj27wYtyyW5GQ&s',
			available: true,
			published: true,
			modifiers: [],
		},
		{
			id: 3,
			name: 'Beef Pho',
			description: 'Vietnamese beef noodle soup with herbs.',
			price: 13.5,
			imageUrl:
				'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=500&q=80',
			available: true,
			published: true,
			modifiers: [
				{
					id: '9',
					groupName: 'Meat Choice',
					label: 'Rare Beef',
					priceDelta: 0,
					type: 'single',
				},
				{
					id: '10',
					groupName: 'Meat Choice',
					label: 'Well Done',
					priceDelta: 0,
					type: 'single',
				},
				{
					id: '11',
					groupName: 'Meat Choice',
					label: 'Brisket',
					priceDelta: 1.5,
					type: 'single',
				},
			],
		},
		{
			id: 4,
			name: 'Dan Dan Noodles',
			description: 'Spicy Sichuan noodles with minced pork.',
			price: 12.0,
			imageUrl:
				'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=500&q=80',
			available: false,
			published: true,
			modifiers: [],
		},
	],
	vegetarian: [
		{
			id: 'V1',
			name: 'Buddha Bowl',
			description: 'Colorful vegan bowl with quinoa and sweet potato.',
			price: 12.0,
			imageUrl:
				'https://media.istockphoto.com/id/1416818056/photo/colourful-vegan-bowl-with-quinoa-and-sweet-potato.jpg?s=612x612&w=0&k=20&c=t1I58CqucV6bLRaa4iDy7PIVjnV8D9eWDjEsX9X-87k=',
			available: true,
			published: true,
			modifiers: [],
		},
		{
			id: 'V2',
			name: 'Veggie Burger',
			description: 'Plant-based burger with avocado and fries.',
			price: 11.5,
			imageUrl:
				'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=500&q=80',
			available: true,
			published: true,
			modifiers: [
				{
					id: '12',
					groupName: 'Extras',
					label: 'Cheese',
					priceDelta: 1,
					type: 'multiple',
				},
				{
					id: '13',
					groupName: 'Extras',
					label: 'Bacon',
					priceDelta: 2,
					type: 'multiple',
				},
			],
		},
		{
			id: 'V3',
			name: 'Greek Salad',
			description: 'Fresh salad with feta and olives.',
			price: 9.0,
			imageUrl:
				'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=500&q=80',
			available: true,
			published: true,
			modifiers: [],
		},
	],
}

const formatCategoryName = (slug) => {
	if (!slug) return 'Dishes'
	return slug
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')
}

// =========================================================
// 🚨 MODAL: Dish Customization Modal (Modifiers)
// =========================================================
const DishCustomizationModal = ({ dish, onClose, onAddToCart }) => {
	const modalRef = useRef(null)
	const [isVisible, setIsVisible] = useState(false)

	// Group modifiers by groupName for display
	const modifierGroups = useMemo(() => {
		if (!dish?.modifiers || dish.modifiers.length === 0) return []

		const groups = {}
		dish.modifiers.forEach((mod) => {
			if (!groups[mod.groupName]) {
				groups[mod.groupName] = {
					name: mod.groupName,
					type: mod.type, // 'single' or 'multiple'
					options: [],
				}
			}
			groups[mod.groupName].options.push(mod)
		})

		return Object.values(groups)
	}, [dish])

	const [selectedModifiers, setSelectedModifiers] = useState([]) // Array of modifier IDs
	const [quantity, setQuantity] = useState(1)
	const [specialNotes, setSpecialNotes] = useState('')

	// Handle modal open animation and body overflow
	useEffect(() => {
		document.body.style.overflow = 'hidden'
		requestAnimationFrame(() => setIsVisible(true))

		return () => {
			document.body.style.overflow = 'auto'
		}
	}, [])

	if (!dish) return null

	const handleOptionSelect = (modifierId, groupName, type) => {
		setSelectedModifiers((prev) => {
			if (type === 'single') {
				// Remove all other selections from same group, add this one
				const filteredPrev = prev.filter((id) => {
					const mod = dish.modifiers.find((m) => m.id === id)
					return mod && mod.groupName !== groupName
				})
				return [...filteredPrev, modifierId]
			} else {
				// Multiple selection - toggle
				const index = prev.indexOf(modifierId)
				if (index === -1) {
					return [...prev, modifierId]
				} else {
					return prev.filter((id) => id !== modifierId)
				}
			}
		})
	}

	const calculateTotalPrice = () => {
		let total = dish.price * quantity

		// Add selected modifiers' price deltas
		selectedModifiers.forEach((modId) => {
			const modifier = dish.modifiers.find((m) => m.id === modId)
			if (modifier) {
				total += modifier.priceDelta * quantity
			}
		})

		return total
	}

	const handleAddToCart = () => {
		// Get selected modifier details
		const modifierDetails = selectedModifiers.map((modId) => {
			const mod = dish.modifiers.find((m) => m.id === modId)
			return {
				id: mod.id,
				groupName: mod.groupName,
				label: mod.label,
				priceDelta: mod.priceDelta,
			}
		})

		const cartItem = {
			id: dish.id,
			name: dish.name,
			price: dish.price,
			qty: quantity,
			imageUrl: dish.imageUrl,
			description: dish.description,
			modifiers: modifierDetails,
			specialNotes,
			totalPrice: calculateTotalPrice(),
		}

		onAddToCart(cartItem)
		onClose()
	}

	if (!isVisible) return null

	return ReactDOM.createPortal(
		<div
			className={`fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all duration-300`}
		>
			<div
				ref={modalRef}
				className={`relative bg-[#1A202C] rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden border border-white/10 transition-all duration-300 transform scale-100 opacity-100`}
			>
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-white/10">
					<div>
						<h2 className="text-2xl font-bold text-white m-0">{dish.name}</h2>
						<p className="text-[#9dabb9] text-sm mt-1">${dish.price.toFixed(2)}</p>
					</div>
					<button
						onClick={onClose}
						className="p-2 rounded-lg text-[#9dabb9] hover:text-white hover:bg-[#2D3748] transition-colors"
					>
						<span className="material-symbols-outlined">close</span>
					</button>
				</div>

				{/* Content */}
				<div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)] space-y-6">
					{/* Dish Image & Info */}
					<div className="flex gap-4">
						<div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
							<img
								src={dish.imageUrl}
								alt={dish.name}
								className="w-full h-full object-cover"
							/>
						</div>
						<div className="flex-1">
							<p className="text-white leading-relaxed text-sm">{dish.description}</p>
						</div>
					</div>

					{/* Modifiers */}
					{modifierGroups.length > 0 && (
						<div className="space-y-4">
							<h3 className="text-lg font-bold text-white">Customize Your Order</h3>
							{modifierGroups.map((group) => {
								return (
									<div key={group.name} className="bg-[#2D3748] rounded-lg p-4">
										<div className="flex items-center gap-2 mb-3">
											<h4 className="text-white font-semibold m-0">{group.name}</h4>
											<span className="text-xs text-[#9dabb9]">
												({group.type === 'single' ? 'Choose 1' : 'Choose multiple'})
											</span>
										</div>

										<div className="grid grid-cols-2 gap-2">
											{group.options.map((option) => {
												const isSelected = selectedModifiers.includes(option.id)
												return (
													<button
														key={option.id}
														onClick={() =>
															handleOptionSelect(option.id, group.name, group.type)
														}
														className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
															isSelected
																? 'bg-[#137fec] text-white'
																: 'bg-[#1A202C] text-white hover:bg-[#4A5568]'
														}`}
													>
														<span>{option.label}</span>
														{option.priceDelta !== 0 && (
															<span className="ml-1 text-xs text-green-400">
																{option.priceDelta > 0 ? '+' : ''}$
																{option.priceDelta.toFixed(2)}
															</span>
														)}
													</button>
												)
											})}
										</div>
									</div>
								)
							})}
						</div>
					)}

					{/* Special Notes */}
					<div>
						<label className="text-white font-semibold text-sm mb-2 block">
							Special Instructions (Optional)
						</label>
						<textarea
							value={specialNotes}
							onChange={(e) => setSpecialNotes(e.target.value)}
							placeholder="E.g., No onions, extra spicy..."
							className="w-full px-3 py-2 rounded-lg bg-[#2D3748] text-white border border-white/10 focus:border-[#137fec] focus:outline-none resize-none"
							rows="3"
						/>
					</div>

					{/* Quantity Selector */}
					<div className="flex items-center justify-between bg-[#2D3748] rounded-lg p-4">
						<span className="text-white font-semibold">Quantity</span>
						<div className="flex items-center gap-3">
							<button
								onClick={() => setQuantity(Math.max(1, quantity - 1))}
								className="w-10 h-10 flex items-center justify-center bg-[#1A202C] text-white rounded-full hover:bg-[#4A5568] transition-colors"
							>
								−
							</button>
							<span className="text-white font-bold text-lg w-12 text-center">
								{quantity}
							</span>
							<button
								onClick={() => setQuantity(quantity + 1)}
								className="w-10 h-10 flex items-center justify-center bg-[#137fec] text-white rounded-full hover:bg-blue-600 transition-colors"
							>
								+
							</button>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="p-6 border-t border-white/10 flex items-center justify-between bg-[#2D3748]">
					<div>
						<p className="text-[#9dabb9] text-xs">Total Price</p>
						<p className="text-2xl font-bold text-[#4ade80]">
							${calculateTotalPrice().toFixed(2)}
						</p>
					</div>
					<button
						onClick={handleAddToCart}
						className="px-6 py-3 bg-[#137fec] text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
					>
						Add to Cart
					</button>
				</div>
			</div>
		</div>,
		document.body,
	)
}

// =========================================================
// 🚨 COMPONENT: CustomerCategoryCard
// =========================================================
const CustomerCategoryCard = ({ category, onClick }) => {
	return (
		<div
			onClick={() => onClick(category.route)}
			className="group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/10"
		>
			<div className="aspect-square relative">
				<img
					src={category.image}
					alt={category.name}
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
				<div className="absolute bottom-0 left-0 right-0 p-6">
					<h3 className="text-2xl font-bold text-white">{category.name}</h3>
					<div className="mt-2 flex items-center gap-2">
						<span
							className={`px-2 py-1 rounded text-xs font-bold ${
								category.status === 'ACTIVE'
									? 'bg-green-500/20 text-green-400'
									: 'bg-gray-500/20 text-gray-400'
							}`}
						>
							{category.status}
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}

// =========================================================
// 🚨 COMPONENT: DishCard (Updated with full info)
// =========================================================
const DishCard = ({ dish, onViewDetails }) => {
	const hasModifiers = dish.modifiers && dish.modifiers.length > 0

	return (
		<div className="group relative overflow-hidden rounded-xl bg-[#1A202C] shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/10">
			{/* Image Section */}
			<div className="aspect-video relative overflow-hidden">
				<img
					src={dish.imageUrl}
					alt={dish.name}
					className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
				/>

				{/* Availability Badge */}
				{!dish.available && (
					<div className="absolute top-3 right-3">
						<span className="px-2 py-1 bg-red-500/90 text-white text-xs font-bold rounded-full">
							Not Available
						</span>
					</div>
				)}
			</div>

			{/* Content Section */}
			<div className="p-4">
				<div className="flex items-start justify-between mb-2">
					<h3 className="text-lg font-bold text-white flex-1">{dish.name}</h3>
					<span className="text-xl font-bold text-[#4ade80] ml-2">
						${dish.price.toFixed(2)}
					</span>
				</div>

				<p className="text-sm text-[#9dabb9] mb-3 line-clamp-2">{dish.description}</p>

				{/* Meta Info */}
				{hasModifiers && (
					<div className="flex items-center gap-3 mb-3 text-xs text-[#9dabb9]">
						<span className="flex items-center gap-1">
							<span className="material-symbols-outlined text-sm">tune</span>
							Customizable
						</span>
					</div>
				)}

				{/* Action Button */}
				<button
					onClick={() => onViewDetails(dish)}
					disabled={!dish.available}
					className={`w-full py-2 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 ${
						dish.available
							? 'bg-[#137fec] text-white hover:bg-blue-600'
							: 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
					}`}
				>
					{dish.available ? (
						<>
							<span className="material-symbols-outlined text-sm">add_shopping_cart</span>
							{hasModifiers ? 'Customize & Add' : 'Add to Cart'}
						</>
					) : (
						<span>Not Available</span>
					)}
				</button>
			</div>
		</div>
	)
}

// =========================================================
// 🚨 MODAL THANH TOÁN VÀ ĐẶT MÓN (CART MODAL)
// =========================================================
const CartModal = ({ isOpen, onClose, cartItems, onClearCart }) => {
	const [step, setStep] = useState('CART')
	const [paymentLoading, setPaymentLoading] = useState(false)
	const [qrCodeUrl, setQrCodeUrl] = useState(null)
	const [isOrderPlaced, setIsOrderPlaced] = useState(false)

	// Tính tổng tiền (Updated to use totalPrice from cart items)
	const total = useMemo(
		() =>
			cartItems.reduce(
				(acc, item) => acc + (item.totalPrice || item.price * item.qty),
				0,
			),
		[cartItems],
	)

	// Đóng modal và reset trạng thái (Nếu clearCart = true, component cha sẽ xóa giỏ hàng)
	const handleClose = (shouldClearCart = false) => {
		setStep('CART')
		setQrCodeUrl(null)
		setIsOrderPlaced(false)
		setPaymentLoading(false)
		onClose(shouldClearCart)
	}

	// Hàm gọi API lấy QR Code
	const handleCheckout = async () => {
		if (cartItems.length === 0) return
		setStep('PAYMENT')
		setPaymentLoading(true)

		// Comment: BẮT ĐẦU: Logic gọi API GET QR Code thanh toán
		console.log('Fetching QR code for payment...')

		// try {
		//     // API endpoint: GET /api/customer/payment/qr?amount=XX
		//     const qrRes = await axios.get(`/api/customer/payment/qr?amount=${total.toFixed(2)}`);
		//     setQrCodeUrl(qrRes.data.qrImageUrl);
		//     setStep('QR');
		// } catch (error) {
		//     alert("Failed to fetch QR code.");
		//     handleClose();
		// } finally {
		//     setPaymentLoading(false);
		// }

		// Giả lập
		setTimeout(() => {
			setQrCodeUrl(
				'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_many_purposes.svg',
			)
			setStep('QR')
			setPaymentLoading(false)
		}, 1500)
		// Comment: KẾT THÚC: Logic gọi API GET QR Code thanh toán
	}

	// Hàm gọi API Đặt món (Sau khi QR hiện ra)
	const handlePlaceOrder = async () => {
		setIsOrderPlaced(true)
		setPaymentLoading(true)

		// Comment: BẮT ĐẦU: Logic gọi API POST đặt món (Chỉ gọi sau khi QR hiện)
		// const orderPayload = {
		//   tableId: "T101", // Giả định ID bàn
		//   customerNotes: "Order paid via QR code.",
		//   items: cartItems.map((item) => ({
		//     dishId: item.id,
		//     quantity: item.qty,
		//     name: item.name,
		//     price: item.price,
		//     notes: item.notes || "",
		//   })),
		// };

		// try {
		//     // API endpoint: POST /api/customer/order/place
		//     await axios.post('/api/customer/order/place', orderPayload);
		// } catch (error) {
		//     alert('Failed to place order.');
		// } finally {
		//     setPaymentLoading(false);
		//     onClearCart(); // Xóa giỏ hàng trong component cha
		//     handleClose();
		// }

		// Giả lập
		setTimeout(() => {
			alert('Order placed successfully! (Simulated)')
			setPaymentLoading(false)
			onClearCart() // Báo hiệu component cha clear cart
			handleClose()
		}, 2000)
		// Comment: KẾT THÚC: Logic gọi API POST đặt món
	}

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm font-['Work_Sans',_sans-serif]">
			<div className="relative w-full max-w-lg transform overflow-hidden rounded-xl bg-[#1A202C] p-8 shadow-2xl transition-all">
				<h3 className="text-2xl font-bold text-white mb-6">
					{step === 'CART' ? 'Your Order' : 'Order Confirmation'}
				</h3>

				{/* 1. CART VIEW */}
				{step === 'CART' && (
					<div className="space-y-3 max-h-96 overflow-y-auto pr-2">
						{cartItems.length === 0 ? (
							<p className="text-[#9dabb9] text-center py-10">Your cart is empty.</p>
						) : (
							cartItems.map((item, index) => (
								<div key={index} className="bg-[#2D3748] p-4 rounded-lg">
									<div className="flex items-start gap-3">
										{/* Dish Image */}
										<div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
											<img
												src={item.image}
												alt={item.name}
												className="w-full h-full object-cover"
											/>
										</div>

										{/* Dish Info */}
										<div className="flex-1">
											<div className="flex justify-between items-start mb-1">
												<p className="text-white font-semibold">
													{item.qty}x {item.name}
												</p>
												<span className="text-white font-bold">
													${(item.totalPrice || item.price * item.qty).toFixed(2)}
												</span>
											</div>

											{/* Modifiers */}
											{item.modifiers && item.modifiers.length > 0 && (
												<div className="space-y-1 mt-2">
													{item.modifiers.map((mod, modIndex) => (
														<div key={modIndex} className="text-xs text-[#9dabb9]">
															<span className="font-medium">{mod.groupName}:</span>{' '}
															<span>
																{mod.label}
																{mod.priceDelta !== 0 && (
																	<span className="text-green-400">
																		{' '}
																		({mod.priceDelta > 0 ? '+' : ''}$
																		{mod.priceDelta.toFixed(2)})
																	</span>
																)}
															</span>
														</div>
													))}
												</div>
											)}

											{/* Special Notes */}
											{item.specialNotes && (
												<div className="mt-2 text-xs text-yellow-400 italic">
													Note: {item.specialNotes}
												</div>
											)}
										</div>
									</div>
								</div>
							))
						)}
					</div>
				)}

				{/* 2. PAYMENT/QR VIEW */}
				{(step === 'PAYMENT' || step === 'QR') && (
					<div className="flex flex-col items-center justify-center py-10 space-y-4">
						{paymentLoading && <p className="text-white">Fetching QR Code...</p>}
						{qrCodeUrl && (
							<>
								<img
									src={qrCodeUrl}
									alt="Payment QR Code"
									className="w-56 h-56 border-4 border-white rounded-lg"
								/>
								<p className="text-lg font-semibold text-white mt-4">
									Scan the code to finalize payment
								</p>
							</>
						)}
					</div>
				)}

				{/* Footer and Actions */}
				<div className="mt-6 pt-4 border-t border-[#2D3748] flex justify-between items-center">
					<p className="text-xl font-bold text-white">
						Total:{' '}
						<span className="text-3xl font-black text-[#4ade80]">
							${total.toFixed(2)}
						</span>
					</p>

					<div className="flex gap-3">
						<button
							onClick={() => handleClose(false)}
							className="h-10 px-4 rounded-lg bg-[#2D3748] text-white text-sm font-bold hover:bg-[#4A5568]"
						>
							Cancel
						</button>

						{step === 'CART' && (
							<button
								onClick={handleCheckout}
								disabled={cartItems.length === 0}
								className="h-10 px-4 rounded-lg bg-[#137fec] text-white text-sm font-bold hover:bg-[#137fec]/90 disabled:opacity-50"
							>
								Checkout
							</button>
						)}

						{step === 'QR' && (
							<button
								onClick={handlePlaceOrder}
								disabled={isOrderPlaced || paymentLoading}
								className="h-10 px-4 rounded-lg bg-[#4ade80] text-black text-sm font-bold hover:bg-green-500 disabled:opacity-50"
							>
								{isOrderPlaced ? 'Order Placed' : 'Place Order'}
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

// ----------------------------------------------------
// 🚨 COMPONENT 4: Main Interface (Controller)
// ----------------------------------------------------
const OrderManagementInterface = ({ categorySlug = 'noodle-dishes' }) => {
	// 🚨 Chú ý: Component này sẽ thay thế CategoryDishes
	const [dishes, setDishes] = useState(mockDishesData[categorySlug] || [])
	const [cartItems, setCartItems] = useState([]) // { id, name, price, qty, totalPrice, modifiers, specialNotes, image }
	const [isCartOpen, setIsCartOpen] = useState(false)
	const [view, setView] = useState('CATEGORIES') // CATEGORIES | DISHES

	// --- State for Customization Modal ---
	const [selectedDish, setSelectedDish] = useState(null)
	const [isCustomizationOpen, setIsCustomizationOpen] = useState(false)

	// --- Tính toán tổng Cart ---
	const totalItemsInCart = cartItems.reduce((acc, item) => acc + item.qty, 0)

	// --- Handle Dish Click to Open Customization Modal ---
	const handleViewDetails = (dish) => {
		setSelectedDish(dish)
		setIsCustomizationOpen(true)
	}

	// --- Logic Thêm Cart từ Customization Modal ---
	const handleAddToCartFromModal = (cartItem) => {
		// Cart item structure: { id, name, description, price, qty, totalPrice, modifiers, specialNotes, image }
		// Generate unique key for cart item based on dish ID and modifiers
		const modifierKey = JSON.stringify(cartItem.modifiers || [])
		const uniqueKey = `${cartItem.id}-${modifierKey}`

		// Check if exact same item (with same modifiers) exists
		const existingIndex = cartItems.findIndex((item) => {
			const itemModifierKey = JSON.stringify(item.modifiers || [])
			return `${item.id}-${itemModifierKey}` === uniqueKey
		})

		if (existingIndex !== -1) {
			// Update quantity if same item with same modifiers exists
			setCartItems((prev) =>
				prev.map((item, index) =>
					index === existingIndex
						? {
								...item,
								qty: item.qty + cartItem.qty,
								totalPrice:
									(item.qty + cartItem.qty) * (cartItem.totalPrice / cartItem.qty),
						  }
						: item,
				),
			)
		} else {
			// Add as new cart item if different modifiers
			setCartItems((prev) => [...prev, { ...cartItem, uniqueKey }])
		}

		setIsCustomizationOpen(false)
		setSelectedDish(null)
	}

	// Hàm mở/đóng Modal và xử lý xóa giỏ hàng sau khi đặt món
	const handleOpenCart = () => {
		setIsCartOpen(true)
	}

	const handleClearCart = () => {
		setCartItems([])
	}

	const handleCategorySelect = (slug) => {
		// Lấy dishes theo category và chuyển view
		setDishes(mockDishesData[slug] || [])
		setView('DISHES')
	}

	const handleBack = () => {
		setView('CATEGORIES')
	}

	// ----------------------------------------------------
	// 🚨 RENDER
	// ----------------------------------------------------

	return (
		<div className="w-full min-h-screen bg-[#101922] font-['Work_Sans',_sans-serif]">
			{/* TOP HEADER (CART BUTTON) */}
			<div className="sticky top-0 z-40 bg-[#1A202C] p-4 flex justify-between items-center shadow-lg">
				<h1 className="text-xl font-bold text-white">Restaurant Menu</h1>
				<button
					onClick={handleOpenCart}
					className="relative py-2 px-4 mr-4 rounded-xl text-white hover:bg-blue-600 transition-colors flex justify-center"
				>
					<span className="material-symbols-outlined">shopping_cart</span>
					{totalItemsInCart > 0 && (
						<span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">
							{totalItemsInCart}
						</span>
					)}
				</button>
			</div>

			{/* CONTENT VIEWS */}
			{view === 'CATEGORIES' ? (
				// CATEGORY VIEW
				<div className="p-4 float-start flex flex-col items-center justify-center">
					<h2 className="text-2xl font-bold text-white mb-6">Select a Category</h2>
					<div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
						{mockCategories.map((cat) => (
							<CustomerCategoryCard
								key={cat.id}
								category={cat}
								onClick={handleCategorySelect}
							/>
						))}
					</div>
				</div>
			) : (
				// DISHES VIEW
				<div className="p-4">
					<div className="flex items-center gap-3 mb-6">
						<button
							onClick={handleBack}
							className="p-2 rounded-full bg-[#2D3748] text-white hover:bg-[#4A5568] flex justify-center"
						>
							<span className="material-symbols-outlined">arrow_back</span>
						</button>
						<h2 className="text-2xl font-bold text-white">
							{formatCategoryName(categorySlug)}
						</h2>
					</div>

					<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{dishes.map((dish) => (
							<DishCard key={dish.id} dish={dish} onViewDetails={handleViewDetails} />
						))}
					</div>
				</div>
			)}

			{/* CUSTOMIZATION MODAL */}
			{isCustomizationOpen && selectedDish && (
				<DishCustomizationModal
					dish={selectedDish}
					onClose={() => {
						setIsCustomizationOpen(false)
						setSelectedDish(null)
					}}
					onAddToCart={handleAddToCartFromModal}
				/>
			)}

			{/* CART MODAL */}
			<CartModal
				isOpen={isCartOpen}
				onClose={(shouldClearCart) => {
					setIsCartOpen(false)
					if (shouldClearCart) {
						handleClearCart()
					}
				}}
				cartItems={cartItems}
				onClearCart={handleClearCart}
			/>
		</div>
	)
}

export default OrderManagementInterface
