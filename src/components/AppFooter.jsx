import { Layout, Typography, Divider, Space } from 'antd';
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeOutlined
} from '@ant-design/icons';

const { Footer } = Layout;
const { Text, Link } = Typography;

function AppFooter() {
  return (
    <Footer style={{ textAlign: 'center'}}>
      © 2025 Hệ thống Quản lý Lớp học Trực tuyến.
    </Footer>
  );
}

export default AppFooter;