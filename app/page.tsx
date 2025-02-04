'use client'
import { useState } from "react";
import Menu from "./components/Menu";
import { PLUGINS } from "./models/Plugins";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import React from "react";
import ListPluginsForm from "./plugins/ListPluginsForm";





export default function Home() {

  const [currentForm, setCurrentForm] = useState<React.ComponentType | null>(null);
  const [selectedPluginID, setSelectedPluginID] = useState<number | null>(0);

  const nav = useRouter();

  function handlePluginClick(plugin: PLUGINS | undefined): void {
    try {
      if (!plugin) return;
      const link = plugin?.PLUGIN_LINK?.split('.').pop();
      if (plugin?.PLUGIN_TYPE_ID === 1 && link) {
        const formName = link.charAt(0).toUpperCase() + link.slice(1) + 'Form';

        // Dynamically import the form component
        const FormComponent = dynamic(() => import(`./plugins/${formName}`).catch(() => {
          console.error(`Form component ${formName} not found`);
          return import("./components/NotFound"); // Fallback component
        }));
        setCurrentForm(() => FormComponent);
        setSelectedPluginID(plugin?.ID ?? null);
      } else if (link) {
        nav.push('/' + link.toLowerCase());
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">

      <div className="flex flex-1">
        <Menu onPluginClick={handlePluginClick} selectedPluginID={selectedPluginID} />
        <main className="flex-1 bg-gray-50 p-4">
          <div className="container mx-auto">
            {currentForm ? React.createElement(currentForm) : <ListPluginsForm />}
          </div>
        </main>
      </div>

    </div>
  );
}