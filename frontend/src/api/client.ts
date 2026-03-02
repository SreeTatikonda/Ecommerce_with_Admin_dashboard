import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default api;

// Types
export interface Category { id: number; name: string; slug: string; }
export interface Product {
  id: number; name: string; slug: string; description?: string;
  priceCents: number; stock: number;
  category: Category;
}
export interface CartItem {
  productId: number; name: string;
  unitPriceCents: number; quantity: number; lineTotalCents: number;
}
export interface Cart { items: CartItem[]; totalCents: number; itemCount: number; }
export interface Order {
  id: number; createdUtc: string; status: number;
  subtotalCents: number; taxCents: number; shippingCents: number;
  discountCents: number; totalCents: number; itemCount?: number;
  shippingName?: string; shippingAddress1?: string; shippingCity?: string;
  shippingState?: string; shippingPostalCode?: string;
  items?: { productName: string; unitPriceCents: number; quantity: number; lineTotalCents: number }[];
  payment?: { status: number; provider: string; providerReference: string } | null;
}
export interface AuthUser { isAuthenticated: boolean; email?: string; isAdmin?: boolean; }

// Auth
export const getMe = () => api.get<AuthUser>("/auth/me").then(r => r.data);
export const login = (email: string, password: string) =>
  api.post("/auth/login", { email, password }).then(r => r.data);
export const register = (email: string, password: string) =>
  api.post("/auth/register", { email, password }).then(r => r.data);
export const logout = () => api.post("/auth/logout");

// Store
export const getCategories = () => api.get<Category[]>("/categories").then(r => r.data);
export const getProducts = (category?: string) =>
  api.get<Product[]>("/products", { params: category ? { category } : {} }).then(r => r.data);
export const getProduct = (id: number) => api.get<Product>(`/products/${id}`).then(r => r.data);

// Cart
export const getCart = () => api.get<Cart>("/cart").then(r => r.data);
export const addToCart = (productId: number, qty = 1) =>
  api.post("/cart/add", { productId, qty });
export const removeFromCart = (productId: number) =>
  api.post("/cart/remove", { productId });
export const updateQty = (productId: number, qty: number) =>
  api.post("/cart/updateqty", { productId, qty });

// Orders
export const getOrders = () => api.get<Order[]>("/orders").then(r => r.data);
export const getOrder = (id: number) => api.get<Order>(`/orders/${id}`).then(r => r.data);

// Checkout
export interface CheckoutPayload {
  shippingName: string; shippingAddress1: string; shippingCity: string;
  shippingState: string; shippingPostalCode: string; couponCode?: string;
}
export const placeOrder = (payload: CheckoutPayload) =>
  api.post<{ orderId: number }>("/checkout/placeorder", payload).then(r => r.data);
export const payOrder = (id: number) =>
  api.post(`/checkout/pay/${id}`).then(r => r.data);

// Admin
export const adminDashboard = () => api.get("/admin/dashboard").then(r => r.data);
export const adminProducts = () => api.get<Product[]>("/admin/products").then(r => r.data);
export const adminCreateProduct = (data: object) => api.post("/admin/products", data);
export const adminUpdateProduct = (id: number, data: object) => api.put(`/admin/products/${id}`, data);
export const adminDeleteProduct = (id: number) => api.delete(`/admin/products/${id}`);
export const adminCategories = () => api.get<Category[]>("/admin/categories").then(r => r.data);
export const adminCreateCategory = (data: object) => api.post("/admin/categories", data);
export const adminUpdateCategory = (id: number, data: object) => api.put(`/admin/categories/${id}`, data);
export const adminDeleteCategory = (id: number) => api.delete(`/admin/categories/${id}`);
export const adminOrders = () => api.get<Order[]>("/admin/orders").then(r => r.data);
export const adminOrder = (id: number) => api.get<Order>(`/admin/orders/${id}`).then(r => r.data);
export const adminUpdateOrderStatus = (id: number, status: number) =>
  api.post(`/admin/orders/${id}/status`, { status });
