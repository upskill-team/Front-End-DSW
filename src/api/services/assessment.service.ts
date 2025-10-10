import apiClient from '../apiClient';
import type {
  Assessment,
  CreateAssessmentRequest,
  UpdateAssessmentRequest,
  AssessmentAttempt,
  StartAttemptRequest,
  AnswerQuestionRequest,
  SubmitAttemptRequest,
  AttemptAnswer,
} from '../../types/entities';

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

const create = async (
  data: CreateAssessmentRequest
): Promise<Assessment> => {
  const response = await apiClient.post<ApiResponse<Assessment>>(
    '/assessments',
    data
  );
  return response.data.data;
};

const getAll = async (courseId?: string): Promise<Assessment[]> => {
  const url = courseId
    ? `/assessments?courseId=${courseId}`
    : '/assessments';
  const response = await apiClient.get<ApiResponse<Assessment[]>>(url);
  return response.data.data;
};

const getById = async (id: string): Promise<Assessment> => {
  const response = await apiClient.get<ApiResponse<Assessment>>(
    `/assessments/${id}`
  );
  return response.data.data;
};

const update = async (
  id: string,
  data: UpdateAssessmentRequest
): Promise<Assessment> => {
  const response = await apiClient.put<ApiResponse<Assessment>>(
    `/assessments/${id}`,
    data
  );
  return response.data.data;
};

const remove = async (id: string): Promise<void> => {
  await apiClient.delete(`/assessments/${id}`);
};

const getAttemptsByAssessment = async (
  assessmentId: string
): Promise<AssessmentAttempt[]> => {
  const response = await apiClient.get<ApiResponse<AssessmentAttempt[]>>(
    `/assessments/${assessmentId}/attempts`
  );
  return response.data.data;
};

const getAttemptById = async (attemptId: string): Promise<AssessmentAttempt> => {
  const response = await apiClient.get<ApiResponse<AssessmentAttempt>>(
    `/assessments/attempts/${attemptId}`
  );
  return response.data.data;
};

const startAttempt = async (
  data: StartAttemptRequest
): Promise<AssessmentAttempt> => {
  const response = await apiClient.post<ApiResponse<AssessmentAttempt>>(
    '/assessments/attempts/start',
    data
  );
  return response.data.data;
};

const answerQuestion = async (
  data: AnswerQuestionRequest
): Promise<AttemptAnswer> => {
  const response = await apiClient.post<ApiResponse<AttemptAnswer>>(
    '/assessments/attempts/answer',
    data
  );
  return response.data.data;
};

const submitAttempt = async (
  data: SubmitAttemptRequest
): Promise<AssessmentAttempt> => {
  const response = await apiClient.post<ApiResponse<AssessmentAttempt>>(
    '/assessments/attempts/submit',
    data
  );
  return response.data.data;
};

const getAttemptsByStudent = async (
  studentId: string
): Promise<AssessmentAttempt[]> => {
  const response = await apiClient.get<ApiResponse<AssessmentAttempt[]>>(
    `/assessments/attempts/student/${studentId}`
  );
  return response.data.data;
};

const assessmentService = {
  create,
  getAll,
  getById,
  update,
  remove,
  getAttemptsByAssessment,
  getAttemptById,
  startAttempt,
  answerQuestion,
  submitAttempt,
  getAttemptsByStudent,
};

export default assessmentService;
