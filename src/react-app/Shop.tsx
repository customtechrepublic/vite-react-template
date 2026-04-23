import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
	ShoppingCart, X, Search, Filter, Plus, Minus, Trash2, CheckCircle, ArrowRight,
	Headphones, Cloud, Mail, Folder, Briefcase, Award, Code, Server
} from "lucide-react";

interface ShopItem {
	id: string;
	name: string;
	category: string;
	type: string;
	description: string;
	price: number;
	duration: string;
	icon: string;
	featured: boolean;
}

interface CartItem extends ShopItem {
	quantity: number;
}

const iconMap: Record<string, React.ReactNode> = {
	Headphones: <Headphones size={24} />,
	Cloud: <Cloud size={24} />,
	Mail: <Mail size={24} />,
	Folder: <Folder size={24} />,
	Briefcase: <Briefcase size={24} />,
	Award: <Award size={24} />,
	Code: <Code size={24} />,
	Server: <Server size={24} />,
	CheckCircle: <CheckCircle size={24} />,
};

const getIconComponent = (iconName: string) => iconMap[iconName] || <Briefcase size={24} />;

export default function Shop() {
	const [items, setItems] = useState<ShopItem[]>([]);
	const [cart, setCart] = useState<CartItem[]>([]);
	const [showCart, setShowCart] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

	// Load pricelist from CSV
	useEffect(() => {
		const loadPricelist = async () => {
			try {
			const response = await fetch("/pricelist.csv");
			const csvText = await response.text();
			const lines = csvText.trim().split("\n");
			
			const parsedItems: ShopItem[] = lines.slice(1).map(line => {
					const values = line.split(",");
					return {
						id: values[0],
						name: values[1],
						category: values[2],
						type: values[3],
						description: values[4],
						price: parseFloat(values[5]),
						duration: values[6],
						icon: values[7],
						featured: values[8] === "true",
					};
				});
				
				setItems(parsedItems);
				setLoading(false);
			} catch (error) {
				console.error("Error loading pricelist:", error);
				setLoading(false);
			}
		};

		loadPricelist();
	}, []);

	// Load cart from localStorage
	useEffect(() => {
		const savedCart = localStorage.getItem("shop_cart");
		if (savedCart) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setCart(JSON.parse(savedCart));
		}
	}, []);

	// Save cart to localStorage
	useEffect(() => {
		localStorage.setItem("shop_cart", JSON.stringify(cart));
	}, [cart]);

	// Handle redirect to Stripe
	useEffect(() => {
		if (redirectUrl) {
			window.location.href = redirectUrl;
		}
	}, [redirectUrl]);

	const categories = ["All", ...Array.from(new Set(items.map(item => item.category)))];

	const filteredItems = items.filter(item => {
		const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.description.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesCategory = !selectedCategory || selectedCategory === "All" || item.category === selectedCategory;
		return matchesSearch && matchesCategory;
	});

	const addToCart = (item: ShopItem) => {
		const existingItem = cart.find(ci => ci.id === item.id);
		if (existingItem) {
			setCart(cart.map(ci => ci.id === item.id ? {...ci, quantity: ci.quantity + 1} : ci));
		} else {
			setCart([...cart, {...item, quantity: 1}]);
		}
	};

	const removeFromCart = (itemId: string) => {
		setCart(cart.filter(ci => ci.id !== itemId));
	};

	const updateQuantity = (itemId: string, quantity: number) => {
		if (quantity <= 0) {
			removeFromCart(itemId);
		} else {
			setCart(cart.map(ci => ci.id === itemId ? {...ci, quantity} : ci));
		}
	};

	const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
	const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

	const handleCheckout = async () => {
		if (cart.length === 0) return;

		try {
			const response = await fetch("/api/checkout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ cart, total: cartTotal })
			});

			const data = await response.json() as Record<string, unknown>;
			const sessionUrl = data.sessionUrl as string;
			if (sessionUrl) {
				setRedirectUrl(sessionUrl);
			}
		} catch (error) {
			console.error("Checkout error:", error);
		}
	};

	return (
		<div className="shop-container">
			{/* Shop Header */}
			<section className="shop-hero">
				<motion.div 
					className="shop-hero-content"
					initial={{ opacity: 0, y: -30 }}
					animate={{ opacity: 1, y: 0 }}
				>
					<h1>Professional IT Services & Products</h1>
					<p>Choose from a range of services, consulting packages, and digital products</p>
				</motion.div>
			</section>

			{/* Shop Main */}
			<section className="shop-main">
				<div className="shop-controls">
					{/* Search Bar */}
					<motion.div 
						className="search-bar"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
					>
						<Search size={20} />
						<input 
							type="text"
							placeholder="Search services, products..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</motion.div>

					{/* Cart Button */}
					<motion.button 
						className="cart-button"
						onClick={() => setShowCart(!showCart)}
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<ShoppingCart size={20} />
						{cartCount > 0 && <span className="cart-count">{cartCount}</span>}
					</motion.button>
				</div>

				<div className="shop-content">
					{/* Sidebar - Categories */}
					<motion.aside 
						className="shop-sidebar"
						initial={{ opacity: 0, x: -30 }}
						animate={{ opacity: 1, x: 0 }}
					>
						<h3><Filter size={20} /> Categories</h3>
						<div className="category-list">
							{categories.map(cat => (
								<motion.button
									key={cat}
									className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
									onClick={() => setSelectedCategory(cat === "All" ? null : cat)}
									whileHover={{ x: 5 }}
								>
									{cat}
									<span className="item-count">
										{cat === "All" ? items.length : items.filter(i => i.category === cat).length}
									</span>
								</motion.button>
							))}
						</div>
					</motion.aside>

					{/* Products Grid */}
					<div className="shop-grid">
						{loading ? (
							<p>Loading products...</p>
						) : filteredItems.length === 0 ? (
							<p className="no-results">No products found matching your search</p>
						) : (
							filteredItems.map((item, idx) => (
								<motion.div
									key={item.id}
									className={`shop-card ${item.featured ? "featured" : ""}`}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: idx * 0.05 }}
									whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0, 183, 195, 0.2)" }}
								>
									{item.featured && <div className="featured-badge">Featured</div>}
									
									<div className="shop-card-icon">
										{getIconComponent(item.icon)}
									</div>

									<h3>{item.name}</h3>
									<p className="shop-card-category">{item.category}</p>
									<p className="shop-card-description">{item.description}</p>

									<div className="shop-card-meta">
										<span className="duration">{item.duration}</span>
										<span className="type">{item.type}</span>
									</div>

									<div className="shop-card-footer">
										<div className="price">
											R{item.price.toFixed(2)}
											{item.duration === "month" && <span className="period">/mo</span>}
											{item.duration === "session" && <span className="period">/session</span>}
										</div>
										<motion.button
											className="btn-add-to-cart"
											onClick={() => addToCart(item)}
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
										>
											<Plus size={18} /> Add
										</motion.button>
									</div>
								</motion.div>
							))
						)}
					</div>
				</div>
			</section>

			{/* Shopping Cart Sidebar */}
			<AnimatePresence>
				{showCart && (
					<motion.div 
						className="cart-sidebar"
						initial={{ x: 400 }}
						animate={{ x: 0 }}
						exit={{ x: 400 }}
						transition={{ type: "spring", stiffness: 300, damping: 30 }}
					>
						<div className="cart-header">
							<h2>Shopping Cart</h2>
							<button onClick={() => setShowCart(false)} className="close-btn">
								<X size={24} />
							</button>
						</div>

						<div className="cart-items">
							{cart.length === 0 ? (
								<p className="empty-cart">Your cart is empty</p>
							) : (
								cart.map(item => (
									<motion.div 
										key={item.id}
										className="cart-item"
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: 20 }}
									>
										<div className="cart-item-info">
											<h4>{item.name}</h4>
											<p>R{item.price.toFixed(2)} each</p>
										</div>

										<div className="cart-item-controls">
											<button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
												<Minus size={16} />
											</button>
											<span>{item.quantity}</span>
											<button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
												<Plus size={16} />
											</button>
										</div>

										<div className="cart-item-total">
											R{(item.price * item.quantity).toFixed(2)}
										</div>

										<button 
											onClick={() => removeFromCart(item.id)}
											className="remove-btn"
										>
											<Trash2 size={18} />
										</button>
									</motion.div>
								))
							)}
						</div>

						{cart.length > 0 && (
							<motion.div 
								className="cart-footer"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
							>
								<div className="cart-total">
									<span>Total:</span>
									<span className="total-amount">R{cartTotal.toFixed(2)}</span>
								</div>
								<motion.button
									className="btn btn-primary checkout-btn"
									onClick={handleCheckout}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<CheckCircle size={20} />
									Proceed to Checkout
									<ArrowRight size={20} />
								</motion.button>
							</motion.div>
						)}
					</motion.div>
				)}
			</AnimatePresence>

			{/* Overlay for cart sidebar */}
			<AnimatePresence>
				{showCart && (
					<motion.div 
						className="cart-overlay"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setShowCart(false)}
					/>
				)}
			</AnimatePresence>
		</div>
	);
}
