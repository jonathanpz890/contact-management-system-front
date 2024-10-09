import React from "react";

export const modalStyle = (): { [key: string]: React.CSSProperties} => ({
    modalBody: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    modalFooter: {
        display: 'flex',
        gap: '10px'
    }
})