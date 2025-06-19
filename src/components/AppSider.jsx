import { Layout, Menu } from 'antd';
import { BookOutlined, UploadOutlined, OrderedListOutlined, UserOutlined, LoginOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import { useAuth } from '../contexts/useAuth';

const { Sider } = Layout;

function AppSider() {
  const [collapsed, setCollapsed] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const role = currentUser?.role || 'student';

  const handleLogout = () => {
    logout(() => navigate('/'));
  };



  const location = useLocation();

  const selectedKey = (() => {
    const path = location.pathname;

    if (path.startsWith('/student/course')) return '2';
    if (path.startsWith('/student')) return '1';
    if (path.startsWith('/teacher')) return '3';
    if (path.startsWith('/courses/')) return role === 'teacher' ? '3' : '2'; 
    if (path === '/profile') return '4';

    return '';
  })();

  const menuItems = [
    ...(role === 'student'
      ? [
          {
            key: '1',
            icon: <OrderedListOutlined />,
            label: <Link to="/student">Danh sách môn học</Link>,
          },
          {
            key: '2',
            icon: <BookOutlined/>,
            label: <Link to="/student/course">Môn học của tôi</Link>,
          },
        ]
      : [
          {
            key: '3',
            icon: <AppstoreAddOutlined />,
            label: <Link to="/teacher">Quản lý môn học</Link>,
          }
        ]),
    {
      type: 'divider',
    },
    {
      key: '4',
      icon: <UserOutlined />,
      label: <Link to="/profile">Thông tin cá nhân</Link>,
    },
    {
      key: '5',
      icon: <LoginOutlined />,
      label: (
        <span onClick={handleLogout} style={{ cursor: 'pointer' }}>
          Đăng xuất
        </span>
      ),
    },
  ];

  return (
    <Sider collapsible
      collapsed={collapsed}
      onCollapse={value => setCollapsed(value)}>
      <div style={{ padding: '16px', fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>
        {!collapsed ? 'Quản Lý Lớp Học' : '📚'}
      </div>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        theme="dark"
        items={menuItems} 
      />
    </Sider>
  );
}

export default AppSider;
