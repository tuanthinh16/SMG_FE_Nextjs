'use client'
import React, { useEffect, useState } from 'react';
import { createClothes } from '../api/clothes';
import UsernameComponent from '../lib/processToken';
import { DateTimeHelper } from '../lib/DateTimeHelper';
import { uploadMultipleImages } from '../api/uploadImage';
import { CLOTHES_TYPE } from '../models/ClothesType';
import { getClothesTypes } from '../api/clothes-type';
import { getDataFromDB, saveDataToDB } from '../lib/indexDB';
import Alert from '../lib/alert';



const ImportForm = () => {
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertColor, setAlertColor] = useState('green');
    const [clothesType, setClothesType] = useState<CLOTHES_TYPE[]>([]);
    const [formData, setFormData] = useState({
        amount: '',
        branchName: '',
        clothesCode: '',
        clothesColor: '',
        clothesDescription: '',
        clothesImage: '',
        clothesName: '',
        clothesSize: '',
        clothesStatus: '',
        clothesTypeId: '',
        countryName: '',
        impTime: '',
        parentId: '',
        price: '',
        requestDescription: '',
        requestStatus: '',
        requestTime: '',
        username: '',
        vat: '',
    });
    const fetchDataClothesType = async () => {
        // Check if data exists in IndexedDB
        const storedClothesTypes = await getDataFromDB('clothesTypes');
        if (storedClothesTypes.length > 0) {
            console.log('Data fetched from IndexedDB');
            setClothesType(storedClothesTypes);
        } else {
            // Fetch data from server
            const clothesType = await getClothesTypes();
            console.log('Data fetched from server');
            setClothesType(clothesType['clothesTypes']);
            // Save data to IndexedDB
            await saveDataToDB('clothesTypes', clothesType['clothesTypes']);
        }
    };
    useEffect(() => {


        fetchDataClothesType();
    }, []);
    const username = UsernameComponent();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    // upload file 
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFiles(event.target.files);
        }
    };

    const handleUpload = async () => {
        if (!selectedFiles) {
            setAlertMessage("Không có ảnh để upload!");
            setAlertVisible(true);
            setAlertColor('red');
            setTimeout(() => {
                setAlertVisible(false);
            }, 5000);
            return;
        }
        const urls = await uploadMultipleImages(selectedFiles, "CLOTHES");
        if (urls) setImageUrls(urls);
    };
    // handle sumbit 
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleUpload();
        try {
            const input = {
                amount: parseFloat(formData.amount),
                branchName: formData.branchName,
                clothesCode: formData.clothesCode,
                clothesColor: formData.clothesColor,
                clothesDescription: formData.clothesDescription,
                clothesImage: imageUrls.join(";"),
                clothesName: formData.clothesName,
                clothesSize: formData.clothesSize,
                clothesStatus: formData.clothesStatus,
                clothesTypeId: parseInt(formData.clothesTypeId),
                countryName: formData.countryName,
                impTime: DateTimeHelper.dateToTimeNumber(formData.impTime),
                parentId: formData.parentId,
                price: parseFloat(formData.price),
                requestDescription: formData.requestDescription,
                requestStatus: "Chưa Duyệt",
                requestTime: DateTimeHelper.dateToTimeNumber(new Date().toISOString()),
                username: username,
                vat: parseFloat(formData.vat),
            };
            const result = await createClothes(input);
            console.log('CreateClothes result:', result);
            // Hiển thị thông báo thành công
            setAlertMessage("Xử lý thành công!");
            setAlertVisible(true);
            setAlertColor('green');
            // Tự động ẩn thông báo sau 2 giây
            setTimeout(() => {
                setAlertVisible(false);
            }, 2000);
        } catch (error) {
            setAlertMessage("Xử lý thất bại!");
            setAlertVisible(true);
            setAlertColor('red');
            setTimeout(() => {
                setAlertVisible(false);
            }, 5000);
            console.error('Error creating clothes:', error);
        }
    };

    return (
        <div className="container h-svh m-auto p-6 bg-white shadow-lg rounded-lg">
            {/* Hiển thị thông báo snackbar nếu có */}
            <Alert visible={alertVisible} message={alertMessage} color={alertColor} />
            <h1 className="text-3xl font-bold mb-6 text-center">Create Clothes</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* tên - mã */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1">
                        <label className="block text-gray-700 capitalize">Mã</label>
                        <input
                            type="text"
                            name="clothesCode"
                            required
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="md:col-span-3">
                        <label className="block text-gray-700 capitalize">Tên</label>
                        <input
                            type="text"
                            name="clothesName"
                            required
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>
                {/* hãng - quốc gia- màu  */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-gray-700 capitalize">Hãng</label>
                        <input
                            type="text"
                            name="branchName"
                            required
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 capitalize">Quốc gia</label>
                        <input
                            type="text"
                            name="countryName"
                            required
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 capitalize">Màu</label>
                        <input
                            type="text"
                            name="clothesColor"
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>
                {/* số lượng - giá - VAT - thời gian nhập */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <label className="block text-gray-700 capitalize">Số lượng</label>
                        <input
                            type="number"
                            name="amount"
                            required
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 capitalize">Giá</label>
                        <input
                            type="text"
                            name="price"
                            required
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 capitalize">VAT</label>
                        <input
                            type="text"
                            name="vat"
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 capitalize">Thời gian nhập</label>
                        <input
                            type="datetime-local"
                            name="impTime"
                            required
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>
                {/* mô tả - hình ảnh - kích thước - trạng thái */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-gray-700 capitalize">Mô tả</label>
                        <textarea
                            name="clothesDescription"
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-gray-700 capitalize">Hình ảnh</label>
                        <input
                            type="file"
                            name="clothesImage"

                            multiple onChange={handleFileChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 capitalize">Kích thước</label>
                        <input
                            type="text"
                            name="clothesSize"
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 capitalize">Trạng thái</label>
                        <input
                            type="text"
                            name="clothesStatus"
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>
                {/* loại quần áo - parentId - requestDescription - requestStatus - requestTime - username */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-gray-700 capitalize">Loại quần áo</label>
                        <select
                            name="clothesTypeId"
                            required
                            onChange={handleChange}
                            value={formData.clothesTypeId}
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            <option value="">Chọn loại quần áo</option>
                            {clothesType?.map((type) => (
                                <option key={type.ID} value={type.ID}>
                                    {type.CLOTHES_TYPE_NAME}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 capitalize">Parent ID</label>
                        <input
                            type="text"
                            name="parentId"
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    {/* <div>
                        <label className="block text-gray-700 capitalize">Request Description</label>
                        <input
                            type="text"
                            name="requestDescription"
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div> */}
                    <div>
                        <label className="block text-gray-700 capitalize">Request Status</label>
                        <input
                            type="text"
                            name="requestStatus"
                            disabled
                            value="Chưa duyệt"
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    {/* <div>
                        <label className="block text-gray-700 capitalize">Request Time</label>
                        <input
                            type="datetime-local"
                            name="requestTime"
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div> */}
                    <div>
                        <label className="block text-gray-700 capitalize">Username</label>
                        <input
                            type="text"
                            name="username"
                            disabled
                            value={username}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>
                {/* button lưu  */}
                <div className="text-center">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ImportForm;