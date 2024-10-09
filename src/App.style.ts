import { SxProps } from "@mui/material";
import React from "react";

export const appStyle = (): {[key: string]: React.CSSProperties} => ({
    app: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: 'rgb(179, 211, 211)',
        padding: '0 10% 0'
    }
})