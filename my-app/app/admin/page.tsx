'use client';
import React, { useState } from 'react';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);


  return <AdminDashboard />;
}


