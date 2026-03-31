import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../api/apiService';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    const fetchWishlist = async () => {
        if (!isAuthenticated) return;
        setWishlistLoading(true);
        try {
            const data = await apiService.get("/Wishlist");
            setWishlistItems(data || []);
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        } finally {
            setWishlistLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchWishlist();
        } else {
            setWishlistItems([]);
        }
    }, [isAuthenticated]);

    const addToWishlist = async (productId) => {
        if (!isAuthenticated) return false;
        try {
            await apiService.post("/Wishlist", { productId });
            await fetchWishlist();
            return true;
        } catch (error) {
            console.error("Error adding to wishlist:", error);
            return false;
        }
    };

    const removeFromWishlist = async (productId) => {
        if (!isAuthenticated) return false;
        try {
            await apiService.delete(`/Wishlist/${productId}`);
            setWishlistItems(prev => prev.filter(item => item.ProductId !== productId && item.id !== productId));
            return true;
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            return false;
        }
    };

    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item.ProductId === productId || item.productId === productId || item.id === productId);
    };

    return (
        <WishlistContext.Provider value={{ 
            wishlistItems, 
            addToWishlist, 
            removeFromWishlist, 
            isInWishlist, 
            fetchWishlist,
            wishlistLoading 
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
