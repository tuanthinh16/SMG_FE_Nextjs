
import Api from './api';

const api = new Api();

const ClothesTypeQueries = {
    GET_CLOTHES_TYPES: `
        query ClothesTypes {
            clothesTypes {
                ID
                CLOTHES_TYPE_CODE
                CLOTHES_TYPE_NAME
                PARENT_ID
                BRANCH_NAME
                COUNTRY_NAME
                CLOTHES_TYPE_DESCRIPTION
                CLOTHES_TYPE_IMAGE
                CREATE_TIME
                CREATOR
                MODIFIER
                MODIFY_TIME
                IS_ACTIVE
            }
        }
    `,
    GET_CLOTHES_TYPE_BY_ID: `
        query ClothesTypeById($id: Int!) {
            clothesTypeById(id: $id) {
                ID
                CLOTHES_TYPE_CODE
                CLOTHES_TYPE_NAME
                PARENT_ID
                BRANCH_NAME
                COUNTRY_NAME
                CLOTHES_TYPE_DESCRIPTION
                CLOTHES_TYPE_IMAGE
                CREATE_TIME
                CREATOR
                MODIFIER
                MODIFY_TIME
                IS_ACTIVE
            }
        }
    `,
    GET_CLOTHES_TYPE_BY_CODE: `
        query ClothesTypeByCode($clothesTypeCode: String!) {
            clothesTypeByCode(clothesTypeCode: $clothesTypeCode) {
                ID
                CLOTHES_TYPE_CODE
                CLOTHES_TYPE_NAME
                PARENT_ID
                BRANCH_NAME
                COUNTRY_NAME
                CLOTHES_TYPE_DESCRIPTION
                CLOTHES_TYPE_IMAGE
                CREATE_TIME
                CREATOR
                MODIFIER
                MODIFY_TIME
                IS_ACTIVE
            }
        }
    `,
};

const ClothesTypeMutations = {
    CREATE_CLOTHES_TYPE: `
        mutation CreateClothesType(
            $branchName: String
            $clothesTypeCode: String
            $clothesTypeDescription: String
            $clothesTypeImage: String
            $clothesTypeName: String
            $countryName: String
            $parentId: Int
        ) {
            createClothesType(
                branchName: $branchName
                clothesTypeCode: $clothesTypeCode
                clothesTypeDescription: $clothesTypeDescription
                clothesTypeImage: $clothesTypeImage
                clothesTypeName: $clothesTypeName
                countryName: $countryName
                parentId: $parentId
            ) {
                success
            }
        }
    `,
    UPDATE_CLOTHES_TYPE: `
        mutation UpdateClothesType(
            $branchName: String
            $clothesTypeCode: String
            $clothesTypeDescription: String
            $clothesTypeImage: String
            $clothesTypeName: String
            $countryName: String
            $id: Int
            $parentId: Int
        ) {
            updateClothesType(
                branchName: $branchName
                clothesTypeCode: $clothesTypeCode
                clothesTypeDescription: $clothesTypeDescription
                clothesTypeImage: $clothesTypeImage
                clothesTypeName: $clothesTypeName
                countryName: $countryName
                id: $id
                parentId: $parentId
            ) {
                success
            }
        }
    `,
    DELETE_CLOTHES_TYPE: `
        mutation DeleteClothesType($id: Int!) {
            deleteClothesType(id: $id) {
                success
            }
        }
    `,
};

export const getClothesTypes = async () => {
    try {
        const res = await api.query(
            ClothesTypeQueries.GET_CLOTHES_TYPES,
        );
        return res;
    } catch (error) {
        console.error('Error fetching clothes types:', error);
        throw error;
    }
};

export const getClothesTypeById = async (id: number) => {
    try {
        const res = await api.query(
            ClothesTypeQueries.GET_CLOTHES_TYPE_BY_ID,
            { id }
        );
        return res.data;
    } catch (error) {
        console.error('Error fetching clothes type by ID:', error);
        throw error;
    }
};

export const getClothesTypeByCode = async (clothesTypeCode: string) => {
    try {
        const res = await api.query(
            ClothesTypeQueries.GET_CLOTHES_TYPE_BY_CODE,
            { clothesTypeCode }
        );
        return res.data;
    } catch (error) {
        console.error('Error fetching clothes type by code:', error);
        throw error;
    }
};

export const createClothesType = async (input: {
    branchName: string;
    clothesTypeCode: string;
    clothesTypeDescription: string;
    clothesTypeImage: string;
    clothesTypeName: string;
    countryName: string;
    parentId: number;
}) => {
    try {
        const res = await api.mutate(
            ClothesTypeMutations.CREATE_CLOTHES_TYPE,
            input
        );
        return res.data;
    } catch (error) {
        console.error('Error creating clothes type:', error);
        throw error;
    }
};

export const updateClothesType = async (
    id: number,
    input: {
        branchName: string;
        clothesTypeCode: string;
        clothesTypeDescription: string;
        clothesTypeImage: string;
        clothesTypeName: string;
        countryName: string;
        parentId: number;
    }
) => {
    try {
        const res = await api.mutate(
            ClothesTypeMutations.UPDATE_CLOTHES_TYPE,
            { id, ...input }
        );
        return res.data;
    } catch (error) {
        console.error('Error updating clothes type:', error);
        throw error;
    }
};

export const deleteClothesType = async (id: number) => {
    try {
        const res = await api.mutate(
            ClothesTypeMutations.DELETE_CLOTHES_TYPE,
            { id }
        );
        return res.data;
    } catch (error) {
        console.error('Error deleting clothes type:', error);
        throw error;
    }
};