import React, { useEffect, useState } from 'react';

interface AlertProps {
    visible: boolean;
    message: string;
    color: string;
}

const Alert: React.FC<AlertProps> = ({ visible, message, color }) => {
    const [isVisible, setIsVisible] = useState(visible);

    useEffect(() => {
        if (visible) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [visible]);

    if (!isVisible) return null;

    return (
        <div style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: color,
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            zIndex: 1000
        }}>
            {message}
        </div>
    );
};

export default Alert;