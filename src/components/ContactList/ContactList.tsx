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


export const ContactList = ({ contacts, toggleModal, fetchContacts, setEditContact }: { 
    contacts: ContactType[];
    toggleModal: () => void;
    fetchContacts: () => Promise<void>;
    setEditContact: React.Dispatch<React.SetStateAction<ContactType | null>>;
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
    const deleteSelectedContacts = async () => {
        const deletePromises = checkedIds.map((id) => deleteContact(id));

        toast.promise(
            Promise.allSettled(deletePromises),
            {
                loading: 'Deleting...',
                success: 'Deleted Successfuly',
                error: 'Failed deleting contacts'
            }
        ).then(() => {
            setCheckedIds([]);
            fetchContacts();
        }).catch(error => {
            toast.error(error.message);
        })
    }
    const editContact = () => {
        if (checkedIds.length !== 1) {
            toast('Select a single contact to edit', {
                icon: '🌚'
            })
        } else {
            const selectedContact = contacts.find(contact => contact.id === checkedIds[0]) || null;
            setEditContact(selectedContact);
        }
    }
    return (
        <Box className='contacts-wrapper' sx={style.contactsWrapper}>
            <Box className='buttons-wrapper' sx={style.buttonsWrapper}>
                <Button
                    aria-label='Add Contact'
                    variant='contained'
                    sx={style.tableAction}
                    onClick={deleteSelectedContacts}
                    color='error'
                >
                    <DeleteIcon />
                </Button>
                <Button
                    aria-label='Add Contact'
                    variant='contained'
                    sx={style.tableAction}
                    onClick={editContact}
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