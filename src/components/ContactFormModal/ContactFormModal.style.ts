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
    },
    horizontalInputWrapper: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        gap: '10px',
        alignItems: 'center',
    },
    halfInput: {
        flex: 1
    }
})