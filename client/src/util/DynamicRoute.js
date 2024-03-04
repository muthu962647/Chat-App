import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../pages/context/auth';

export default function DynamicRoute({ component: Component, authenticated, guest, ...rest }) {
  const { user } = useAuth();

  if (authenticated && !user) {
    return <Navigate to="/login" replace />;
  } else if (guest && user) {
    return <Navigate to="/" replace />;
  } else {
    return <Route {...rest} element={<Component />} />;
  }
}
