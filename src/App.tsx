import React, { useEffect, useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { addContact, getContacts } from './services/api';
import { ContactType } from './types/ContactType';
import { ContactList } from './components';
import { appStyle } from './App.style';
import { Box, Button, Fade, IconButton, Input, TextField, Typography } from '@mui/material';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import ContactFormModal from './components/ContactFormModal/ContactFormModal';
import { Toaster } from 'react-hot-toast';



const App = () => {
    const [contacts, setContacts] = useState<ContactType[]>([])
    const [loading, setLoading] = useState<boolean>(false);
    const [modal, setModal] = useState<boolean>(false);
    const [editContact, setEditContact] = useState<ContactType | null>(null);

    const style = appStyle();
    const toggleModal = () => setModal(!modal);
    const fetchContacts = async () => {
        setLoading(true);
        try {
            const response = await getContacts();
            setContacts(response.data);
            setLoading(false);
        } catch (error) {
            //TODO: add error
            setLoading(false);
        }

    }
    useEffect(() => {
        fetchContacts();
    }, [])
    useEffect(() => {
        if (editContact) {
            setModal(true);
        }
    }, [editContact])

    return (
        <Box className="App" sx={style.app}>
            <Typography variant='h3'>Contact Management System</Typography>
            <ContactList 
                contacts={contacts}     
                toggleModal={toggleModal}
                fetchContacts={fetchContacts}
                setEditContact={setEditContact}
            />
            <ContactFormModal 
                modal={modal}
                toggleModal={toggleModal}
                setLoading={setLoading}
                fetchContacts={fetchContacts}
                loading={loading}
                contact={editContact}
                setEditContact={setEditContact}
            />
            <Toaster />
        </Box >
    );
}

export default App;
