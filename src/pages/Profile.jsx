import React from 'react';
import { Card, Typography, Tag, Space, Divider, Spin, Avatar } from 'antd';
import { UserOutlined, MailOutlined, SolutionOutlined, PhoneOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/useAuth';

const { Title, Text } = Typography;

export default function Profile() {
  const { currentUser, loading } = useAuth();

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spin size="large" tip="Đang tải thông tin..." />
    </div>
  );

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        title={
          <Space>
            <SolutionOutlined />
            <span>Thông tin cá nhân</span>
          </Space>
        } 
        style={{ 
          maxWidth: 800, 
          margin: '0 auto',
          borderRadius: '8px',
        }}
        headStyle={{
          fontSize: '18px',
          fontWeight: 'bold',
          borderBottom: '1px solid #f0f0f0'
        }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Space size="large" align="start">
            <Avatar 
              size={128} 
              icon={<UserOutlined />} 
              style={{ 
                backgroundColor: currentUser.role === 'teacher' ? '#1890ff' : '#52c41a',
                fontSize: '48px'
              }} 
            />
            
            <Space direction="vertical" size="small">
              <Title level={3} style={{ marginBottom: 0 }}>{currentUser.fullname}</Title>
              
              <Space>
                <Tag 
                  color={currentUser.role === 'teacher' ? 'blue' : 'green'} 
                  style={{ 
                    fontSize: '14px',
                    padding: '4px 12px',
                    borderRadius: '12px'
                  }}
                >
                  {currentUser.role === 'teacher' ? 'Giảng viên' : 'Sinh viên'}
                </Tag>
              </Space>
              
              <Divider style={{ margin: '12px 0' }} />
              
              <Space direction="vertical" size="small">
                <Space>
                  <MailOutlined style={{ color: '#666' }} />
                  <Text strong>Email:</Text>
                  <Text>{currentUser.email}</Text>
                </Space>
                
              </Space>
            </Space>
          </Space>
        </Space>
      </Card>
    </div>
  );
}