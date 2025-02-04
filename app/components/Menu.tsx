'use client'
import React, { useEffect, useRef, useState } from 'react';
import { fetchPlugins } from '../api/plugins-query';
import { PLUGINS } from '../models/Plugins';
import { getDataFromDB, saveOrUpdateDataInDB } from '../lib/indexDB';



interface MenuProps {
    onPluginClick: (plugin: PLUGINS | undefined) => void;
    selectedPluginID: number | null;
}
const Menu: React.FC<MenuProps> = ({ onPluginClick, selectedPluginID }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPluginId, setSelectedPluginId] = useState<number | null>(selectedPluginID);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    const [plugins, setPlugins] = useState<PLUGINS[]>([]);
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
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {


        fetchData();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setIsOpen(false);
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
    }, [isOpen, setIsOpen]);
    function handleClickPlugins(plugin: PLUGINS | undefined): void {
        setSelectedPluginId(plugin?.ID || null);
        console.log(plugin?.ID);
        onPluginClick(plugin);
    }

    return (
        <div ref={modalRef} className='z-50 '>
            <button
                className="md:hidden fixed top-4 right-2 p-2 rounded"
                onClick={toggleMenu}
            >
                {isOpen ? (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
                </svg>

                ) : (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
                </svg>
                )}

                <span className="absolute text-xs bottom-[-20px] left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {isOpen ? 'Close Menu' : 'Open Menu'}
                </span>
            </button>
            <div className={`bg-gradient-to-br from-blue-600 to-teal-500 bg-opacity-60 text-white w-30 md:w-64 p-4 h-screen shadow-md fixed md:relative ${isOpen ? 'block absolute right-0' : 'hidden'} md:block`}>
                <nav>
                    <ul className="space-y-4">
                        {plugins?.map((plugin: PLUGINS, index: number) => (
                            <li key={index}>
                                <button
                                    onClick={() => handleClickPlugins(plugin)}
                                    className={`md:text-gray-50 flex gap-3 hover:animate-pulse hover:font-bold hover:translate-x-2 ${selectedPluginId === plugin.ID && 'animate-pulse'}`}
                                >
                                    {(selectedPluginId === plugin.ID || (plugin.ID == 0 && selectedPluginID == 0)) && (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                            <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                                        </svg>
                                    )}

                                    {plugin.PLUGIN_NAME}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Menu;