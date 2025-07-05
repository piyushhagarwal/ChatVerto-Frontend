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

export interface ContactResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    contact: Contact;
  };
}

export interface ContactListResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    contacts: Contact[];
  };
}

export interface ImportContactsResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    imported: string;
    skipped: string;
  };
}

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

export interface GroupContactResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    groupContact: GroupContact;
  };
}

export interface GroupContactListResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    groups: GroupContact[];
  };
}

export interface SingleGroupResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    group: GroupContact;
  };
}
