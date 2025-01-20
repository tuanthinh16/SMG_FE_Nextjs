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

// Lưu hoặc cập nhật dữ liệu vào IndexedDB
interface Item {
    id?: number;
    [key: string]: unknown;
}

const saveOrUpdateDataInDB = async (storeName: string, data: Item[]) => {
    const db = await openDatabase();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);

    for (const item of data) {
        if (typeof item === 'object' && item !== null) {
            const normalizedItem = { ...item, id: item.id || item.ID }; // Lấy id từ ID nếu không có
            if (normalizedItem.id !== undefined) {
                const existingItem = (normalizedItem.id !== null && normalizedItem.id !== undefined) ? await store.get(normalizedItem.id as IDBValidKey) : null;
                if (existingItem) {
                    const updatedItem = { ...existingItem, ...normalizedItem };
                    console.log(`Updating item in ${storeName}:`, updatedItem);
                    await store.put(updatedItem);
                } else {
                    console.log(`Adding new item to ${storeName}:`, normalizedItem);
                    await store.put(normalizedItem);
                }
            } else {
                console.error(`Item id is undefined after normalization:`, item);
            }
        } else {
            console.error(`Invalid item (not an object or null):`, item);
        }
    }

    await tx.done;
    console.log(`Data saved or updated in ${storeName}`);
};


// Lấy dữ liệu từ IndexedDB
const getDataFromDB = async (storeName: string) => {
    const db = await openDatabase();
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const allItems = await store.getAll(); // Lấy tất cả các mục
    console.log(`Data fetched from ${storeName}:`, allItems); // Debug log
    return allItems;
};

// Xóa hết dữ liệu để cập nhật mới
const clearDataInDB = async (storeName: string) => {
    const db = await openDatabase();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await store.clear(); // Xóa tất cả các mục trong store
    await tx.done;
    console.log(`All data cleared from ${storeName}`);
};

// Cập nhật dữ liệu nếu đã có hoặc lưu mới nếu chưa có
const updateDataInDB = async (storeName: string, newData: Item[]) => {
    try {
        const db = await openDatabase();
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);

        for (const item of newData) {
            if (typeof item === 'object' && item !== null && item.id !== undefined) {
                const existingItem = (item.id !== null && item.id !== undefined) ? await store.get(item.id as IDBValidKey) : null;
                if (existingItem) {
                    // Update nếu tồn tại
                    const updatedItem = { ...existingItem, ...item };
                    console.log(`Updating item in ${storeName}:`, updatedItem);
                    await store.put(updatedItem);
                } else {
                    // Thêm mới nếu chưa có
                    console.log(`Adding new item to ${storeName}:`, item);
                    await store.put(item);
                }
            } else {
                console.error(`Invalid or undefined id for item:`, item);
            }
        }

        await tx.done;
        console.log(`Store ${storeName} updated with new data.`);
    } catch (error) {
        console.error(`Error updating data in ${storeName}:`, error);
    }
};

export { saveOrUpdateDataInDB, getDataFromDB, clearDataInDB, updateDataInDB };
