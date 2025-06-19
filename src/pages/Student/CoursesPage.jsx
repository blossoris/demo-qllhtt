import { useEffect, useState } from 'react';
import { Card, List, Avatar, Button, Input,Tag, message, Modal, Spin, Select } from 'antd';
import { SearchOutlined, BookOutlined, FilterOutlined } from '@ant-design/icons';
import { fetchCourses, fetchUsers, joinCourseByInviteCode } from '../../services/api';
import { useAuth } from '../../contexts/useAuth';

const { Search } = Input;
const { Option } = Select;

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState({});
  const [searchText, setSearchText] = useState('');
  const [loadingData, setLoadingData] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all'); // all | enrolled | notEnrolled
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [courseList, userList] = await Promise.all([
          fetchCourses(),
          fetchUsers(),
        ]);

        const instructorMap = {};
        userList.forEach((u) => {
          if (u.role === 'teacher') {
            instructorMap[u.id] = u.fullname;
          }
        });

        const updatedCourses = courseList.map((course) => ({
          ...course,
          enrolled: course.studentIds?.includes(currentUser?.id),
        }));

        setCourses(updatedCourses);
        setInstructors(instructorMap);
        
      } catch (error) {
        message.error('Không thể tải dữ liệu');
        console.log("Lỗi không thể tải dữ liệu: ", error);
      } finally {
        setLoadingData(false);
      }
    };

    if (!loading && currentUser) {
      fetchAll();
    }
  }, [loading, currentUser]);

  const reloadCourses = async () => {
    const updated = await fetchCourses();
    const newCourses = updated.map((c) => ({
      ...c,
      enrolled: c.studentIds?.includes(currentUser?.id),
    }));
    setCourses(newCourses);
  };

  const handleJoin = (course) => {
    if (course.enrolled) {
      message.info('Bạn đã đăng ký môn học này.');
      return;
    }
    if (course.status !== 'active') {
      message.error("Môn học này hiện không mở đăng ký.");
      return;
    }
    if (!course.allowStudentJoin) {
      Modal.confirm({
        title: `Nhập mã mời để đăng ký môn học "${course.name}"`,
        content: <Input id="inviteCodeInput" placeholder="Nhập mã mời..." />,
        onOk: async () => {
          const input = document.getElementById('inviteCodeInput');
          const code = input?.value?.trim();
          if (!code) {
            message.error('Vui lòng nhập mã mời!');
            return Promise.reject();
          }

          try {
            await joinCourseByInviteCode(currentUser.id, code);
            message.success('Đăng ký thành công!');
            reloadCourses();
          } catch (err) {
            message.error(err.message || 'Mã mời không hợp lệ!');
          }
        },
      });
    } else {
      Modal.confirm({
        title: `Xác nhận đăng ký môn "${course.name}"`,
        onOk: async () => {
          try {
            await joinCourseByInviteCode(currentUser.id, course.id);
            message.success('Đăng ký thành công!');
            reloadCourses();
          } catch (err) {
            message.error(err.message || 'Lỗi khi đăng ký!');
          }
        },
      });
    }
  };

  //Tìm kiếm môn đã đăng ký hoặc chưa
  const filteredCourses = courses.filter((course) => {
    const keyword = searchText.toLowerCase();
    const matchesSearch =
      course.name.toLowerCase().includes(keyword) ||
      course.id.toLowerCase().includes(keyword);

    if (filterStatus === 'enrolled' && !course.enrolled) return false;
    if (filterStatus === 'notEnrolled' && course.enrolled) return false;

    return matchesSearch;
  });

  if (loading || loadingData) {
    return (
      <Spin percent={'auto'} tip="Đang tải dữ liệu...">
        <div style={{ minHeight: 200 }} />
      </Spin>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card title="Danh sách môn học">
        <div
          style={{
            marginBottom: '16px',
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <Search
            placeholder="Tìm kiếm môn học"
            allowClear
            enterButton={<Button icon={<SearchOutlined />}>Tìm kiếm</Button>}
            size="large"
            onChange={(e) => setSearchText(e.target.value)}
            style={{ flex: 1, minWidth: 200 }}
          />

          <Select
            value={filterStatus}
            onChange={(value) => setFilterStatus(value)}
            style={{ width: 200 }}
            size="large"
            suffixIcon={<FilterOutlined />}
          >
            <Option value="all">Tất cả môn học</Option>
            <Option value="enrolled">Đã đăng ký</Option>
            <Option value="notEnrolled">Chưa đăng ký</Option>
          </Select>
        </div>

        <List
          itemLayout="horizontal"
          dataSource={filteredCourses}
          renderItem={(course) => (
            <List.Item
              actions={[
                course.enrolled ? (
                  <Tag color="green">Đã đăng ký</Tag>
                ) : (
                  <Button type="primary" onClick={() => handleJoin(course)}>
                    Đăng ký
                  </Button>
                ),
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<BookOutlined />} />}
                title={`${course.name} (${course.id})`}
                description={`Giảng viên: ${
                  instructors[course.instructorId] || 'Không rõ'
                }`}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}

export default CoursesPage;
