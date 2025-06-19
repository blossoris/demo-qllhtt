import { Modal, Form, Input, Select, Typography } from 'antd';
import { useEffect } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Text } = Typography;

function CourseModal({ open, onCancel, onSave, course, courses = [] }) {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { isSubmitting }
  } = useForm({
    mode: 'all',
    defaultValues: {
      id: '',
      name: '',
      description: '',
      inviteCode: '',
      allowStudentJoin: true,
      status: 'active',
    },
  });

  const idValue = useWatch({ control, name: 'id' });

  // Tự tạo inviteCode từ id nếu đang thêm mới
  useEffect(() => {
    if (!course && idValue) {
      const currentYear = new Date().getFullYear();
      setValue('inviteCode', `${idValue}-${currentYear}`);
    }
  }, [idValue, course, setValue]);

  // Khi mở modal (thêm mới hoặc chỉnh sửa)
  useEffect(() => {
    if (course) {
      reset(course);
    } else {
      reset({
        id: '',
        name: '',
        description: '',
        inviteCode: '',
        allowStudentJoin: true,
        status: 'active',
      });
    }
  }, [course, reset]);

  const onSubmit = (data) => {
    const preparedData = {
      ...data,
      studentIds: course?.studentIds || [],
    };
    onSave(preparedData);
    reset();
  };

  return (
    <Modal
      title={course ? 'Chỉnh sửa môn học' : 'Thêm môn học mới'}
      open={open}
      onCancel={() => {
        reset();
        onCancel();
      }}
      onOk={handleSubmit(onSubmit)}
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={isSubmitting}
      width={700}
    >
      <Form layout="vertical">
        {/* Mã môn học */}
        <Form.Item label="Mã môn học">
          <Controller
            name="id"
            control={control}
            rules={{
              required: 'Vui lòng nhập mã môn học',
              validate: (value) => {
                if (!course && courses.some(c => c.id === value)) {
                  return 'Mã môn học đã tồn tại';
                }
                return true;
              }
            }}
            render={({ field, fieldState }) => (
              <>
                <Input {...field} placeholder="VD: MATH101" disabled={!!course} />
                {fieldState.error ? (
                  <Text type="danger">
                    {fieldState.error.message} <ExclamationCircleOutlined />
                  </Text>
                ) : fieldState.isTouched && field.value ? (
                  <Text type="success">Hợp lệ <CheckCircleOutlined /></Text>
                ) : null}
              </>
            )}
          />
        </Form.Item>

        {/* Tên môn học */}
        <Form.Item label="Tên môn học">
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Vui lòng nhập tên môn học' }}
            render={({ field, fieldState }) => (
              <>
                <Input {...field} placeholder="VD: Toán cao cấp" />
                {fieldState.error ? (
                  <Text type="danger">
                    {fieldState.error.message} <ExclamationCircleOutlined />
                  </Text>
                ) : fieldState.isTouched && field.value ? (
                  <Text type="success">Hợp lệ <CheckCircleOutlined /></Text>
                ) : null}
              </>
            )}
          />
        </Form.Item>

        {/* Mô tả môn học */}
        <Form.Item label="Mô tả môn học">
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Input.TextArea {...field} rows={4} placeholder="Mô tả ngắn gọn nội dung môn học" />
            )}
          />
        </Form.Item>

        {/* Mã lớp dành cho sinh viên đăng ký */}
        <Form.Item label="Mã lớp (cho sinh viên đăng ký)">
          <Controller
            name="inviteCode"
            control={control}
            rules={{ required: 'Vui lòng nhập mã lớp' }}
            render={({ field, fieldState }) => (
              <>
                <Input {...field} placeholder="VD: MATH101-2025" />
                {fieldState.error && (
                  <Text type="danger">
                    {fieldState.error.message} <ExclamationCircleOutlined />
                  </Text>
                )}
              </>
            )}
          />
        </Form.Item>

        {/* Cho phép sinh viên tự đăng ký */}
        <Form.Item label="Cho phép sinh viên tự ghi danh">
          <Controller
            name="allowStudentJoin"
            control={control}
            render={({ field }) => (
              <Select {...field}>
                <Option value={true}>Cho phép</Option>
                <Option value={false}>Không cho phép</Option>
              </Select>
            )}
          />
        </Form.Item>

        <Form.Item label="Trạng thái môn học">
          <Controller
            name="status"
            control={control}
            rules={{ required: 'Vui lòng chọn trạng thái môn học' }}
            render={({ field, fieldState }) => (
              <>
                <Select {...field}>
                  <Option value="active">Đã mở</Option>
                  <Option value="inactive">Đã đóng</Option>
                </Select>
                {fieldState.error && (
                  <Text type="danger">
                    {fieldState.error.message} <ExclamationCircleOutlined />
                  </Text>
                )}
              </>
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CourseModal;
