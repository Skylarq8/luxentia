export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type User = {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  role: "customer" | "admin";
  password_hash: string | null;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  images: string[];
  stock: number;
  metadata: Record<string, Json>;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  image_url: string | null;
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
};

export type Order = {
  id: string;
  user_id: string;
  items: CartItem[];
  total: number;
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
  shipping_address: Record<string, Json>;
  created_at: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  recommendedProducts?: Product[];
  createdAt?: string;
};

export type ChatSession = {
  id: string;
  user_id: string | null;
  messages: ChatMessage[];
  context: Record<string, Json>;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Partial<User> & Pick<User, "phone">;
        Update: Partial<User>;
        Relationships: [];
      };
      products: {
        Row: Product;
        Insert: Omit<Product, "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Product>;
        Relationships: [];
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, "id"> & { id?: string };
        Update: Partial<Category>;
        Relationships: [];
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, "id" | "created_at" | "status"> & { id?: string; status?: Order["status"] };
        Update: Partial<Order>;
        Relationships: [];
      };
      cart: {
        Row: { id: string; user_id: string; items: CartItem[]; updated_at: string };
        Insert: { user_id: string; items?: CartItem[] };
        Update: { items?: CartItem[]; updated_at?: string };
        Relationships: [];
      };
      chat_sessions: {
        Row: ChatSession;
        Insert: Omit<ChatSession, "id" | "created_at"> & { id?: string };
        Update: Partial<ChatSession>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      search_products: {
        Args: { search_term: string; max_results?: number };
        Returns: Product[];
      };
      get_user_by_phone_for_auth: {
        Args: { input_phone: string };
        Returns: Array<User>;
      };
      create_password_user: {
        Args: { input_phone: string; input_name: string; input_password_hash: string };
        Returns: User;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
