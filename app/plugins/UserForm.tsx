'use client'
import { useEffect, useState } from "react";
import { DateTimeHelper } from "../lib/DateTimeHelper";
import { User } from "../models/User";
import { fetchUsers } from "../api/user-query";
import Loading from "../components/Loading";

interface UserInfoProps {
    usersData: User[];
}

export const UserInfo: React.FC<UserInfoProps> = () => {
    const [usersData, setUsersData] = useState<User[]>([]);
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