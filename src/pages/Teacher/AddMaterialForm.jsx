import { Modal, Button, Form, Input, Select, Upload, message, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Controller, useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/useAuth';
import { addMaterial } from '../../services/api';
import { uploadFileToCloudinary } from '../../services/cloudinary';
import { useState } from 'react';

const { Option } = Select;

export default function AddMaterialForm({ visible, onClose, courseId, onSuccess }) {
  const { currentUser } = useAuth();
  const { control, handleSubmit, watch, reset } = useForm();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); //// lưu tạm file được chọn

  const type = watch('type'); // lấy giá trị real-time của trường "type"

  const handleFinish = async (data) => {
    try {
      setUploading(true);
      let fileUrl = data.url;

      if (type !== 'link' && selectedFile) {
        // Chỉ upload nếu là file
        fileUrl = await uploadFileToCloudinary(selectedFile);
      }

      const material = {
        courseId,
        title: data.title,
        type: data.type,
        url: fileUrl,
        uploadedBy: currentUser?.id || 'unknown',
        createdAt: new Date().toISOString(),
      };

      await addMaterial(material);
      message.success('Tài liệu đã được thêm');
      reset();
      setSelectedFile(null);
      onSuccess?.(); ////Gọi lại callback nếu có truyền
      onClose();
    } catch (err) {
      console.error(err);
      message.error('Lỗi khi lưu tài liệu');
    } finally {
      setUploading(false);
    }
  };

  const beforeUpload = (file) => {
    setSelectedFile(file);
    message.info(`Đã chọn file: ${file.name}`);
    return false; // Ngăn Upload tự động
  };

  return (
    <Modal
      open={visible}
      onCancel={() => {
        reset();
        setSelectedFile(null);
        onClose();
      }}
      title="Thêm tài liệu mới"
      footer={null}
      destroyOnHidden
    >
      <Form layout="vertical" onFinish={handleSubmit(handleFinish)}>
        <Form.Item label="Tiêu đề tài liệu">
          <Controller
            name="title"
            control={control}
            defaultValue=""
            rules={{ required: 'Vui lòng nhập tiêu đề' }}
            render={({ field }) => <Input {...field} placeholder="VD: Tài liệu HTML" />}
          />
        </Form.Item>

        <Form.Item label="Loại tài liệu">
          <Controller
            name="type"
            control={control}
            defaultValue="pdf"
            render={({ field }) => (
              <Select {...field}>
                <Option value="pdf">PDF</Option>
                <Option value="video">Video</Option>
                <Option value="link">Link</Option>
              </Select>
            )}
          />
        </Form.Item>

        {type === 'link' ? (
          <Form.Item label="URL liên kết">
            <Controller
              name="url"
              control={control}
              defaultValue=""
              rules={{ required: 'Vui lòng nhập URL' }}
              render={({ field }) => <Input {...field} placeholder="https://..." />}
            />
          </Form.Item>
        ) : (
          <Form.Item label="Chọn file (PDF hoặc Video)">
            <Upload
              beforeUpload={beforeUpload}
              showUploadList={selectedFile ? [{ name: selectedFile.name }] : false}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Chọn file</Button>
            </Upload>
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={uploading}>
            {uploading ? 'Đang tải lên...' : 'Lưu tài liệu'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
