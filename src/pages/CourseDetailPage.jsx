import { useEffect, useState } from 'react';
import {
  Card, Tabs, List, Typography, Button, Row, Col, Tag, Popconfirm, message, Modal, Form, Input, Select, Dropdown 
} from 'antd';
import {
  FilePdfOutlined, VideoCameraOutlined, LinkOutlined, BookOutlined,
  UserOutlined, DeleteOutlined, EditOutlined, MoreOutlined, EyeOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCourseById, fetchMaterialsByCourseId, fetchAssignmentsByCourseId,
  fetchNotificationsByCourseId, deleteMaterial, updateMaterial, updateCourse } from '../services/api';
import { useAuth } from '../contexts/useAuth';
import AddMaterialForm from './Teacher/AddMaterialForm';

const { Title, Text } = Typography;
const { Option } = Select;

function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const { currentUser, loading } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && currentUser) {
      const loadData = async () => {
        try {
          setCourse(await fetchCourseById(id));
          setMaterials(await fetchMaterialsByCourseId(id));
          setAssignments(await fetchAssignmentsByCourseId(id));
          setNotifications(await fetchNotificationsByCourseId(id));
        } catch (error) {
          console.error("Lỗi load dữ liệu:", error);
          message.error("Lỗi load dữ liệu");
        }
      };
      loadData();
    }
  }, [id, loading, currentUser]);

  const getMaterialIcon = (type) => {
    switch (type) {
      case 'pdf': return <FilePdfOutlined />;
      case 'video': return <VideoCameraOutlined />;
      case 'link': return <LinkOutlined />;
      default: return <BookOutlined />;
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    try {
      await deleteMaterial(materialId);
      const updated = await fetchMaterialsByCourseId(id);
      setMaterials(updated);
      message.success("Xóa tài liệu thành công!");
    } catch (error) {
      console.error("Lỗi xóa tài liệu:", error);
      message.error("Xóa tài liệu thất bại!");
    }
  };

  const handleEditMaterial = (material) => {
    setEditingMaterial(material); //Gán tài liệu đang sửa
    form.setFieldsValue(material); //// đổ dữ liệu vào form
  };

  const handleUpdateMaterial = async () => {
    try {
      const values = await form.validateFields();
      await updateMaterial(editingMaterial.id, {
        ...editingMaterial,
        ...values,
        createdAt: editingMaterial.createdAt || new Date().toISOString(),
      });

      const updated = await fetchMaterialsByCourseId(id);
      setMaterials(updated);
      message.success("Cập nhật tài liệu thành công!");
      setEditingMaterial(null);
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      message.error("Cập nhật thất bại!");
    }
  };

  if (!course) return <div>Loading...</div>;

  const handleUnenroll = async () => {
    try {
      const updatedStudentIds = course.studentIds.filter(id => id !== currentUser.id);
      await updateCourse(course.id, { studentIds: updatedStudentIds });

      message.success("Bạn đã hủy đăng ký môn học thành công!");
      navigate(-1);
    } catch (error) {
      console.error("Lỗi khi hủy đăng ký:", error);
      message.error("Hủy đăng ký thất bại!");
    }
  };

  const items = [
    {
      label: (
        <Popconfirm
          title="Bạn có chắc muốn hủy đăng ký môn học này?"
          onConfirm={handleUnenroll}
          okText="Đồng ý"
          cancelText="Hủy"
        >
          <span>Hủy đăng ký</span>
        </Popconfirm>
      ),
      key: 'unenroll',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card variant='borderless'>
        <Row>
          <Col span={12}><Title level={2}>{course.name} ({course.id})</Title></Col>
          {currentUser?.role==='student' && (
          <Col span={12}  style={{ justifyContent: 'flex-end', display:'flex', alignItems: 'center'}}>
            <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight" arrow={{ pointAtCenter: true }}>
              <Button type="text" size='large' icon={<MoreOutlined />} />
            </Dropdown>
          </Col>
          )}
        </Row>

        <Text>{course.description}</Text>

        <Tabs
          defaultActiveKey="1"
          style={{ marginTop: 24 }}
          items={[
            {
              key: '1',
              label: 'Tài liệu môn học',
              children: (
                <>
                  {currentUser?.role === 'teacher' && (
                    <>
                      <Button type="primary" ghost onClick={() => setShowAddModal(true)}>
                        + Thêm tài liệu
                      </Button>

                      <AddMaterialForm
                        visible={showAddModal}
                        onClose={() => setShowAddModal(false)}
                        courseId={course.id}
                        onSuccess={async () => {
                          const updated = await fetchMaterialsByCourseId(course.id);
                          setMaterials(updated);
                        }}
                      />

                      <Modal
                        open={!!editingMaterial}
                        title="Chỉnh sửa tài liệu"
                        onCancel={() => setEditingMaterial(null)}
                        onOk={handleUpdateMaterial}
                        okText="Cập nhật"
                      >
                        <Form form={form} layout="vertical">
                          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}> 
                            <Input />
                          </Form.Item>
                          <Form.Item name="type" label="Loại tài liệu" rules={[{ required: true }]}> 
                            <Select>
                              <Option value="pdf">PDF</Option>
                              <Option value="video">Video</Option>
                              <Option value="link">Link</Option>
                            </Select>
                          </Form.Item>
                          <Form.Item name="url" label="URL" rules={[{ required: true }]}> 
                            <Input />
                          </Form.Item>
                        </Form>
                      </Modal>
                    </>
                  )}

                  <List
                    itemLayout="horizontal"
                    dataSource={materials}
                    pagination={{
                      pageSize: 5,
                    }}
                    renderItem={item => (
                      <List.Item
                        actions={[
                          <Button type="link" href={item.url} target="_blank"><EyeOutlined/></Button>,

                          currentUser?.role === 'teacher' && (
                            <>
                              <Button
                                type="link"
                                icon={<EditOutlined />}
                                onClick={() => handleEditMaterial(item)}
                              />
                              
                              <Popconfirm
                                title="Xác nhận xóa tài liệu này?"
                                onConfirm={() => handleDeleteMaterial(item.id)}
                                okText="Xóa"
                                cancelText="Hủy"
                              >
                                <Button type="link" danger icon={<DeleteOutlined />} />
                              </Popconfirm>
                            </>
                          ),
                        ].filter(Boolean)}
                      >
                        <List.Item.Meta
                          avatar={getMaterialIcon(item.type)}
                          title={<a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a>}
                          description={`Ngày đăng: ${new Date(item.createdAt).toLocaleDateString()}`}
                        />
                      </List.Item>
                    )}
                  />
                </>
              )
            },
            {
              key: '2',
              label: 'Bài tập',
              children: (
                <List
                  itemLayout="horizontal"
                  dataSource={assignments}
                  renderItem={item => (
                    <List.Item actions={[<Button type="primary">Nộp bài</Button>]}> 
                      <List.Item.Meta
                        title={item.title}
                        description={`Hạn nộp: ${new Date(item.dueDate).toLocaleDateString()}`}
                      />
                      <div>
                        {item.submissions?.length > 0 ? (
                          <Tag color="green">Đã nộp</Tag>
                        ) : (
                          <Tag color="orange">Chưa nộp</Tag>
                        )}
                      </div>
                    </List.Item>
                  )}
                />
              )
            },
            {
              key: '3',
              label: 'Thông báo',
              children: notifications.length > 0 ? (
                <List
                  itemLayout="vertical"
                  dataSource={notifications}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.title}
                        description={`Ngày: ${new Date(item.createdAt).toLocaleString()}`}
                      />
                      <div>{item.content}</div>
                    </List.Item>
                  )}
                />
              ) : (
                <p>Không có thông báo nào</p>
              )
            },
          ]}
        />
      </Card>
    </div>
  );
}

export default CourseDetailPage;
