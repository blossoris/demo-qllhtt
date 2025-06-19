import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Form, Input, Button, Typography, Card, Divider } from 'antd'
import { UserOutlined, MailOutlined, KeyOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import '../../styles/Register.css'
import { useNavigate } from 'react-router-dom';
import {registerUser, fetchUsers} from '../../services/api'; 

import bcrypt from 'bcryptjs'

const { Title, Text } = Typography

const RegisterForm = () => {
    const navigate = useNavigate()
    const { handleSubmit, control } = useForm({
        mode: 'all',
    })

    const onSubmit = async (data) => {
        try {
            const users = await fetchUsers();

            // Kiểm tra xem email đã tồn tại chưa (không phân biệt hoa thường)
            const isEmailTaken = users.some(
                (user) => user.email.toLowerCase() === data.email.toLowerCase()
            );

            if (isEmailTaken) {
                alert('Email đã được sử dụng. Vui lòng chọn email khác.');
                return;
            }
            // Mã hóa mật khẩu trước khi gửi lên server
            const hashedPassword = bcrypt.hashSync(data.password, 10)
            const newUser = {
                fullname: data.fullname,
                email: data.email,
                password: hashedPassword,
                role: 'student'
            }

            // Gửi dữ liệu đăng ký lên server
            await registerUser(newUser);

            // Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
            navigate('/login')
        } catch (error) {
            console.error('Lỗi khi đăng ký:', error)
        }
    }

    return (
        <main className='register-page'>
            <div className='register-con'>
                <Title level={1} className='title'>Đăng ký</Title>

            <Divider orientation="center" plain>Vui lòng điền thông tin cá nhân để đăng ký</Divider>

            <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className='form-container' size='large'>
                <Form.Item>
                    <Controller
                    name="fullname"
                    control={control}
                    rules={{ required: 'Vui lòng nhập họ và tên' }}
                    render={({ field, fieldState }) => (
                        <>
                        <Input
                            {...field}
                            placeholder="Họ và tên"
                            size='large'
                            prefix={<UserOutlined />}
                        />
                        {fieldState.error ? (
                            <Text type="danger">{fieldState.error.message} <ExclamationCircleOutlined /></Text>
                        ) : fieldState.isTouched && field.value ? (
                            <Text type="success">Hợp lệ <CheckCircleOutlined /></Text>
                        ) : null}
                        </>
                    )}
                    />
                </Form.Item>

                <Form.Item>
                    <Controller
                    name="email"
                    control={control}
                    rules={{ required: 'Vui lòng nhập email',
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: 'Email không hợp lệ'
                        } 
                    }}
                    render={({ field, fieldState }) => (
                        <>
                        <Input
                            {...field}
                            placeholder="Email"
                            type="text"
                            size='large'
                            prefix={<MailOutlined />}
                        />
                        {fieldState.error ? (
                            <Text type="danger">{fieldState.error.message} <ExclamationCircleOutlined /></Text>
                        ) : fieldState.isTouched && field.value ? (
                            <Text type="success">Hợp lệ <CheckCircleOutlined /></Text>
                        ) : null}
                        </>
                    )}
                    />
                </Form.Item>

                <Form.Item>
                    <Controller
                    name="password"
                    control={control}
                    rules={{ required: 'Vui lòng nhập mật khẩu',
                        minLength: {
                            value: 6,
                            message: 'Mật khẩu phải có ít nhất 6 ký tự'
                        },
                        validate: (value) => {
                            // Kiểm tra mật khẩu có chứa chữ hoa, chữ thường, số và ký tự đặc biệt
                            const hasUpperCase = /[A-Z]/.test(value);
                            const hasLowerCase = /[a-z]/.test(value);
                            const hasNumber = /\d/.test(value);
                            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
                            
                            if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
                                return 'Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt';
                            }
                            return true;
                        }
                     }}
                    render={({ field, fieldState }) => (
                        <>
                        <Input.Password
                            {...field}
                            placeholder="Mật khẩu"
                            size='large'
                            prefix={<KeyOutlined />}
                        />
                        {fieldState.error ? (
                            <Text type="danger">{fieldState.error.message} <ExclamationCircleOutlined /></Text>
                        ) : fieldState.isTouched && field.value ? (
                            <Text type="success">Hợp lệ <CheckCircleOutlined /></Text>
                        ) : null}
                        </>
                    )}
                    />
                </Form.Item>
                <Form.Item>
                    <Controller
                    name="confirmPassword"
                    control={control}
                    rules={{
                        required: 'Vui lòng xác nhận mật khẩu',
                        validate: (value, formValues) => value === formValues.password || 'Mật khẩu không khớp'
                    }}
                    render={({ field, fieldState }) => (
                        <>
                        <Input.Password
                            {...field}
                            placeholder="Xác nhận mật khẩu"
                            size='large'
                            prefix={<KeyOutlined />}
                        />
                        {fieldState.error ? (
                            <Text type="danger">{fieldState.error.message} <ExclamationCircleOutlined /></Text>
                        ) : fieldState.isTouched && field.onChange ? (
                            <Text type="success">Hợp lệ <CheckCircleOutlined /></Text>
                        ) : null}
                        </>
                    )}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                    Đăng ký
                    </Button>
                </Form.Item>
            </Form>

            <Divider orientation="center" plain style={{ fontSize: 16 }}>
                Đã có tài khoản?{' '}
                <Button type="link" onClick={() => navigate('/Login')}>
                    Đăng nhập
                </Button>
            </Divider>
        </div>
    </main>
  )
}

export default RegisterForm

