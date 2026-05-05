/**
 * Centralized configuration for API endpoints
 * Update values here to change them across the entire application
 */

export const API_CONFIG = {
  // Login API endpoint
  LOGIN_API_URL: 'https://irpd4g3k43.execute-api.us-east-1.amazonaws.com/default/event_login',
  
  // Student Notifications API endpoint
  STUDENT_NOTIFICATION_URL: 'https://o8yxvbako1.execute-api.us-east-1.amazonaws.com/default/event_get_student_notification',
  
  // Exam Results API endpoint
  INSERT_RESULT_URL: 'https://ezrib3bxac.execute-api.us-east-1.amazonaws.com/default/event_insert_result',
  
  // Parent Details API endpoints
  GET_PARENT_DETAILS_URL: 'https://d8we8zpuoj.execute-api.us-east-1.amazonaws.com/default/event_get_parent_details',
  UPDATE_PARENT_DETAILS_URL: 'https://t7fncp3sq7.execute-api.us-east-1.amazonaws.com/default/event_parent_update',
  
  // Student Registration API endpoint
  STUDENT_INSERT_URL: 'https://hl5klpfv63.execute-api.us-east-1.amazonaws.com/default/event_student_insert',
  
  // Signup API endpoint (placeholder - update with actual URL)
  SIGNUP_API_URL: 'https://5boz4vmp1k.execute-api.us-east-1.amazonaws.com/default/event_signup',
  
  // Event Titles API endpoint (placeholder - update with actual URL)
  EVENT_TITLES_API_URL: 'https://2fqnxdrrzj.execute-api.us-east-1.amazonaws.com/default/event_get_event_title',
  
  // Students API endpoint
  STUDENTS_API_URL: 'https://k0tbcg22d1.execute-api.us-east-1.amazonaws.com/default/event_get_students',
  
  // Story Questions API endpoint
  STORY_QUESTIONS_API_URL: 'https://sq4fgnu8q9.execute-api.us-east-1.amazonaws.com/default/event_get_story_quations',
} as const;

export type ApiEndpoint = keyof typeof API_CONFIG;