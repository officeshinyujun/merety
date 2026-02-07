// API Client & Services
export { default as apiClient } from './client';
export { default as authApi } from './auth';
export { default as adminUsersApi } from './admin-users';
export { default as studiesApi } from './studies';
export { default as sessionsApi } from './sessions';
export { default as tilApi } from './til';
export { default as archiveApi } from './archive';
export { default as noticesApi } from './notices';
export { default as teamApi } from './team';
export { default as dashboardApi } from './dashboard';
export { default as metricsApi } from './metrics';
export { default as roleDescriptionsApi } from './roleDescriptions';

// Re-export types
export type { LoginRequest, LoginResponse, ChangePasswordRequest } from './auth';
export type { UserQueryParams, CreateUserRequest, UpdateUserRequest, Pagination } from './admin-users';
export type {
  StudyQueryParams,
  CreateStudyRequest,
  UpdateStudyRequest,
  UpdateOverviewRequest,
  AddMemberRequest,
  UpdateMemberRoleRequest,
  StudyMember,
} from './studies';
export type {
  SessionQueryParams,
  CreateSessionRequest,
  UpdateSessionRequest,
  AttendanceItem,
  BulkUpdateAttendanceRequest,
} from './sessions';
export type { TilQueryParams, CreateTilRequest, UpdateTilRequest } from './til';
export type { ArchiveQueryParams, UploadArchiveRequest, CreateLinkRequest } from './archive';
export type { NoticeQueryParams, CreateNoticeRequest, UpdateNoticeRequest } from './notices';
export type { TeamMemberQueryParams, TeamMember, RoleDefinition } from './team';
export type { MyStudy, TilStats, CalendarEvent, ActivityLog, DashboardData } from './dashboard';
export type { StudyMetric, MonthlyTilStat, AttendanceStat, MetricsData } from './metrics';
