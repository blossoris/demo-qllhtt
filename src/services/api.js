import axios from "axios";

const API_URL = "http://localhost:3001";



export const fetchUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};
//Đăng ký người dùng
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/users`, userData);
  return response.data;
};

//Khóa học
export const fetchCourses = async () => {
  const response = await axios.get(`${API_URL}/courses`);
  return response.data;
};

//Thêm khóa học
export const addCourse = async (courseData) => {
  const response = await axios.post(`${API_URL}/courses`, courseData);
  return response.data;
};
export const fetchCourseById = async (id) => {
  const response = await axios.get(`${API_URL}/courses/${id}`);
  return response.data;
};
export const fetchCourseByInstructorId = async (instructorId) => {
  const response = await axios.get(`${API_URL}/courses?instructorId=${instructorId}`);
  return response.data;
};
export const updateCourse = async (id, data) => {
  const response = await axios.patch(`${API_URL}/courses/${id}`, data);
  return response.data;
};
export const deleteCourse = async (id) => {
  const response = await axios.delete(`${API_URL}/courses/${id}`);
  return response.data;
};

// Đăng ký môn học từ mã mời
export const joinCourseByInviteCode = async (studentId, inviteCode) => {
  const response = await axios.get(`${API_URL}/courses`);
  const course = response.data.find(c => c.inviteCode === inviteCode || c.id === inviteCode);
  if (!course) throw new Error('Mã mời không hợp lệ');

  if (!course.studentIds.includes(studentId)) {
    course.studentIds.push(studentId);
    await axios.patch(`${API_URL}/courses/${course.id}`, course);
  }
  return course;
};

 //-----------------Tài liệu
// Lấy danh sách tài liệu theo courseId
export const fetchMaterialsByCourseId = async (courseId) => {
  const res = await axios.get(`${API_URL}/materials?courseId=${courseId}`);
  return res.data;
};
//Thêm tài liệu
export const addMaterial = async (materialData) => {
  const response = await axios.post(`${API_URL}/materials`, materialData);
  return response.data;
};

// Lấy danh sách bài tập theo courseId
export const fetchAssignmentsByCourseId = async (courseId) => {
  const res = await axios.get(`${API_URL}/assignments?courseId=${courseId}`);
  return res.data;
};

// Xóa
export const deleteMaterial = async (id) => {
  const response = await axios.delete(`${API_URL}/materials/${id}`);
  return response.data;
};
export const updateMaterial = async (id, data) => {
  const res = await axios.patch(`${API_URL}/materials/${id}`, data);
  return res.data;
};




// Lấy thông báo theo courseId
export const fetchNotificationsByCourseId = async (courseId) => {
  const res = await axios.get(`${API_URL}/notifications?relatedCourse=${courseId}`);
  return res.data;
};
//Bài tập
export const fetchAssignments = async () => {
  const response = await axios.get(`${API_URL}/assignments`);
  return response.data;
};


//Thông báo
export const fetchNotifications = async () => {
  const response = await axios.get(`${API_URL}/notifications`);
  return response.data;
};
