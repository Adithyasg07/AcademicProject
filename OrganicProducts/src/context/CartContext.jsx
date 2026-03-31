import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../api/apiService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            setCartItems([]);
        }
    }, [isAuthenticated]);

    const fetchCart = async () => {
        try {
            setIsLoading(true);
            const data = await apiService.get('/Cart');
            
            // Format data keys properly since they come back as PascalCase from the dictionary
            const formatted = data.map(item => ({
                id: item.Id,
                productId: item.ProductId,
                productName: item.ProductName,
                quantity: item.Quantity,
                size: item.Size,
                price: item.Price
            }));
            setCartItems(formatted);
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const addToCart = async (product, size, quantity) => {
        if (!isAuthenticated) {
            alert("Please login to add items to cart");
            return false;
        }

        try {
            await apiService.post('/Cart', {
                productId: product.id || product.Id,
                productName: product.name || product.Name,
                quantity: quantity,
                size: size.label,
                price: size.price
            });
            await fetchCart();
            return true;
        } catch (error) {
            console.error("Failed to add to cart:", error);
            return false;
        }
    };

    const updateQuantity = async (cartItemId, quantity) => {
        try {
            if (quantity <= 0) {
                return await removeFromCart(cartItemId);
            }
            await apiService.put(`/Cart/${cartItemId}`, { quantity });
            // Optimistic UI update
            setCartItems(prev => prev.map(item => item.id === cartItemId ? { ...item, quantity } : item));
        } catch (error) {
            console.error("Failed to update quantity:", error);
            await fetchCart(); // Revert on failure
        }
    };

    const removeFromCart = async (cartItemId) => {
        try {
            await apiService.delete(`/Cart/${cartItemId}`);
            setCartItems(prev => prev.filter(item => item.id !== cartItemId));
        } catch (error) {
            console.error("Failed to remove from cart:", error);
            await fetchCart();
        }
    };

    const clearCart = () => setCartItems([]);

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            isLoading,
            addToCart,
            updateQuantity,
            removeFromCart,
            fetchCart,
            clearCart,
            getCartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
