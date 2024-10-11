import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { appStyle } from './App.style';
import { ContactList } from './components';
import ContactFormModal from './components/ContactFormModal/ContactFormModal';
import { getContacts } from './services/contacts';
import { getGroups } from './services/groups';
import { ContactType } from './types/ContactType';
import { GroupType } from './types/GroupType';



const App = () => {
    const [contacts, setContacts] = useState<ContactType[]>([])
    const [loading, setLoading] = useState<boolean>(false);
    const [modal, setModal] = useState<boolean>(false);
    const [editContact, setEditContact] = useState<ContactType | null>(null);
    const [groups, setGroups] = useState<GroupType[]>([]);

    const style = appStyle();
    const toggleModal = () => setModal(!modal);
    const fetchContacts = async () => {
        setLoading(true);
        try {
            const response = await getContacts();
            setLoading(false);
            setContacts(response.data);
        } catch (error) {
            toast.error('')
            setLoading(false);
        }

    }
    const fetchGroups = async () => {
        setLoading(true);
        try {
            const response = await getGroups();
            setGroups(response.data);
            setLoading(false);
        } catch (error) {
            toast.error('')
            setLoading(false);
        }

    }
    useEffect(() => {
        fetchContacts();
        fetchGroups();
    }, [])
    useEffect(() => {
        if (editContact) {
            setModal(true);
        }
    }, [editContact])
    useEffect(() => {
        console.log({contacts})
    }, [contacts])

    return (
        <Box className="App" sx={style.app}>
            <Typography variant='h4'>CONTACT MANAGEMENT SYSTEM</Typography>
            <ContactList 
                contacts={contacts}     
                toggleModal={toggleModal}
                fetchContacts={fetchContacts}
                setEditContact={setEditContact}
                loading={loading}
                groups={groups}
            />
            <ContactFormModal 
                modal={modal}
                toggleModal={toggleModal}
                setLoading={setLoading}
                fetchContacts={fetchContacts}
                fetchGroups={fetchGroups}
                loading={loading}
                contact={editContact}
                setEditContact={setEditContact}
                groups={groups}
            />
            <Toaster />
        </Box >
    );
}

export default App;
