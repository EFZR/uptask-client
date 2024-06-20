import api from "@/lib/axios";
import { isAxiosError } from "axios";
import {
  Project,
  TeamMember,
  TeamMemberForm,
  teamMembersSchema,
} from "../types";

type TeamAPI = {
  projectId: Project["_id"];
  formData: TeamMemberForm;
  userId: TeamMember["_id"];
};

export async function findUserByEmail({
  projectId,
  formData,
}: Pick<TeamAPI, "projectId" | "formData">) {
  try {
    const url = `/projects/${projectId}/team/find`;
    const { data } = await api.post<TeamMember>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function addUserToProject({
  projectId,
  userId,
}: Pick<TeamAPI, "projectId" | "userId">) {
  try {
    const url = `/projects/${projectId}/team`;
    const { data } = await api.post(url, { id: userId });
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getProjectTeam({
  projectId,
}: Pick<TeamAPI, "projectId">) {
  try {
    const url = `/projects/${projectId}/team`;
    const { data } = await api.get(url);
    const response = teamMembersSchema.safeParse(data);
    if (response.success) {
      return response.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function removeUserFromProject({
  projectId,
  userId,
}: Pick<TeamAPI, "projectId" | "userId">) {
  try {
    const url = `/projects/${projectId}/team/${userId}`;
    const { data } = await api.delete<string>(url);
    return data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
