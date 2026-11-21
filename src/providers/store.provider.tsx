"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import {
  persistStore,
  type Persistor,
} from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import {
  replaceCartItems,
  type CartItem,
} from "@/store/cart-slice";
import { makeStore, type AppStore } from "@/store";
import { replaceWishlistItems } from "@/store/wishlist-slice";

function parseLegacyArray(key: "cart" | "wishlist"): unknown[] {
  let raw: string | null;
  try {
    raw = localStorage.getItem(key);
  } catch (error) {
    console.error(`Unable to read legacy ${key} data.`, error);
    return [];
  }
  if (!raw) return [];

  try {
    const value: unknown = JSON.parse(raw);
    if (Array.isArray(value)) return value;
    console.error(`Ignoring invalid legacy ${key} data: expected an array.`);
  } catch (error) {
    console.error(`Ignoring invalid legacy ${key} data.`, error);
  }

  return [];
}

function isCartItem(value: unknown): value is CartItem {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "quantity" in value &&
    typeof value.id === "string" &&
    typeof value.quantity === "number" &&
    Number.isSafeInteger(value.quantity) &&
    value.quantity > 0
  );
}

function loadLegacyShoppingState(store: AppStore) {
  try {
    if (localStorage.getItem("persist:commerce") !== null) return;
  } catch (error) {
    console.error("Unable to check persisted shopping state.", error);
    return;
  }

  const wishlistIds = [
    ...new Set(
      parseLegacyArray("wishlist").filter(
        (id): id is string => typeof id === "string",
      ),
    ),
  ];
  const cartItems = parseLegacyArray("cart").filter(isCartItem);

  store.dispatch(replaceWishlistItems(wishlistIds));
  store.dispatch(replaceCartItems(cartItems));
}

export default function StoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(makeStore);
  const [persistor, setPersistor] = useState<Persistor | null>(null);

  useEffect(() => {
    loadLegacyShoppingState(store);
    setPersistor(persistStore(store));
  }, [store]);

  return (
    <Provider store={store}>
      {persistor ? (
        <PersistGate loading={children} persistor={persistor}>
          {children}
        </PersistGate>
      ) : (
        children
      )}
    </Provider>
  );
}
