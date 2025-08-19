import type { ApiResponse } from './api';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  groups?: GroupSummary[];
}

export interface GroupSummary {
  id: string;
  name: string;
}

export interface CreateSingleContactPayload {
  name: string;
  phone: string;
  groupsArray: string[]; // group IDs to associate
}

export interface UpdateContactPayload {
  name?: string;
  phone?: string;
  groupsArray?: string[]; // group IDs to update
}

export type ContactResponse = ApiResponse<{
  contact: Contact;
}>;

export type ContactListResponse = ApiResponse<{
  contacts: Contact[];
}>;

export type ImportContactsResponse = ApiResponse<{
  imported: string;
  skipped: string;
}>;

// For parsing CSV file
export interface ContactCSVRow {
  name: string;
  phone: string;
}

// For inserting into DB
export interface ContactToSave {
  name: string;
  phone: string;
  user: string;
  groups: string[];
}

// For Groups of Contact

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
