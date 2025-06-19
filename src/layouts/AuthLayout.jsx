import React from 'react';
import { Divider, Layout } from 'antd';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';

const { Content } = Layout;

const AuthLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      
      <Layout>
        <Content style={{ padding: '24px', background: '#fff' }}>
          {children}
        </Content>
      </Layout>


      <AppFooter />
    </Layout>
  );
};

export default AuthLayout;