import jwtDecode from "jsonwebtoken";

const getUsernameFromToken = () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
        console.error("Token không tồn tại.");
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

export default UsernameComponent;
