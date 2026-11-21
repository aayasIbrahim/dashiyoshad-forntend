import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface WishlistState {
  productIds: string[];
}

const initialState: WishlistState = { productIds: [] };

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlistItem(state, action: PayloadAction<string>) {
      const index = state.productIds.indexOf(action.payload);
      if (index >= 0) state.productIds.splice(index, 1);
      else state.productIds.push(action.payload);
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.productIds = state.productIds.filter((id) => id !== action.payload);
    },
    clearWishlist(state) {
      state.productIds = [];
    },
    replaceWishlistItems(state, action: PayloadAction<string[]>) {
      state.productIds = action.payload;
    },
  },
});

export const {
  toggleWishlistItem,
  removeFromWishlist,
  clearWishlist,
  replaceWishlistItems,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;
