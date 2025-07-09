import { newEnforcer } from "casbin";
import { join } from "path";

export const initializeEnforcer = async () => {
    // Load configuration (Model และ Policy)
    const policyModelPath = join(process.cwd(), "lib/casbin/policy.conf");
    const enforcer = await newEnforcer(policyModelPath);

    // เพิ่ม Policy ยกตัวอย่าง: (role, object, action)
    enforcer.addPolicy("admin", "/dashboard", "view");
    enforcer.addPolicy("user", "/profile", "edit");
    enforcer.addPolicy("guest", "/", "view");

    // ตั้ง Role กรณีที่มี Hierarchy ยกตัวอย่าง: user -> admin
    enforcer.addGroupingPolicy("user", "admin");

    return enforcer;
};