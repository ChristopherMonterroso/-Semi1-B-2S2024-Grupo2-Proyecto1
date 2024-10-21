export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const ENDPOINTS = {
  REGISTER: '/users/register',
  CONFIRM: '/auth/confirm',
  LOGIN: '/auth/login',
  SCHEDULES: '/user/shedules',
  TASKS: '/user/tasks',
  UPLOAD_FILE: '/user/file',
  TRANSLATE_FILE: '/user/trasnlate',
  TEXT_TO_SPEECH: '/user/polly'
};
