import { useAuthStore } from "./authStore";

export type { Role, User } from "./authStore";
export const useRoleStore = useAuthStore;
export default useRoleStore;
