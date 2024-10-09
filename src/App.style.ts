import { SxProps } from "@mui/material";
import React from "react";

export const AppStyle = (): {[key: string]: React.CSSProperties} => ({
    app: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: 'rgb(179, 211, 211)',
        padding: '0 10% 0'
    },
    contactsWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 2
    },
    addContactButton: {
        borderRadius: 100,
    },
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