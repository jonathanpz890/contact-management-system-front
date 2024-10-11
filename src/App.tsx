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
    const [contactFormModal, setContactFormModal] = useState<boolean>(false);
    const [editContact, setEditContact] = useState<ContactType | null>(null);
    const [groups, setGroups] = useState<GroupType[]>([]);

    const style = appStyle();
    const toggleModal = () => setContactFormModal(!contactFormModal);
    const fetchContacts = async () => {
        setLoading(true);
        try {
            const response = await getContacts();
            setContacts(response.data);
        } catch (error) {
            toast.error('Fetching contacts failed, try again later')
        } finally {
            setLoading(false);
        }

    }
    const fetchGroups = async () => {
        setLoading(true);
        try {
            const response = await getGroups();
            setGroups(response.data);
        } catch (error) {
            toast.error('Fetching groups failed, try again later')
        } finally {
            setLoading(false);
        }

    }
    useEffect(() => {
        fetchContacts();
        fetchGroups();
    }, [])
    useEffect(() => {
        if (editContact) {
            setContactFormModal(true);
        }
    }, [editContact])

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
                modal={contactFormModal}
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
