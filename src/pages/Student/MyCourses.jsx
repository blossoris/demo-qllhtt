import { useEffect, useState } from 'react';
import { Card, List, Avatar, Button, Tag, message, Spin } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import { fetchCourses, fetchUsers } from '../../services/api';
import { useAuth } from '../../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState({});
  const [loadingData, setLoadingData] = useState(true);
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && currentUser) {
      try {
        fetchCourses().then((data) => {
          const enrolled = data.filter((course) =>
            course.studentIds?.includes(currentUser.id)
          );
          setCourses(enrolled);
        });

        fetchUsers().then((users) => {
          const teacherMap = {};
          users.forEach((user) => {
            if (user.role === 'teacher') {
              teacherMap[user.id] = user.fullname;
            }
          });
          setInstructors(teacherMap);
        });
      } catch (e){
        message.error('Không thể load dữ liệu.');
        console.log("Lỗi: ", e);
      }finally{
        setLoadingData(false);
      }
      
    }
  }, [loading, currentUser]);

  if (loading || loadingData) {
    return (
      <Spin percent={'auto'} tip="Đang tải dữ liệu...">
        <div style={{ minHeight: 200 }} />
      </Spin>
    );
  }
  return (
    <div style={{ padding: '24px' }}>
      <Card title="Các môn học đã đăng ký" variant="borderless">
        <List
          itemLayout="horizontal"
          dataSource={courses}
          renderItem={(course) => (
            <List.Item
              actions={[
                <Button type="link" onClick={() => navigate(`/courses/${course.id}`)}>
                  Vào lớp học
                </Button>,
                <Tag color="green">Đã đăng ký</Tag>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<BookOutlined />} />}
                title={
                  <>
                    <strong>{course.name}</strong>{' '}
                    <span style={{ color: '#999' }}>({course.id})</span>
                  </>
                }
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

export default MyCourses;
