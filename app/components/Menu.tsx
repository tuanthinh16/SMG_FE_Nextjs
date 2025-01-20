'use client'
import React, { useEffect, useState } from 'react';
import { fetchPlugins } from '../api/plugins-query';
import { PLUGINS } from '../models/Plugins';
import { getDataFromDB, saveOrUpdateDataInDB } from '../lib/indexDB';



interface MenuProps {
    onPluginClick: (plugin: PLUGINS | undefined) => void;
}
const Menu: React.FC<MenuProps> = ({ onPluginClick }) => {
    const [isOpen, setIsOpen] = useState(false);

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
                PLUGIN_TYPE_ID: 1
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

    function handleClickPlugins(plugin: PLUGINS | undefined): void {
        onPluginClick(plugin);
    }

    return (
        <div>
            <button
                className="md:hidden fixed top-4 right-4 p-2 rounded"
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
            <aside className={` w-30 md:w-64 p-4 h-screen shadow-md fixed md:relative ${isOpen ? 'block absolute right-0' : 'hidden'} md:block`}>
                <nav>
                    <ul className="space-y-4">
                        {plugins?.map((plugin: PLUGINS, index: number) => (
                            <li key={index}><button onClick={() => handleClickPlugins(plugin)} className="text-gray-700 hover:text-blue-500 hover:font-bold hover:translate-x-2">
                                {plugin.PLUGIN_NAME}
                            </button></li>
                        ))}

                    </ul>
                </nav>
            </aside>
        </div>
    );
};

export default Menu;