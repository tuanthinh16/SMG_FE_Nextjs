'use client'
import { useEffect, useState } from "react";
import Menu from "./components/Menu";
import { fetchUsers } from "./api/user-query";
import { DateTimeHelper } from "./lib/DateTimeHelper";
import { PLUGINS } from "./models/Plugins";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import React from "react";
import Loading from "./components/Loading";

class User {
  ID: number | undefined;
  USERNAME: string | undefined;
  CREATE_TIME: string | undefined;
  ROLE: string | undefined;
  // Add other fields as needed
}

interface UserInfoProps {
  usersData: User[];
}

const UserInfo: React.FC<UserInfoProps> = ({ usersData }) => {

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{usersData.length} Employees</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {usersData?.map((user: User, index: number) => (
          <div
            key={index}
            className={`w-[350px] shadow rounded p-4 flex flex-col items-center ${user.ROLE == 'ADMIN' ? 'bg-gradient-to-br from-blue-500 to-green-700' : 'bg-white'}`}
          >
            <div className="h-16 w-16 bg-gray-300 rounded-full mb-4"></div>
            <h1>{user.USERNAME}</h1>
            <p className="text-sm text-green-500 italic">{user.CREATE_TIME ? DateTimeHelper.timeNumberToDate(user.CREATE_TIME.toString())?.toLocaleString() : 'N/A'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Home() {
  const [usersData, setUsersData] = useState<User[]>([]);
  const [currentForm, setCurrentForm] = useState<React.ComponentType | null>(null);


  const nav = useRouter();
  const fetchDataUser = async () => {
    // const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    // await delay(parseInt("2000"));
    const users = await fetchUsers();
    console.log(users);
    setUsersData(users['users']);
  };

  useEffect(() => {
    fetchDataUser();
  }, []);
  if (!usersData || usersData.length == 0) return <Loading />
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
        <Menu onPluginClick={handlePluginClick} />
        <main className="flex-1 bg-gray-50 p-4">
          <div className="container mx-auto">
            {currentForm ? React.createElement(currentForm) : <UserInfo usersData={usersData} />}
          </div>
        </main>
      </div>

    </div>
  );
}