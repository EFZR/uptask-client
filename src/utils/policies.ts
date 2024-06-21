import { Project, TeamMember } from "../types";

export function isManager(
  managerId: Project["manager"],
  userId: TeamMember["_id"]
) {
  return managerId === userId;
}
