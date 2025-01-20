import { openDB } from "idb";

// Tạo hoặc mở một IndexedDB database
const openDatabase = async () => {
    return openDB('clothesDB', 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('clothesTypes')) {
                db.createObjectStore('clothesTypes', { keyPath: 'id', autoIncrement: true });
            }
            if (!db.objectStoreNames.contains('plugins')) {
                db.createObjectStore('plugins', { keyPath: 'id', autoIncrement: true });
            }
        },
    });
};

// Lưu trữ dữ liệu vào IndexedDB
interface Item {
    id?: number;
    [key: string]: unknown;
}

const saveDataToDB = async (storeName: string, data: Item[]) => {
    const db = await openDatabase();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    data.forEach((item, index) => {
        if (typeof item === 'object' && item !== null) {
            const itemWithId = { ...item, id: item['id'] || index + Date.now() }; // Gán id nếu chưa có
            console.log(`Saving item to ${storeName}:`, itemWithId); // Debug log
            store.put(itemWithId);
        } else {
            console.error(`Invalid item (not an object or null):`, item);
        }
    });
    await tx.done;
    console.log(`Data saved to ${storeName}`);
};


// Lấy dữ liệu từ IndexedDB
const getDataFromDB = async (storeName: string) => {
    const db = await openDatabase();
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const allItems = await store.getAll(); // Lấy tất cả các item
    // console.log(`Data fetched from ${storeName}:`, allItems); // Debug log
    return allItems;
};
//Xóa hết dữ liệu để cập nhật mới
const clearDataInDB = async (storeName: string) => {
    const db = await openDatabase();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await store.clear(); // Xóa tất cả các mục trong store
    await tx.done;
    console.log(`All data cleared from ${storeName}`);
};
// cập nhật dữ liệu
const updateDataInDB = async (storeName: string, newData: Item[]) => {
    try {
        // Xóa tất cả dữ liệu cũ
        await clearDataInDB(storeName);
        console.log(`Store ${storeName} cleared.`);

        // Lưu dữ liệu mới
        await saveDataToDB(storeName, newData);
        console.log(`Store ${storeName} updated with new data.`);
    } catch (error) {
        console.error(`Error updating data in ${storeName}:`, error);
    }
};

export { saveDataToDB, getDataFromDB, clearDataInDB, updateDataInDB };