// ── Mirrors BillingCustomer model ─────────────────────────
export type CustomerStatus = "inactive" | "active" | "past_due" | "canceled";

export interface IBillingCustomer {
  _id: string;
  userId?: string;
  email: string;
  stripeCustomerId: string;
  defaultPaymentMethod: string;
  status: CustomerStatus;
  createdAt: string;
  updatedAt: string;
}

// ── Mirrors Plan model ─────────────────────────────────────
export interface IPlan {
  _id: string;
  priceId: string;        // Stripe price_xxx
  name?: string;
  amount?: string;        // stored as string in your model
  currency?: string;
  interval?: string;      // "month" | "year"
  createdAt: string;
  updatedAt: string;
}

// ── Mirrors BillingSubscription model ─────────────────────
export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "incomplete"
  | "incomplete_expired"
  | "paused";

export interface IBillingSubscription {
  _id: string;
  customerId: string | IBillingCustomer;
  stripeSubscriptionId: string;
  planId: string | IPlan;
  status?: SubscriptionStatus;
  cancelAtPeriodEnd?: boolean;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  quantity?: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// ── Mirrors BillingInvoice model ───────────────────────────
// Stripe invoice statuses
export type InvoiceStatus = "draft" | "open" | "paid" | "uncollectible" | "void";

export interface IBillingInvoice {
  _id: string;
  stripeInvoiceId: string;
  customerId: string | IBillingCustomer;
  subscriptionId: string | IBillingSubscription;
  amountDue?: number;     // cents
  amountPaid?: number;    // cents
  status?: InvoiceStatus;
  hostedInvoiceUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Mirrors WebhookEvent model ─────────────────────────────
export interface IWebhookEvent {
  _id: string;
  stripeEventId: string;
  type: string;
  payload: Record<string, unknown>;
  processed: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── API shapes ─────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface BillingMetrics {
  mrr: number;
  arr: number;
  totalRevenue: number;
  pendingRevenue: number;
  totalCustomers: number;
  activeCustomers: number;
  pastDueCustomers: number;
  canceledCustomers: number;
  activeSubscriptions: number;
  canceledSubscriptions: number;
  mrrGrowth?: number;
  revenueGrowth?: number;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  invoiceCount: number;
}

export interface InvoiceFilters {
  status?: InvoiceStatus | "all";
  search?: string;       // searches customer email
  page?: number;
  pageSize?: number;
}

export interface SubscriptionFilters {
  status?: SubscriptionStatus | "all";
  page?: number;
  pageSize?: number;
}

// Populated shapes — what the UI renders after .populate()
export interface PopulatedInvoice extends Omit<IBillingInvoice, "customerId" | "subscriptionId"> {
  customerId: IBillingCustomer;
  subscriptionId: IBillingSubscription & { planId: IPlan };
}

export interface PopulatedSubscription extends Omit<IBillingSubscription, "customerId" | "planId"> {
  customerId: IBillingCustomer;
  planId: IPlan;
}