import { AxiosError } from "axios";
import Api from "./api";
const api = new Api();

export const ClothesQueries = {
    GET_CLOTHES: `
    query Clothes {
      clothes {
        ID
        CREATE_TIME
        CREATOR
        MODIFIER
        MODIFY_TIME
        IS_ACTIVE
        CLOTHES_CODE
        CLOTHES_NAME
        CLOTHES_TYPE_ID
        PARENT_ID
        BRANCH_NAME
        COUNTRY_NAME
        CLOTHES_SIZE
        CLOTHES_COLOR
        AMOUNT
        PRICE
        VAT
        CLOTHES_DESCRIPTION
        CLOTHES_IMAGE
        CLOTHES_STATUS
        IMP_TIME
        USERNAME
        REQUEST_TIME
        REQUEST_STATUS
        REQUEST_DESCRIPTION
      }
    }
  `,
    GET_CLOTHES_BY_ID: `
    query ClothesById($id: Long) {
      clothesById(id: $id) {
        ID
        CREATE_TIME
        CREATOR
        MODIFIER
        MODIFY_TIME
        IS_ACTIVE
        CLOTHES_CODE
        CLOTHES_NAME
        CLOTHES_TYPE_ID
        PARENT_ID
        BRANCH_NAME
        COUNTRY_NAME
        CLOTHES_SIZE
        CLOTHES_COLOR
        AMOUNT
        PRICE
        VAT
        CLOTHES_DESCRIPTION
        CLOTHES_IMAGE
        CLOTHES_STATUS
        IMP_TIME
        USERNAME
        REQUEST_TIME
        REQUEST_STATUS
        REQUEST_DESCRIPTION
      }
    }
  `,
};

const ClothesMutations = {
    CREATE_CLOTHES: `
        mutation CreateClothes(
            $amount: Float
            $branchName: String
            $clothesCode: String
            $clothesColor: String
            $clothesDescription: String
            $clothesImage: String
            $clothesName: String
            $clothesSize: String
            $clothesStatus: String
            $clothesTypeId: Int
            $countryName: String
            $impTime: String
            $parentId: String
            $price: Float
            $requestDescription: String
            $requestStatus: String
            $requestTime: String
            $username: String
            $vat: Float
        ) {
            createClothes(
                amount: $amount
                branchName: $branchName
                clothesCode: $clothesCode
                clothesColor: $clothesColor
                clothesDescription: $clothesDescription
                clothesImage: $clothesImage
                clothesName: $clothesName
                clothesSize: $clothesSize
                clothesStatus: $clothesStatus
                clothesTypeId: $clothesTypeId
                countryName: $countryName
                impTime: $impTime
                parentId: $parentId
                price: $price
                requestDescription: $requestDescription
                requestStatus: $requestStatus
                requestTime: $requestTime
                username: $username
                vat: $vat
            ) {
                success
            }
        }
    `,
    UPDATE_CLOTHES: `
    mutation UpdateClothes(
      $id: Long
      $amount: Int
      $branchName: String
      $clothesCode: String
      $clothesColor: String
      $clothesDescription: String
      $clothesImage: String
      $clothesName: String
      $clothesSize: String
      $clothesStatus: String
      $clothesTypeId: Int
      $countryName: String
      $impTime: String
      $parentId: Long
      $price: Float
      $requestDescription: String
      $requestStatus: String
      $requestTime: String
      $vat: Float
      $username: String
    ) {
      updateClothes(
        id: $id
        amount: $amount
        branchName: $branchName
        clothesCode: $clothesCode
        clothesColor: $clothesColor
        clothesDescription: $clothesDescription
        clothesImage: $clothesImage
        clothesName: $clothesName
        clothesSize: $clothesSize
        clothesStatus: $clothesStatus
        clothesTypeId: $clothesTypeId
        countryName: $countryName
        impTime: $impTime
        parentId: $parentId
        price: $price
        requestDescription: $requestDescription
        requestStatus: $requestStatus
        requestTime: $requestTime
        vat: $vat
        username: $username
      ) {
        success
      }
    }
  `,
    DELETE_CLOTHES: `
    mutation DeleteClothes($id: Long) {
      deleteClothes(id: $id) {
        success
      }
    }
  `,

};
interface CreateClothesInput {
    amount: number;
    branchName: string;
    clothesCode: string;
    clothesColor: string;
    clothesDescription: string;
    clothesImage: string;
    clothesName: string;
    clothesSize: string;
    clothesStatus: string;
    clothesTypeId: number;
    countryName: string;
    impTime: string | null;
    parentId: string | null;
    price: number;
    requestDescription: string;
    requestStatus: string;
    requestTime: string | null;
    username: string;
    vat: number;
}

export const createClothes = async (input: CreateClothesInput) => {
    // Filter out null, undefined, empty string, and NaN values from the input object
    const filteredInput = Object.fromEntries(
        Object.entries(input).filter(([, value]) => value != null && value !== "" && !Number.isNaN(value))
    );

    console.log("Filtered input:", filteredInput); // Debug log to check the filtered result

    try {
        const res = await api.mutate(ClothesMutations.CREATE_CLOTHES, filteredInput);
        return res;
    } catch (error) {
        const axiosError = error as AxiosError;

        // Now you can safely access 'response' and 'responseText'
        if (axiosError.response) {
            console.error('Error createClothes :', axiosError.response.data);
        } else {
            console.error('Error createClothes:', axiosError.message);
        }
        throw error;
    }
};
export const fetchClothes = async () => {
    try {
        const res = await api.query(ClothesQueries.GET_CLOTHES);
        return res;
    } catch (error) {
        const axiosError = error as AxiosError;

        // Now you can safely access 'response' and 'responseText'
        if (axiosError.response) {
            console.error('Error fetchClothes :', axiosError.response.data);
        } else {
            console.error('Error fetchClothes:', axiosError.message);
        }
        throw error;
    }
};

export const fetchClothesById = async (id: number) => {
    try {
        const res = await api.query(ClothesQueries.GET_CLOTHES_BY_ID, { id });
        return res;
    } catch (error) {
        const axiosError = error as AxiosError;

        // Now you can safely access 'response' and 'responseText'
        if (axiosError.response) {
            console.error('Error fetchClothesById :', axiosError.response.data);
        } else {
            console.error('Error fetchClothesById:', axiosError.message);
        }
        throw error;
    }
};

export const updateClothes = async (
    id: number,
    input: CreateClothesInput,
    token: string
) => {
    try {
        const res = await api.mutate(ClothesMutations.UPDATE_CLOTHES, { id, ...input }, token);
        return res;
    } catch (error) {
        const axiosError = error as AxiosError;

        // Now you can safely access 'response' and 'responseText'
        if (axiosError.response) {
            console.error('Error updateClothes :', axiosError.response.data);
        } else {
            console.error('Error updateClothes:', axiosError.message);
        }
        throw error;
    }
};

export const deleteClothes = async (id: number, token: string) => {
    try {
        const res = await api.mutate(ClothesMutations.DELETE_CLOTHES, { id }, token);
        return res;
    } catch (error) {
        const axiosError = error as AxiosError;

        // Now you can safely access 'response' and 'responseText'
        if (axiosError.response) {
            console.error('Error deleteClothes :', axiosError.response.data);
        } else {
            console.error('Error deleteClothes:', axiosError.message);
        }
        throw error;
    }
};
