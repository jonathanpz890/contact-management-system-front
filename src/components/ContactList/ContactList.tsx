import React, { useState } from 'react';
import { Box, Button, Paper } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { ContactType } from '../../types/ContactType';
import { contactListStyle } from './ContactList.style';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { deleteContact } from '../../services/api';
import toast from 'react-hot-toast';


export const ContactList = ({ contacts, toggleModal }: {
    contacts: ContactType[];
    toggleModal: () => void;
}) => {
    const [checkedIds, setCheckedIds] = useState<GridRowSelectionModel>([]);
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
    return (
        <Box className='contacts-wrapper' sx={style.contactsWrapper}>
            <Box className='buttons-wrapper' sx={style.buttonsWrapper}>
                <Button
                    aria-label='Add Contact'
                    variant='contained'
                    sx={style.tableAction}
                    color='error'
                >
                    <DeleteIcon />
                </Button>
                <Button
                    aria-label='Add Contact'
                    variant='contained'
                    sx={style.tableAction}
                    onClick={() => ''}
                    color='success'
                >
                    <EditIcon />
                </Button>
                <Button
                    aria-label='Add Contact'
                    variant='contained'
                    sx={style.tableAction}
                    onClick={toggleModal}
                >
                    <AddIcon />
                </Button>
            </Box>
            <Paper sx={style.paper}>
                <DataGrid
                    rows={contacts}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    onRowSelectionModelChange={(rows) => setCheckedIds(rows)}
                    sx={{ border: 0 }}
                />
            </Paper>
        </Box>
    )
}

export default ContactList;