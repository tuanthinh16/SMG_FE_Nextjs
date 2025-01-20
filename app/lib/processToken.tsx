import jwtDecode from "jsonwebtoken";
import { useSession } from "next-auth/react";

const getUsernameFromToken = () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
        console.log("Token không tồn tại.");
        return null;
    }

    try {
        // Giải mã token
        const decodedToken = jwtDecode.decode(token) as { sub?: string };

        // Kiểm tra và trả về username
        return decodedToken?.sub || null;
    } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
        return null;
    }
};

const UsernameComponent = () => {
    const username = getUsernameFromToken();

    return username || "Không tìm thấy username";
};

const useTokenFromCookies = () => {
    const { data: session, status } = useSession();
    if (status === "loading") {
        return null;
    }
    const token = session;
    return token;
};

const useUsernameFromCookiesToken = () => {
    const tokenData = useTokenFromCookies();
    const token = tokenData?.accessToken;

    if (!token) {
        // console.log("Token không tồn tại.");
        const username = tokenData?.user?.name;
        return username;
    }

    try {
        // Giải mã token
        const decodedToken = jwtDecode.decode(token) as { sub?: string };

        // Kiểm tra và trả về username
        return decodedToken?.sub || null;
    } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
        return null;
    }
};

const useTokenFromCookiesTokenHook = () => {
    const token = useTokenFromCookies();
    return token;
};

export { UsernameComponent, useUsernameFromCookiesToken, useTokenFromCookiesTokenHook };