import Api from "./api";
const api = new Api();

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
        console.error('Error creating clothes:', error);
        throw error;
    }
};
