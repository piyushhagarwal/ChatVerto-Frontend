import axios from "axios";
import { type UserProfile } from "@/types/profile";

export const fetchUserProfile = async (): Promise<UserProfile> => {
  const response = await axios.get("/api/profile");
  return response.data.data.user;
};

export const updateUserProfile = async (data: Partial<UserProfile["whatsAppDetails"]>) => {
  await axios.put("/api/profile", data);
};

export const uploadProfilePic = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  await axios.post("/api/profile/upload-picture", formData);
};