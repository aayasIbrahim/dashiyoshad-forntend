import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./index";

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectWishlistIds = (state: RootState) =>
  state.wishlist.productIds;

export const selectCartCount = createSelector([selectCartItems], (items) =>
  items.reduce((count, item) => count + item.quantity, 0),
);

export const selectWishlistCount = createSelector(
  [selectWishlistIds],
  (productIds) => productIds.length,
);
