import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<string>) {
      const item = state.items.find(({ id }) => id === action.payload);
      if (item) item.quantity += 1;
      else state.items.push({ id: action.payload, quantity: 1 });
    },
    addToCartWithQuantity(
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) {
      const { id, quantity } = action.payload;
      if (!Number.isSafeInteger(quantity) || quantity < 1) return;

      const item = state.items.find((cartItem) => cartItem.id === id);
      if (item) item.quantity += quantity;
      else state.items.push({ id, quantity });
    },
    setCartItemQuantity(
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) {
      const { id, quantity } = action.payload;
      if (!Number.isSafeInteger(quantity) || quantity < 1) {
        state.items = state.items.filter((item) => item.id !== id);
        return;
      }

      const item = state.items.find((cartItem) => cartItem.id === id);
      if (item) item.quantity = quantity;
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter(({ id }) => id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
    replaceCartItems(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
  },
});

export const {
  addToCart,
  addToCartWithQuantity,
  setCartItemQuantity,
  removeFromCart,
  clearCart,
  replaceCartItems,
} = cartSlice.actions;
export default cartSlice.reducer;
