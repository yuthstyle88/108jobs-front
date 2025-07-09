import { initializeEnforcer } from "./enforcer";

export const checkPermission = async (sub: string, obj: string, act: string): Promise<boolean> => {
    const enforcer = await initializeEnforcer();

    return enforcer.enforce(sub, obj, act);
};

export const listPolicies = async () => {
    const enforcer = await initializeEnforcer();

    // ดึงนโยบายทั้งหมดที่กำหนดในระบบ
    const policies = enforcer.getPolicy();
    return policies;
};

export const addPolicy = async (sub: string, obj: string, act: string) => {
    const enforcer = await initializeEnforcer();

    // เพิ่มนโยบายใหม่
    const added = await enforcer.addPolicy(sub, obj, act);
    return added;
};

export const removePolicy = async (sub: string, obj: string, act: string) => {
    const enforcer = await initializeEnforcer();

    // ลบนโยบายที่ระบุ
    const removed = await enforcer.removePolicy(sub, obj, act);
    return removed;
};