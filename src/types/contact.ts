import type { ApiResponse } from './api';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  visitCount: number;
  firstVisit?: Date;
  lastVisit?: Date;
  groups?: GroupSummary[];
}

export interface GroupSummary {
  id: string;
  name: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalContacts: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ContactQueryParams {
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'phone' | 'visitCount' | 'firstVisit' | 'lastVisit';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface CreateSingleContactPayload {
  name: string;
  phone: string;
  groupsArray: string[];
}

export interface UpdateContactPayload {
  name?: string;
  phone?: string;
  groupsArray?: string[];
}

export type ContactResponse = ApiResponse<{
  contact: Contact;
}>;

export type ContactListResponse = ApiResponse<{
  contacts: Contact[];
  pagination: PaginationInfo;
}>;

export type ImportContactsResponse = ApiResponse<{
  imported: string;
  skipped: string;
}>;

export interface ContactCSVRow {
  name: string;
  phone: string;
}

export interface ContactToSave {
  name: string;
  phone: string;
  user: string;
  groups: string[];
}

export interface GroupContact {
  id: string;
  name: string;
  description?: string;
}

export interface CreateGroupContactPayload {
  name: string;
  description?: string;
}

export interface UpdateGroupContactPayload {
  name?: string;
  description?: string;
}

export type GroupContactResponse = ApiResponse<{
  groupContact: GroupContact;
}>;

export type GroupContactListResponse = ApiResponse<{
  groups: GroupContact[];
}>;

export type SingleGroupResponse = ApiResponse<{
  group: GroupContact;
}>;
