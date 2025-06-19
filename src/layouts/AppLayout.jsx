import { Layout } from 'antd';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import AppSider from '../components/AppSider';
import AppContent from '../components/AppContent';
import { useState } from 'react';
import '../styles/AppLayout.css'
const { Content } = Layout;

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppSider collapsed={collapsed} onCollapse={setCollapsed}/>

      <Layout>
        <AppHeader />

        <AppContent>{children}</AppContent>

        <AppFooter />
      </Layout>
    </Layout>
  );
};
export default AppLayout;


