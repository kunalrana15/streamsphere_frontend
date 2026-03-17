import { useState, useEffect } from 'react';
import { billingAPI } from '../api/billing.api';

export const useBillingData = () => {
  const [stats, setStats] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [summaryData, customerData] = await Promise.all([
        billingAPI.getSummary(),
        billingAPI.getCustomers()
      ]);
      setStats(summaryData);
      setCustomers(customerData);
    } catch (err) {
      console.error("Billing Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAllData(); }, []);

  return { stats, customers, loading, refresh: loadAllData };
};