import type { LocalUser } from "./LocalUser";
import type { Person } from "./Person";
import type { RegistrationApplication } from "./RegistrationApplication";
/**
 * A registration application view.
 */
export type RegistrationApplicationView = {
    registrationApplication: RegistrationApplication;
    creatorLocalUser: LocalUser;
    creator: Person;
    admin?: Person;
};
