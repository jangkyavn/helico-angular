import { Role } from './role.model';

export interface User {
    id?: string;
    userName?: string;
    fullName?: string;
    email?: string;
    gender?: number;
    avatar?: string;
    birthDay?: string;
    phoneNumber?: string;
    status?: boolean;
    createdBy?: string;
    createdDate?: any;
    roleId?: string;
    roleName?: string;

    roles?: Role[];
}
