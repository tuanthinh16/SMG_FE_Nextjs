import React from 'react';

interface AlertProps {
    visible: boolean;
    message: string;
    color: string;
}

const Alert: React.FC<AlertProps> = ({ visible, message, color }) => {
    if (!visible) return null;

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