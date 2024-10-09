import React, { useEffect, useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { addContact, getContacts } from './services/api';
import { ContactType } from './types/ContactType';
import { ContactList } from './components';
import { appStyle } from './App.style';
import { Box, Button, Fade, IconButton, Input, TextField, Typography } from '@mui/material';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import NewContactModal from './components/NewContactModal/NewContactModal';
import { Toaster } from 'react-hot-toast';



const App = () => {
    const [contacts, setContacts] = useState<ContactType[]>([])
    const [loading, setLoading] = useState<boolean>(false);
    const [modal, setModal] = useState<boolean>(false);

    const style = appStyle();
    const toggleModal = () => setModal(!modal);
    const fetchContacts = async () => {
        setLoading(true);
        try {
            const response = await getContacts();
            console.log(response);
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

    return (
        <Box className="App" sx={style.app}>
            <Typography variant='h3'>Contact Management System</Typography>
            <ContactList 
                contacts={contacts}     
                toggleModal={toggleModal}
            />
            <NewContactModal 
                modal={modal}
                toggleModal={toggleModal}
                setLoading={setLoading}
                fetchContacts={fetchContacts}
                loading={loading}
            />
            <Toaster />
        </Box >
    );
}

export default App;
