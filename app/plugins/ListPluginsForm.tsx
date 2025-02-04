'use client'
import React, { useEffect, useRef, useState } from 'react';
import { createPlugin, deletePlugin, fetchPlugins, updatePlugin } from '../api/plugins-query';
import { PLUGINS } from '../models/Plugins';
import { clearDataInDB, getDataFromDB, saveOrUpdateDataInDB } from '../lib/indexDB';
import { useSession } from 'next-auth/react';
import Alert from '../lib/alert';




const ListrowsPerPage = [1, 5, 10, 15, 20, 25, 50, 100];
const Modal = ({ isOpen, onClose, children }: { isOpen: boolean, onClose: () => void, children: React.ReactNode }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg md:w-1/2 w-[300px]">

                {children}
            </div>
        </div>
    );
};

const ListPluginsForm = () => {
    //Oject state
    const [plugins, setPlugins] = useState<PLUGINS[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlugin, setEditingPlugin] = useState<PLUGINS | null>(null);
    // Sort and pagging state 
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortField, setSortField] = useState("ID");
    const [sortOrder, setSortOrder] = useState("asc");
    // Alert state
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertColor, setAlertColor] = useState('green');
    //Token
    const { data: session } = useSession();
    const token = session?.accessToken;

    //Function
    const fetchData = async () => {
        // Check if data exists in IndexedDB
        const storedPlugins = await getDataFromDB('plugins');
        if (storedPlugins.length > 0) {
            console.log('Data fetched from IndexedDB');
            setPlugins(storedPlugins);
        } else {
            // Fetch data from server
            const plugin = await fetchPlugins();
            console.log('Data fetched from server');
            const defaultPlugin: PLUGINS = {
                ID: 0,
                PLUGIN_NAME: "List Plugins",
                PLUGIN_LINK: "SMG.Plugins.ListPlugins",
                IS_ACTIVE: true,
                ICON: undefined,
                PLUGIN_TYPE_ID: 1,
                PLUGIN_GROUP_ID: 1,
            };

            const allPlugins = [defaultPlugin, ...plugin['plugins']];
            setPlugins(allPlugins);
            // Save data to IndexedDB
            await saveOrUpdateDataInDB('plugins', allPlugins);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    const handleSort = (field: keyof PLUGINS) => {
        const newSortOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortOrder(newSortOrder);

        const sortedPlugins = [...plugins].sort((a, b) => {
            const valueA = a[field] ?? ""; // Giá trị mặc định nếu undefined
            const valueB = b[field] ?? ""; // Giá trị mặc định nếu undefined

            if (newSortOrder === "asc") return valueA > valueB ? 1 : -1;
            return valueA < valueB ? 1 : -1;
        });

        setPlugins(sortedPlugins);
    };


    const handleEdit = (plugin: PLUGINS) => {
        setEditingPlugin(plugin);
    };

    const handleSave = async () => {
        try {
            if (editingPlugin === null) return;
            const updatedPlugin = await updatePlugin(editingPlugin.ID ?? 0, editingPlugin, token);
            setPlugins((prev) =>
                prev.map((plugin) =>
                    plugin.ID === editingPlugin.ID ? { ...plugin, ...updatedPlugin } : plugin
                )
            );
            setEditingPlugin(null);
            //Show alert
            setAlertVisible(true);
            setAlertMessage('Plugin updated successfully');
            setAlertColor('green');
            //Clear Data in IndexedDB
            clearDataInDB('plugins');
            //Refetch data
            fetchData();
        } catch (error) {
            setAlertVisible(true);
            setAlertMessage('Plugin update Failed');
            setAlertColor('red');
            console.error("Failed to update plugin:", error);
        }
    };

    const handleDelete = (id: unknown) => {
        try {
            const cofirm = window.confirm('Are you sure you want to delete this plugin?. ID = ' + id);
            if (!cofirm || !id) return;
            setPlugins((prev) => prev.filter((plugin) => plugin.ID !== id));
            deletePlugin(id as number, token);
            clearDataInDB('plugins');
            //Show alert
            setAlertVisible(true);
            setAlertMessage('Plugin delete successfully');
            setAlertColor('green');

            fetchData();
        } catch (error) {
            setAlertVisible(true);
            setAlertMessage('Plugin delete Failed');
            setAlertColor('red');
            console.error("Failed to delete plugin:", error);
        }

    };

    const handleAddPlugin = (newPlugin: PLUGINS) => {
        try {
            setPlugins([...plugins, newPlugin]);
            setIsModalOpen(false);
            createPlugin(newPlugin, token);
            clearDataInDB('plugins');
            //Show alert
            setAlertVisible(true);
            setAlertMessage('Plugin create successfully');
            setAlertColor('green');
            fetchData();
        } catch (error) {
            setAlertVisible(true);
            setAlertMessage('Plugin create Failed');
            setAlertColor('red');
            console.error("Failed to create plugin:", error);
        }

    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setEditingPlugin((prev) => prev ? ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }) : prev);
    };

    const paginatedPlugins = plugins.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );
    return (
        <div className="container mx-auto p-2 md:p-6 bg-white shadow-lg rounded-lg">
            <Alert visible={alertVisible} message={alertMessage} color={alertColor} />
            <div className='flex justify-between items-center mb-6 w-[300px] md:w-full'>
                <h1 className="text-3xl font-bold mb-6 text-center">List Plugins</h1>
                <div className="flex justify-end mb-4">
                    <button
                        className="group cursor-pointer outline-none hover:rotate-90 duration-300 text-sm"
                        title="Add New"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <svg
                            className="stroke-teal-500 fill-none group-hover:fill-teal-800 group-active:stroke-teal-200 group-active:fill-teal-600 group-active:duration-0 duration-300"
                            viewBox="0 0 24 24"
                            height="50px"
                            width="50px"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeWidth="1.5"
                                d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                            ></path>
                            <path strokeWidth="1.5" d="M8 12H16"></path>
                            <path strokeWidth="1.5" d="M12 16V8"></path>
                        </svg>
                    </button>
                </div>

            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <AddPluginForm onAdd={handleAddPlugin} />
            </Modal>
            <div className="p-2 overflow-x-auto w-[320px] md:w-full">

                <table className=" bg-white border border-gray-200 rounded-lg min-w-full">
                    <thead>
                        <tr className="bg-gray-800 text-white">
                            <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort("ID")}>
                                ID {sortField === "ID" && (sortOrder === "asc" ? "↑" : "↓")}
                            </th>
                            <th
                                className="py-3 px-4 cursor-pointer"
                                onClick={() => handleSort("PLUGIN_NAME")}
                            >
                                Plugin Name {sortField === "PLUGIN_NAME" && (sortOrder === "asc" ? "↑" : "↓")}
                            </th>
                            <th
                                className="py-3 px-4 cursor-pointer"
                            // onClick={() => handleSort("PLUGIN_LINK")}
                            >
                                Plugin Link {sortField === "PLUGIN_LINK" && (sortOrder === "asc" ? "↑" : "↓")}
                            </th>
                            <th
                                className="py-3 px-4 cursor-pointer"
                                onClick={() => handleSort("PLUGIN_TYPE_ID")}
                            >
                                Plugin Type ID
                            </th>
                            <th
                                className="py-3 px-4 cursor-pointer"
                            // onClick={() => handleSort("PLUGIN_LINK")}
                            >
                                Plugin Group ID
                            </th>
                            <th
                                className="py-3 px-4 cursor-pointer"
                                onClick={() => handleSort("IS_ACTIVE")}
                            >
                                Is Active {sortField === "IS_ACTIVE" && (sortOrder === "asc" ? "↑" : "↓")}
                            </th>
                            <th className="py-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedPlugins.map((plugin) => (
                            <tr key={plugin.ID} className={`border-t ${plugin.ID == 0 ? 'bg-gray-200' : ''} ${!plugin.IS_ACTIVE && 'text-red-400'}`}>
                                <td className="py-2 px-4">{plugin.ID}</td>
                                <td className="py-2 px-4">
                                    {editingPlugin && editingPlugin.ID === plugin.ID ? (
                                        <input
                                            type="text"
                                            name="PLUGIN_NAME"
                                            value={editingPlugin.PLUGIN_NAME}
                                            onChange={handleChange}
                                            className="border rounded w-full"
                                        />
                                    ) : (
                                        plugin.PLUGIN_NAME
                                    )}
                                </td>
                                <td className="py-2 px-4">
                                    {editingPlugin && editingPlugin.ID === plugin.ID ? (
                                        <input
                                            type="text"
                                            name="PLUGIN_LINK"
                                            value={editingPlugin.PLUGIN_LINK}
                                            onChange={handleChange}
                                            className="border rounded w-full"
                                        />
                                    ) : (
                                        <span
                                            // href={plugin.PLUGIN_LINK}
                                            className=""
                                        >
                                            {plugin.PLUGIN_LINK}
                                        </span>
                                    )}
                                </td>
                                <td>
                                    {editingPlugin && editingPlugin.ID === plugin.ID ? (
                                        <input
                                            type="text"
                                            name="PLUGIN_TYPE_ID"
                                            value={editingPlugin.PLUGIN_TYPE_ID}
                                            onChange={handleChange}
                                            className="border rounded w-full"
                                        />
                                    ) : (
                                        <span
                                            // href={plugin.PLUGIN_LINK}
                                            className=""
                                        >
                                            {plugin.PLUGIN_TYPE_ID}
                                        </span>
                                    )}
                                </td>
                                <td>
                                    {editingPlugin && editingPlugin.ID === plugin.ID ? (
                                        <input
                                            type="text"
                                            name="PLUGIN_GROUP_ID"
                                            value={editingPlugin.PLUGIN_GROUP_ID}
                                            onChange={handleChange}
                                            className="border rounded w-full"
                                        />
                                    ) : (
                                        <span
                                            // href={plugin.PLUGIN_LINK}
                                            className=""
                                        >
                                            {plugin.PLUGIN_GROUP_ID}
                                        </span>
                                    )}
                                </td>
                                <td className="py-2 px-4">
                                    {editingPlugin && editingPlugin.ID === plugin.ID ? (
                                        <input
                                            type="checkbox"
                                            name="IS_ACTIVE"
                                            checked={editingPlugin.IS_ACTIVE}
                                            onChange={handleChange}
                                        />
                                    ) : plugin.IS_ACTIVE ? (
                                        "Yes"
                                    ) : (
                                        "No"
                                    )}
                                </td>
                                <td className="py-2 px-4 space-x-2">
                                    {plugin.ID == 0 ? null : (editingPlugin && editingPlugin.ID === plugin.ID ? (
                                        <>
                                            {/* Save button */}
                                            <button
                                                title='Save'
                                                onClick={handleSave}
                                                className="text-light-blue-light hover:text-black dark:text-gray-400 border-2 inline-flex items-center mr-4 last-of-type:mr-0 p-2.5 border-transparent bg-light-secondary shadow-button-flat-nopressed hover:border-2 hover:shadow-button-flat-pressed focus:opacity-100 focus:outline-none active:border-2 active:shadow-button-flat-pressed font-medium rounded-full text-sm text-center dark:bg-button-curved-default-dark dark:shadow-button-curved-default-dark dark:hover:bg-button-curved-pressed-dark dark:hover:shadow-button-curved-pressed-dark dark:active:bg-button-curved-pressed-dark dark:active:shadow-button-curved-pressed-dark dark:focus:bg-button-curved-pressed-dark dark:focus:shadow-button-curved-pressed-dark dark:border-0"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                                </svg>

                                            </button>
                                            <button
                                                title='Cancel'
                                                onClick={() => setEditingPlugin(null)}
                                                className="text-light-blue-light hover:text-black dark:text-gray-400 border-2 inline-flex items-center mr-4 last-of-type:mr-0 p-2.5 border-transparent bg-light-secondary shadow-button-flat-nopressed hover:border-2 hover:shadow-button-flat-pressed focus:opacity-100 focus:outline-none active:border-2 active:shadow-button-flat-pressed font-medium rounded-full text-sm text-center dark:bg-button-curved-default-dark dark:shadow-button-curved-default-dark dark:hover:bg-button-curved-pressed-dark dark:hover:shadow-button-curved-pressed-dark dark:active:bg-button-curved-pressed-dark dark:active:shadow-button-curved-pressed-dark dark:focus:bg-button-curved-pressed-dark dark:focus:shadow-button-curved-pressed-dark dark:border-0"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                                                </svg>
                                            </button>
                                        </>
                                    ) : (
                                        <div className='flex gap-1'>
                                            {/* Edit button  */}
                                            <button
                                                title='Edit'
                                                onClick={() => handleEdit(plugin)}
                                                className="text-light-blue-light hover:text-black dark:text-gray-400 border-2 inline-flex items-center mr-4 last-of-type:mr-0 p-2.5 border-transparent bg-light-secondary shadow-button-flat-nopressed hover:border-2 hover:shadow-button-flat-pressed focus:opacity-100 focus:outline-none active:border-2 active:shadow-button-flat-pressed font-medium rounded-full text-sm text-center dark:bg-button-curved-default-dark dark:shadow-button-curved-default-dark dark:hover:bg-button-curved-pressed-dark dark:hover:shadow-button-curved-pressed-dark dark:active:bg-button-curved-pressed-dark dark:active:shadow-button-curved-pressed-dark dark:focus:bg-button-curved-pressed-dark dark:focus:shadow-button-curved-pressed-dark dark:border-0"
                                            >

                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                                    <path d="M3 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM8.5 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM15.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
                                                </svg>

                                            </button>
                                            {/* Delete Button  */}
                                            <button
                                                title='Delete'
                                                onClick={() => handleDelete(plugin.ID)}
                                                className="text-light-blue-light hover:text-black dark:text-gray-400 border-2 inline-flex items-center mr-4 last-of-type:mr-0 p-2.5 border-transparent bg-light-secondary shadow-button-flat-nopressed hover:border-2 hover:shadow-button-flat-pressed focus:opacity-100 focus:outline-none active:border-2 active:shadow-button-flat-pressed font-medium rounded-full text-sm text-center dark:bg-button-curved-default-dark dark:shadow-button-curved-default-dark dark:hover:bg-button-curved-pressed-dark dark:hover:shadow-button-curved-pressed-dark dark:active:bg-button-curved-pressed-dark dark:active:shadow-button-curved-pressed-dark dark:focus:bg-button-curved-pressed-dark dark:focus:shadow-button-curved-pressed-dark dark:border-0"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                                    <path fillRule="evenodd" d="M7.22 3.22A.75.75 0 0 1 7.75 3h9A2.25 2.25 0 0 1 19 5.25v9.5A2.25 2.25 0 0 1 16.75 17h-9a.75.75 0 0 1-.53-.22L.97 10.53a.75.75 0 0 1 0-1.06l6.25-6.25Zm3.06 4a.75.75 0 1 0-1.06 1.06L10.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L12 8.94l-1.72-1.72Z" clipRule="evenodd" />
                                                </svg>

                                            </button>
                                        </div>
                                    ))}
                                    { }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-between items-center mt-4">

                    <div className='flex items-center'>
                        <span className='hidden md:block'>Row per page</span>
                        <select
                            value={rowsPerPage}
                            onChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setCurrentPage(1); // Reset to the first page
                            }}
                            className="p-2 border border-gray-300 rounded mx-2"
                        >
                            {ListrowsPerPage.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <span>
                        Page {currentPage} of {Math.ceil(plugins.length / rowsPerPage)}
                    </span>
                    <div className='space-x-2'>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            className="px-4 py-2 bg-gray-300 rounded"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                <path fillRule="evenodd" d="M4.72 9.47a.75.75 0 0 0 0 1.06l4.25 4.25a.75.75 0 1 0 1.06-1.06L6.31 10l3.72-3.72a.75.75 0 1 0-1.06-1.06L4.72 9.47Zm9.25-4.25L9.72 9.47a.75.75 0 0 0 0 1.06l4.25 4.25a.75.75 0 1 0 1.06-1.06L11.31 10l3.72-3.72a.75.75 0 0 0-1.06-1.06Z" clipRule="evenodd" />
                            </svg>

                        </button>
                        <button
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(prev + 1, Math.ceil(plugins.length / rowsPerPage))
                                )
                            }
                            className="px-4 py-2 bg-gray-300 rounded"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                <path fillRule="evenodd" d="M15.28 9.47a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L13.69 10 9.97 6.28a.75.75 0 0 1 1.06-1.06l4.25 4.25ZM6.03 5.22l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L8.69 10 4.97 6.28a.75.75 0 0 1 1.06-1.06Z" clipRule="evenodd" />
                            </svg>

                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ListPluginsForm;


