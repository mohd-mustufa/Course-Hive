export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const GET_ALL_COURSES_URL = "/api/v1/course/";
export const GET_COURSE_URL = "/api/v1/course/";
export const PURCHASE_COURSE_URL = "/api/v1/course/purchase";
export const CREATE_ORDER_URL = "/api/v1/order";
export const GET_MY_COURSES_URL = "/api/v1/user/purchases";
export const GET_CLIENT_SECRET_URL = "/api/v1/course/purchase/client-secret";

// Course Details endpoints
export const CREATE_COURSE_DETAILS_URL = "/api/v1/course-details/";
export const UPDATE_COURSE_DETAILS_URL = "/api/v1/course-details/";

// Auth endpoints
export const SIGNUP_URL = "/api/v1/user/signup";
export const LOGIN_URL = "/api/v1/user/login";
export const LOGOUT_URL = "/api/v1/user/logout";

// Admin auth endpoints
export const ADMIN_SIGNUP_URL = "/api/v1/admin/signup";
export const ADMIN_LOGIN_URL = "/api/v1/admin/login";
export const ADMIN_LOGOUT_URL = "/api/v1/admin/logout";

export const GET_ADMIN_COURSES_URL = "/api/v1/admin/courses";
export const GET_ADMIN_STATS_URL = "/api/v1/admin/stats";
export const CREATE_COURSE_URL = "/api/v1/course/";
export const UPDATE_COURSE_URL = "/api/v1/course/";
export const DELETE_COURSE_URL = "/api/v1/course/";

// AI endpoints
export const GENERATE_AI_CONTENT_URL = "/api/v1/ai/generate-content";
