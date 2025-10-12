import axios from '../axios';
import type {
  ContactListResponse,
  ContactResponse,
  CreateSingleContactPayload,
  UpdateContactPayload,
  ImportContactsResponse,
  CreateGroupContactPayload,
  GroupContactResponse,
  GroupContactListResponse,
  UpdateGroupContactPayload,
  SingleGroupResponse,
  ContactQueryParams,
} from '@/types/contact';

// 🟢 Create a new contact
export const createContact = async (
  payload: CreateSingleContactPayload
): Promise<ContactResponse> => {
  const response = await axios.post<ContactResponse>(
    '/contacts/create',
    payload
  );
  return response.data;
};

// 🔵 Get all contacts with pagination, search, and sort
export const getAllContacts = async (
  params?: ContactQueryParams
): Promise<ContactListResponse> => {
  const response = await axios.get<ContactListResponse>('/contacts', {
    params,
  });
  return response.data;
};

// 🔵 Get contacts by Group ID with pagination, search, and sort
export const getContactsByGroupId = async (
  groupId: string,
  params?: ContactQueryParams
): Promise<ContactListResponse> => {
  const response = await axios.get<ContactListResponse>(
    `/contacts/${groupId}`,
    {
      params,
    }
  );
  return response.data;
};

// 🟠 Update a contact by ID
export const updateContact = async (
  contactId: string,
  payload: UpdateContactPayload
): Promise<ContactResponse> => {
  const response = await axios.put<ContactResponse>(
    `/contacts/update/${contactId}`,
    payload
  );
  return response.data;
};

// 🟣 Remove contact from a group
export const removeContactFromGroup = async (
  contactId: string,
  groupId: string
): Promise<ContactResponse> => {
  const response = await axios.patch<ContactResponse>(
    `/contacts/remove/${contactId}/${groupId}`
  );
  return response.data;
};

// 🔴 Delete a contact by ID
export const deleteContact = async (
  contactId: string
): Promise<ContactResponse> => {
  const response = await axios.delete<ContactResponse>(
    `/contacts/delete/${contactId}`
  );
  return response.data;
};

// 🟡 Import contacts via CSV
export const importContactsFromCSV = async (
  formData: FormData
): Promise<ImportContactsResponse> => {
  const response = await axios.post<ImportContactsResponse>(
    '/contacts/import',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

// 🟢 Create a new group
export const createGroup = async (
  payload: CreateGroupContactPayload
): Promise<GroupContactResponse> => {
  const response = await axios.post<GroupContactResponse>(
    '/group-contact',
    payload
  );
  return response.data;
};

// 🟠 Get all groups
export const getAllGroups = async (): Promise<GroupContactListResponse> => {
  const response = await axios.get<GroupContactListResponse>('/group-contact');
  return response.data;
};

// 🟣 Get a single group by ID with contacts
export const getGroupById = async (
  groupId: string
): Promise<SingleGroupResponse> => {
  const response = await axios.get<SingleGroupResponse>(
    `/group-contact/${groupId}`
  );
  return response.data;
};

// 🟡 Update a group by ID
export const updateGroup = async (
  groupId: string,
  payload: UpdateGroupContactPayload
): Promise<GroupContactResponse> => {
  const response = await axios.put<GroupContactResponse>(
    `/group-contact/${groupId}`,
    payload
  );
  return response.data;
};

// 🔴 Delete a group by ID
export const deleteGroup = async (
  groupId: string
): Promise<GroupContactResponse> => {
  const response = await axios.delete<GroupContactResponse>(
    `/group-contact/${groupId}`
  );
  return response.data;
};
