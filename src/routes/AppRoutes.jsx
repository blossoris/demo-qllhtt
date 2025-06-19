import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import AuthLayout from '../layouts/AuthLayout';
// Auth pages
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';

import CourseDetailPage from '../pages/CourseDetailPage';

// Student pages
import CoursesPage from '../pages/Student/CoursesPage';
import MyCourses from '../pages/Student/MyCourses';
// Teacher pages
import ManageCourses from '../pages/Teacher/ManageCourses';

import HomeRedirect from './HomeRedirect';
import Profile from '../pages/Profile';

const AppRoutes = () => {
  // Higher-order component để bọc các trang với AppLayout
  const withLayout = (Component) => <AppLayout><Component /></AppLayout>;
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomeRedirect />} />

      {/* Auth routes */}
      <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
      <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />

      <Route path="/courses/:id" element={withLayout(CourseDetailPage)} />
      <Route path="/profile" element={withLayout(Profile)}/>
      
      {/* Student routes */}
      <Route path="/student" element={withLayout(CoursesPage)} />
      <Route path="student/course" element={withLayout(MyCourses)}/>
      {/* Teacher routes */}
      <Route path="/teacher" element={withLayout(ManageCourses)} />
      
    </Routes>
  );
};

export default AppRoutes;