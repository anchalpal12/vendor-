import React, { createContext, useState, useEffect } from 'react';
import { initialVendors, initialProducts, initialPOs, initialInvoices, initialPayments, initialShipments } from '../data/mockData';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Auth state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null; // { role: 'Admin' | 'Vendor', vendorId?: string }
  });

  // Data states
  const [vendors, setVendors] = useState(() => {
    const saved = localStorage.getItem('vendors');
    return saved ? JSON.parse(saved) : initialVendors;
  });
  
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [pos, setPos] = useState(() => {
    const saved = localStorage.getItem('pos');
    return saved ? JSON.parse(saved) : initialPOs;
  });

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('invoices');
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('payments');
    return saved ? JSON.parse(saved) : initialPayments;
  });

  const [shipments, setShipments] = useState(() => {
    const saved = localStorage.getItem('shipments');
    return saved ? JSON.parse(saved) : initialShipments;
  });

  // Sync to localStorage
  useEffect(() => { localStorage.setItem('user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('vendors', JSON.stringify(vendors)); }, [vendors]);
  useEffect(() => { localStorage.setItem('products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('pos', JSON.stringify(pos)); }, [pos]);
  useEffect(() => { localStorage.setItem('invoices', JSON.stringify(invoices)); }, [invoices]);
  useEffect(() => { localStorage.setItem('payments', JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem('shipments', JSON.stringify(shipments)); }, [shipments]);

  const login = (role, vendorId = null) => {
    setUser({ role, vendorId });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AppContext.Provider value={{
      user, login, logout,
      vendors, setVendors,
      products, setProducts,
      pos, setPos,
      invoices, setInvoices,
      payments, setPayments,
      shipments, setShipments
    }}>
      {children}
    </AppContext.Provider>
  );
};
