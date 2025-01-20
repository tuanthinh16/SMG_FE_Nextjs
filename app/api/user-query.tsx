import Api from './api';

const api = new Api();

const UserQueries = {
    GET_USER_BY_ID: `
        query UserById($id: ID!) {
            userById(id: $id) {
                ID
                CREATOR
                MODIFIER
                IS_ACTIVE
                USERNAME
                LOGINNAME
                FULLNAME
                ADDRESS
                PHONE
                EMAIL
                ROLE
                CREATE_TIME
                MODIFY_TIME
                PASSWORD
            }
        }
    `,
    GET_USER_BY_USERNAME: `
        query UserByUsername($username: String!) {
            userByUsername(username: $username) {
                ID
                CREATOR
                MODIFIER
                IS_ACTIVE
                USERNAME
                LOGINNAME
                FULLNAME
                ADDRESS
                PHONE
                EMAIL
                ROLE
                CREATE_TIME
                MODIFY_TIME
                PASSWORD
            }
        }
    `,
    GET_USERS: `
        query Users {
            users {
                ID
                CREATOR
                MODIFIER
                IS_ACTIVE
                USERNAME
                LOGINNAME
                FULLNAME
                ADDRESS
                PHONE
                EMAIL
                ROLE
                CREATE_TIME
                MODIFY_TIME
                PASSWORD
            }
        }
    `,
};

const UserMutations = {
    CREATE_USER: `
        mutation CreateUser($input: CreateUserInput!) {
            createUser(input: $input) {
                success
            }
        }
    `,
    DELETE_USER: `
        mutation DeleteUser($id: ID!) {
            deleteUser(id: $id) {
                success
            }
        }
    `,
    UPDATE_USER: `
        mutation UpdateUser(
            $id: ID!
            $address: String
            $email: String
            $fullname: String
            $loginname: String
            $password: String
            $phone: String
            $role: String
            $username: String
        ) {
            updateUser(
                id: $id
                address: $address
                email: $email
                fullname: $fullname
                loginname: $loginname
                password: $password
                phone: $phone
                role: $role
                username: $username
            ) {
                success
                user {
                    ID
                    CREATOR
                    MODIFIER
                    IS_ACTIVE
                    USERNAME
                    LOGINNAME
                    FULLNAME
                    ADDRESS
                    PHONE
                    EMAIL
                    ROLE
                    CREATE_TIME
                    MODIFY_TIME
                    PASSWORD
                }
            }
        }
    `,
};

export const fetchUserById = async (id: number) => {
    return api.query(UserQueries.GET_USER_BY_ID, { id });
};

export const fetchUserByUsername = async (username: unknown) => {
    return api.query(UserQueries.GET_USER_BY_USERNAME, { username });
};

export const fetchUsers = async () => {
    try {
        const res = api.query(UserQueries.GET_USERS);
        return res;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }

};

export const createUser = async (input: unknown) => {
    return api.mutate(UserMutations.CREATE_USER, { input });
};

export const deleteUser = async (id: number) => {
    return api.mutate(UserMutations.DELETE_USER, { id });
};

export const updateUser = async (id: number, userData: Record<string, unknown>) => {
    return api.mutate(UserMutations.UPDATE_USER, { id, ...userData });
};