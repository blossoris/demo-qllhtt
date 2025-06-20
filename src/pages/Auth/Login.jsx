import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Input, Button, Typography, Divider, Flex } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import bcrypt from 'bcryptjs';
import {fetchUsers} from '../../services/api'; 
import '../../styles/Login.css';
import { useNavigate } from 'react-router-dom';
import {useAuth} from '../../contexts/useAuth';

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm();
  const {login} = useAuth();

  const onSubmit = async (data) => {
    try {
      const users = await fetchUsers(); // Gọi API

      const matchedUser = users.find((user) => user.email === data.email && bcrypt.compareSync(data.password, user.password));
      if( matchedUser ) {
        console.log('Đăng nhập thành công:', matchedUser);
        login(matchedUser); //Lưu thông tin người dùng vào AuthContext
        navigate(matchedUser.role === 'student' ? '/student' : '/teacher');

      } else {
        console.error('Email hoặc mật khẩu không đúng');
        alert('Email hoặc mật khẩu không đúng');
      }

    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
    }
  };

  return (
    <main className="login-page">

      <Flex wrap="wrap" justify="center" align="center" gap="middle" style={{ minHeight: '100vh' }}>
        <div className="login-container">
          <Title level={1} className="title">Đăng nhập</Title>

          <form onSubmit={handleSubmit(onSubmit)} className="input-container">
            {/* Email */}
            <Controller
              name="email"
              control={control}
              rules={{ required: 'Vui lòng nhập email' }}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    size="middle"
                    prefix={<MailOutlined />}
                    placeholder="Email"
                    className="inputemail"
                    type='email'
                  />
                  {fieldState.error && (
                    <Text type="danger">{fieldState.error.message}</Text>
                  )}
                </>
              )}
            />

            {/* Password */}
            <Controller
              name="password"
              control={control}
              rules={{ required: 'Vui lòng nhập mật khẩu' }}
              render={({ field, fieldState }) => (
                <>
                  <Input.Password
                    {...field}
                    size="middle"
                    prefix={<LockOutlined />}
                    placeholder="Mật khẩu"
                    className="inputpassword"
                  />
                  {fieldState.error && (
                    <Text type="danger">{fieldState.error.message}</Text>
                  )}
                </>
              )}
            />

            <div className="fp-container">
              <Button
                className="forgot-password"
                type="link"
                onClick={() => console.log("Forgot Password clicked")}
              >
                Quên mật khẩu?
              </Button>
            </div>

            <Button
              className="login-button"
              type="primary"
              size="large"
              htmlType="submit"
            >
              Đăng nhập
            </Button>
          </form>

          <Divider />

          <div className="register-container">
            <Text className="register-text" type="secondary">Bạn chưa có tài khoản? </Text>
            <Button
              className="register-button"
              type="link"
              onClick={() => navigate('/register')}
            >
              Đăng ký
            </Button>
          </div>
        </div>
      </Flex>
    </main>
  );
};

export default Login;