export const AddPluginForm = ({ onAdd }: { onAdd: (plugin: PLUGINS) => void }) => {
    const [plugin, setPlugin] = useState<PLUGINS>({
        ID: undefined,
        PLUGIN_LINK: '',
        PLUGIN_NAME: '',
        IS_ACTIVE: false,
        ICON: '',
        PLUGIN_TYPE_ID: undefined,
        PLUGIN_GROUP_ID: undefined,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPlugin({
            ...plugin,
            [name]: name === 'IS_ACTIVE' ? (e.target as HTMLInputElement).checked : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newPlugin = { ...plugin }; // Assign a unique ID

        onAdd(newPlugin);
        setPlugin({
            ID: undefined,
            PLUGIN_LINK: '',
            PLUGIN_NAME: '',
            IS_ACTIVE: false,
            ICON: '',
            PLUGIN_TYPE_ID: undefined,
            PLUGIN_GROUP_ID: undefined,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h1 className='text-center text-lg font-semibold'>Add Plugins</h1>
            <div>
                <label className="block text-gray-700">Plugin Name</label>
                <input
                    type="text"
                    name="PLUGIN_NAME"
                    value={plugin.PLUGIN_NAME}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <div>
                <label className="block text-gray-700">Plugin Link</label>
                <input
                    type="text"
                    name="PLUGIN_LINK"
                    value={plugin.PLUGIN_LINK}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <div className='text-left flex gap-3'>
                {/* <input
                    type="checkbox"
                    name="IS_ACTIVE"
                    checked={plugin.IS_ACTIVE}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                /> */}
                <input
                    type="checkbox"
                    name="IS_ACTIVE"
                    defaultChecked={plugin.IS_ACTIVE}
                    onChange={handleChange}
                    className={`form-checkbox h-5 w-5 text-blue-600 border border-gray-300 rounded-lg `}
                />
                <span className={`text-gray-800  `}>IS ACTIVE</span>

            </div>
            <div>
                <label className="block text-gray-700">Icon</label>
                <input
                    type="file"
                    name="ICON"
                    value={plugin.ICON}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div>
                <label className="block text-gray-700">Plugin Type ID</label>
                <input
                    type="number"
                    name="PLUGIN_TYPE_ID"
                    value={plugin.PLUGIN_TYPE_ID}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <div>
                <label className="block text-gray-700">Plugin Group ID</label>
                <input
                    type="number"
                    name="PLUGIN_GROUP_ID"
                    value={plugin.PLUGIN_GROUP_ID}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <button
                className="bg-white text-center w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group"
                type="submit"
            >
                <div
                    className="bg-green-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                        <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                    </svg>

                </div>
                <p className="translate-x-2">Create</p>
            </button>

        </form>
    );
};