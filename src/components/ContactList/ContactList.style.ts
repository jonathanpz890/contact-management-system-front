import { SxProps } from "@mui/material";

export const contactListStyle = ({ searchOpen }: {
    searchOpen: boolean;
}): {[key: string]: React.CSSProperties} => ({
    contactsWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 2
    },
    actionsWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: '10px',
        width: '100%'
    },
    actionButtons: {
        display: 'flex',
        flexDirection: 'row',
        gap: '10px'
    },
    searchBarWrapper: {
        width: '100%',
    },
    animationWrapper: {
        width: searchOpen ? '100%' : '0%',
        overflowX: 'hidden',
        transition: 'width 350ms ease-in-out'
    },
    searchBar: {
        width: '100%',  
        backgroundColor: 'white',
        borderRadius: '4px',
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