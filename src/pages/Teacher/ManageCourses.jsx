import { Card, Table, Button, Space, Popconfirm, message, Input, Select, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import CourseModal from './CourseModal';
import { fetchCourseByInstructorId, addCourse, updateCourse, deleteCourse } from '../../services/api';
import { useAuth } from '../../contexts/useAuth';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;
const { Option } = Select;

function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null); 
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && currentUser) {
      fetchCourseByInstructorId(currentUser.id).then(setCourses);
    }
  }, [loading, currentUser]);

  // Tìm kiếm
  const courseData = courses
    .filter(course => {
      const matchKeyword = course.name.toLowerCase().includes(searchKeyword.toLowerCase());
      const matchStatus = filterStatus === 'all' || course.status === filterStatus;
      return matchKeyword && matchStatus;
    })
    .map(course => ({
      ...course,
      studentCount: course.studentIds?.length || 0,
  }));
  // Thêm hoặc cập nhật
  const handleSaveCourse = async (course) => {
    try {
      let updated;
      if (editingCourse) {
        updated = await updateCourse(course.id, course);
        setCourses(prev => prev.map(c => (c.id === updated.id ? updated : c)));
        message.success('Đã cập nhật môn học!');
      } else {
        updated = await addCourse({ ...course, instructorId: currentUser.id, status: 'active' });
        setCourses(prev => [...prev, updated]);
        message.success('Đã thêm môn học!');
      }
      setIsModalVisible(false);
      setEditingCourse(null);
    } catch (error) {
      console.error(error);
      message.error('Lưu môn học thất bại!');
    }
  };
  // Xóa
  const handleDelete = async (id) => {
    try {
      await deleteCourse(id);
      setCourses(prev => prev.filter(course => course.id !== id));
      message.success('Đã xóa môn học!');
    } catch {
      message.error('Xóa thất bại!');
    }
  };

  // Mở form sửa
  const handleEdit = (course) => {
    setEditingCourse(course);
    setIsModalVisible(true);
  };

  if (loading || !currentUser) return null;

  const columns = [
    {
      title: 'Mã môn',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: 'Tên môn học',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: 'Số SV',
      dataIndex: 'studentCount',
      align: 'center',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      align: 'center',
      render: status => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Đang mở' : 'Đã đóng'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined/>} onClick={() => navigate(`/courses/${record.id}`)}>Xem</Button>
          <Button icon={<EditOutlined />} ghost type="primary"  onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDelete(record.id)}>
            <Button icon={<DeleteOutlined />} danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        title="Quản lý môn học"
        variant="borderless"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setIsModalVisible(true); setEditingCourse(null); }}>
            Thêm môn học
          </Button>
        }
      >
        <div style={{ marginBottom: 16, display: 'flex', gap: '16px' }}>
          <Search
            placeholder="Tìm kiếm môn học"
            allowClear
            enterButton={<Button type="primary" icon={<SearchOutlined />}>Tìm</Button>}
            size="large"
            onSearch={(value) => setSearchKeyword(value)}
            style={{ flex: 1 }}
          />

          <Select
            placeholder="Lọc theo trạng thái"
            style={{ width: 200 }}
            size="large"
            value={filterStatus}
            onChange={value => setFilterStatus(value)}
          >
            <Option value="all">Tất cả</Option>
            <Option value="active">Đang mở</Option>
            <Option value="inactive">Đã đóng</Option>
          </Select>

        </div>

        <Table
          columns={columns}
          dataSource={courseData}
          rowKey="id"
        />
      </Card>

      <CourseModal
        open={isModalVisible}
        onCancel={() => { setIsModalVisible(false); setEditingCourse(null); }}
        onSave={handleSaveCourse}
        course={editingCourse}
        courses={courses}
      />
    </div>
  );
}

export default ManageCourses;
