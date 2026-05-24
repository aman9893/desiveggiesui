import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ArrowRightIcon, MinusIcon, PlusIcon, ShoppingBagIcon, Trash2Icon, XIcon } from "lucide-react";

const CartSidebar = () => {
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "₹";

    const { items, updateQuantity, removeFromCart, cartTotal, isCartOpen, setIsCartOpen } = useCart();

    const navigate = useNavigate();

    if (!isCartOpen) return null;

    const deliveryFee = cartTotal > 500 ? 0 : 50;
    const grandTotal = cartTotal + deliveryFee;

    return (
        <>
            {/* Overlay */}
            <div onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/40 z-50 transition-opacity" />

            {/* Sidebar */}
            <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col animate-slide-in-right">
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b border-app-border">
                    <div className="flex items-center gap-2">
                        <ShoppingBagIcon className="size-4" />
                        <h2 className="text-sm font-medium">Your Cart</h2>
                        <span className="px-1.5 py-0.5 text-xs font-semibold bg-app-cream rounded-full">{items.length}</span>
                    </div>
                    <button onClick={() => setIsCartOpen(false)} className="p-1.5 rounded-lg hover:bg-app-cream transition-colors">
                        <XIcon className="size-4" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2 pb-2 md:pb-0">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <ShoppingBagIcon className="size-12 text-app-border mb-2" />
                            <h3 className="text-sm font-medium mb-1">Your cart is empty</h3>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.product.id} className="flex gap-2 bg-app-cream/60 rounded-lg p-2">
                                <img src={item.product.image} alt={item.product.name} className="size-12 rounded-md object-cover shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-semibold truncate">{item.product.name}</h4>
                                    <p className="text-xs text-app-text-light">
                                        {currency}
                                        {item.product.price.toFixed(2)}
                                    </p>
                                    <div className="flex items-center justify-between mt-1">
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="size-6 rounded-md bg-white border border-app-border flex-center">
                                                <MinusIcon className="size-2.5" />
                                            </button>

                                            <span className="text-xs font-semibold w-5 text-center">{item.quantity}</span>

                                            <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="size-6 rounded-md bg-white border border-app-border flex-center">
                                                <PlusIcon className="size-2.5" />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs font-semibold">
                                                {currency}
                                                {(item.product.price * item.quantity).toFixed(2)}
                                            </span>
                                            <button onClick={() => removeFromCart(item.product.id)} className="p-0.5 text-app-text-light hover:text-app-error transition-colors">
                                                <Trash2Icon className="size-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-3 border-t border-app-border space-y-2 margin-bottom-60">
                        <div className="flex justify-between text-xs">
                            <span className="text-app-text-light">Subtotal</span>
                            <span className="font-medium">
                                {currency}
                                {cartTotal.toFixed(2)}
                            </span>
                        </div>

                        <div className="flex justify-between text-xs">
                            <span className="text-app-text-light">Delivery</span>
                            <span className="font-medium">{deliveryFee === 0 ? <span className="text-app-success">Free</span> : `${currency}${deliveryFee.toFixed(2)}`}</span>
                        </div>

                        {deliveryFee > 0 && <p className="text-xs text-app-text-light text-center">Free on orders over {currency}500</p>}

                        <div className="flex justify-between text-sm font-semibold border-t border-app-border pt-2">
                            <span>Total</span>
                            <span>
                                {currency}
                                {grandTotal.toFixed(2)}
                            </span>
                        </div>

                        <button
                            onClick={() => {
                                setIsCartOpen(false);
                                navigate("/checkout");
                                window.scrollTo(0, 0);
                            }}
                            className="w-full py-2 bg-app-orange text-white font-semibold rounded-lg hover:bg-app-orange-dark transition-colors flex-center gap-1 active:scale-[0.98] text-sm"
                        >
                            Checkout <ArrowRightIcon className="size-3" />
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartSidebar;
