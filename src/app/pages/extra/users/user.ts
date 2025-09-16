import { Roles } from "src/app/enums/roles"

export interface User {
    id: number,
    password: string,
    last_login: string,
    is_superuser: boolean,
    is_staff: boolean,
    date_joined: string,
    email: string,
    dateNaiss: string,
    username: string,
    first_name: string,
    last_name: string,
    phone: string,
    is_active: boolean,
    created_at: string,
    updated_at: string,
    bijouterie: string,
    user_role: Role,
    groups: [],
    user_permissions: []
}

export interface Role {
    id: number,
    name: Roles
}