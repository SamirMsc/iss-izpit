export type Role = 'STUDENT' | 'COMPANY';
export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imgUrl?: string;
  role: Role;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  location?: string;
  salary?: string;
  companyId: string;
  company?: User;
  createdAt?: string;
  updatedAt?: string;
}

export interface Application {
  id: string;
  studentId: string;
  jobId: string;
  resumeUrl: string;
  motivation: string;
  status: ApplicationStatus;
  companyResponse?: string;
  createdAt?: string;
  updatedAt?: string;
  job?: Job & { company?: User };
  student?: User;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
