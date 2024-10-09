import { SxProps } from "@mui/material";

export const contactListStyle = (): {[key: string]: React.CSSProperties} => ({
    contactsWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 2
    },
    buttonsWrapper: {
        display: 'flex',
        flexDirection: 'row',
        gap: '10px'
    },
    tableAction: {
        borderRadius: 100,
    },
    paper: {
        height: 500, 
        width: '100%', 
        margin: 'auto'
    },
})