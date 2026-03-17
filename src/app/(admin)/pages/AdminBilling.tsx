import React, { useState } from 'react';
import { useBillingData } from '../hooks/useBillingData';
import StatsGrid from '../components/admin/billing/StatsGrid';
import CustomerTable from '../components/admin/billing/CustomerTable';
import WebhookLog from '../components/admin/billing/WebhookLog';

const AdminBilling = () => {
  const { stats, customers, loading, refresh } = useBillingData();
  const [activeTab, setActiveTab] = useState('customers');

  if (loading) return <div className="p-10 text-center text-slate-500">Initializing Dashboard...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Billing Control Center</h1>
        <p className="text-slate-500">Manage subscriptions, revenue, and payment events.</p>
      </header>

      {/* 1. Summary Cards Always Visible at Top */}
      <StatsGrid stats={stats} />

      {/* 2. Navigation Tabs */}
      <div className="flex space-x-4 mb-6 mt-8 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('customers')}
          className={`pb-3 px-2 ${activeTab === 'customers' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-400'}`}
        >
          Customers & Subscriptions
        </button>
        <button 
          onClick={() => setActiveTab('webhooks')}
          className={`pb-3 px-2 ${activeTab === 'webhooks' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-400'}`}
        >
          Webhook Activity
        </button>
      </div>

      {/* 3. Dynamic Table Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {activeTab === 'customers' ? (
          <CustomerTable data={customers} />
        ) : (
          <WebhookLog />
        )}
      </div>
    </div>
  );
};