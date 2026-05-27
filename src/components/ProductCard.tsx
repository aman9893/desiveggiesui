import { useNavigate } from "react-router-dom";
import type { Product } from "../types";
import { Plus, Minus, Heart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";

interface Props {
    product: Product;
}

const ProductCard = ({ product }: Props) => {
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "₹";
    const { items, addToCart, updateQuantity, removeFromCart } = useCart();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    // Initialize quantity from cart on mount and when cart items change
    useEffect(() => {
        const cartItem = items.find((item) => item.product.id === product.id);
        if (cartItem) {
            setQuantity(cartItem.quantity);
        } else {
            setQuantity(0);
        }
    }, [items, product.id]);

    const handleAddToCart = () => {
        addToCart(product, 1, false);
    };

    const handleIncrement = () => {
        addToCart(product, 1, false);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            updateQuantity(product.id, quantity - 1);
        } else if (quantity === 1) {
            removeFromCart(product.id);
        }
    };

    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group animate-fade-in">
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gray-50 cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}>
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300" 
                />

                {/* Discount Badge */}
                {product.discount > 0 && (
                    <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 text-[10px] font-bold uppercase bg-orange-500 text-white rounded-md">
                            {product.discount}% OFF
                        </span>
                    </div>
                )}

                {/* Favorites Button */}
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsFavorite(!isFavorite);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-sm"
                >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
            </div>

            {/* Info Container */}
            <div className="p-2 sm:p-3">
                {/* Product Name */}
                <h3 
                    className="text-[10px] sm:text-sm font-medium text-zinc-800 line-clamp-2 mb-1.5 cursor-pointer hover:text-orange-600 transition-colors"
                    onClick={() => navigate(`/products/${product.id}`)}
                >
                    {product.name}
                </h3>

                {/* Price Info */}
                <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-xs sm:text-lg font-bold text-zinc-900">
                        {currency}{product.price.toFixed(0)}
                    </span>
                    {product.originalPrice > product.price && (
                        <span className="text-[8px] sm:text-xs text-zinc-500 line-through">
                            {currency}{product.originalPrice.toFixed(0)}
                        </span>
                    )}
                    <span className="text-[8px] sm:text-xs text-zinc-600 ml-auto">
                        {product.unit}
                    </span>
                </div>

                {/* Quantity Selector & Add Button */}
                {quantity === 0 ? (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart();
                        }}
                        className="w-full py-1 sm:py-1.5 bg-white border-2 border-orange-500 text-orange-500 font-bold text-[10px] sm:text-sm rounded-lg hover:bg-orange-50 transition-colors"
                    >
                        ADD
                    </button>
                ) : (
                    <div className="flex items-center justify-between border border-gray-300 rounded-lg overflow-hidden">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDecrement();
                            }}
                            className="p-0.5 sm:p-1 text-gray-600 hover:text-orange-500 transition-colors"
                        >
                            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <span className="text-xs sm:text-sm font-bold text-zinc-800 flex-1 text-center">
                            {quantity}
                        </span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleIncrement();
                            }}
                            className="p-0.5 sm:p-1 text-gray-600 hover:text-orange-500 transition-colors"
                        >
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
