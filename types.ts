import Stripe from 'stripe';
import { Json } from 'types_db';
export interface PageMeta {
  title: string;
  description: string;
  cardImage: string;
}

export interface Customer {
  id: string /* primary key */;
  stripe_customer_id?: string;
}

export interface Product {
  id: string /* primary key */;
  active?: boolean;
  name?: string;
  description?: string;
  image?: string;
  metadata?: Stripe.Metadata;
}

export interface ProductWithPrice extends Product {
  prices?: Price[];
}

export interface UserDetails {
  id: string /* primary key */;
  full_name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  api_key?: string | null;
  discord?: string | null;
  teams?: string | null;
  billing_address?: Stripe.Address | null;
  payment_method?: Stripe.PaymentMethod[Stripe.PaymentMethod.Type] | null;
  init: boolean;
}

export interface Approval {
  ID: string /* primary key */;
  content: string | null;
  video: string | null;
  image: string | null;
  loop_id: string | null;
  approved: boolean | null;
  created_at: string | null;
  user_id: string;
  type: string | null;
  prompts: string | null;
}

export interface ApprovalData {
  ID: string /* primary key */;
  content: string | null;
  video: string | null;
  image: string | null;
  process_id: string | null;
  approved: boolean | null;
  name: string | null;
  prompt: string | null;
  created_at: string;
  declineHook: string | null;
  type: string | null;
}

export interface Price {
  id: string /* primary key */;
  product_id?: string /* foreign key to products.id */;
  active?: boolean;
  description?: string;
  unit_amount?: number;
  currency?: string;
  type?: Stripe.Price.Type;
  interval?: Stripe.Price.Recurring.Interval;
  interval_count?: number;
  trial_period_days?: number | null;
  metadata?: Stripe.Metadata;
  products?: Product;
}

export interface PriceWithProduct extends Price {}

export interface Subscription {
  id: string /* primary key */;
  user_id: string;
  status?: Stripe.Subscription.Status;
  metadata?: Stripe.Metadata;
  price_id?: string /* foreign key to prices.id */;
  quantity?: number;
  cancel_at_period_end?: boolean;
  created: string;
  current_period_start: string;
  current_period_end: string;
  ended_at?: string;
  cancel_at?: string;
  canceled_at?: string;
  trial_start?: string;
  trial_end?: string;
  prices?: Price;
}

export interface Loop {
  ident: string;
  created_at: string;
  name: string;
  user_id: string;
  tool: string;
  type: string;
  description: string;
  acceptHook: string;
  declineHook: string;
}
