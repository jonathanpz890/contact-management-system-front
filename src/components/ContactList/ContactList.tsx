import React from 'react';
import { Paper } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ContactType } from '../../types/ContactType';
import { contactListStyle } from './ContactList.style';


export const ContactList = ({ contacts }: { contacts: ContactType[]}) => {
    const style = contactListStyle();
    const paginationModel = { page: 0, pageSize: 5 };
    const columns: GridColDef[] = [
        { field: 'id', headerName: "ID" },
        { field: 'firstName', headerName: 'First Name' },
        { field: 'lastName', headerName: 'Last Name' },
        { field: 'country', headerName: 'Country' },
        { field: 'city', headerName: 'City' },
        { field: 'street', headerName: 'Street' },
        { field: 'zipcode', headerName: 'Zipcode' },
        { field: 'phone', headerName: 'Phone' },
        { field: 'email', headerName: 'Email' },
    ];
    return(
        <Paper sx={style.paper}>
                <DataGrid
                    rows={contacts}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    sx={{ border: 0 }}
                />
            </Paper>
    )
}

export default ContactList;