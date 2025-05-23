import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Компонент для защиты маршрутов, требующих авторизации.
 * В MVP всегда пропускает пользователя без проверки.
 */
const ProtectedRoute = () => {
  // Для MVP всегда считаем пользователя авторизованным
  // В будущем здесь будет реальная проверка авторизации
  return <Outlet />;
};

export default ProtectedRoute;
