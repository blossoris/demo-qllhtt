import { Layout, Dropdown, Badge } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/useAuth';
import {fetchNotifications} from '../services/api'; // Adjust the import based on your API structure
const { Header } = Layout;

function AppHeader() {
  const { currentUser, loading } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const getNotifications = async () => {
      const data = await fetchNotifications();
      setNotifications(data);
    };
    getNotifications();
  }, []);

  if (loading) return null;
  if (['/login', '/register'].includes(location.pathname.toLowerCase())) {
    return null;
  }
  const notificationMenu = notifications.map((noti) => ({
    key: noti.id,
    label: (
      <div>
        <strong>{noti.title}</strong>
        <p style={{ margin: 0 }}>{noti.content}</p>
      </div>
    )
  }))
  return (
    <Header className='header-layout'>
      <div style={{ padding: '0 24px', color: 'white', width: '100%', textAlign: 'right' }}>
        {currentUser ? (
          <>
            <span style={{ marginLeft: 12 }}>Xin chào, {currentUser.fullname} </span>
            <Dropdown menu={{ items: notificationMenu }} trigger={['click']} style={{margin: '5px'}}>
              <Badge count={notifications.length} style={{ marginLeft: 24, marginTop: 20 }}>
                <BellOutlined style={{ fontSize: '18px', cursor: 'pointer', color: 'white', marginTop: 20 }} />
              </Badge>
            </Dropdown>
          </>
        ) : null}
      </div>
    </Header>
  );
}

export default AppHeader;
