import React, { SyntheticEvent, useEffect, useState, useTransition } from 'react';
import { Autocomplete, Box, Button, Collapse, Paper, TextField, Tooltip } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel, GridValueGetter, useGridApiRef } from '@mui/x-data-grid';
import { ContactType } from '../../types/ContactType';
import { contactListStyle } from './ContactList.style';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { deleteContact } from '../../services/contacts';
import toast from 'react-hot-toast';
import SearchIcon from '@mui/icons-material/Search';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import CloseIcon from '@mui/icons-material/Close';
import GroupIcon from '@mui/icons-material/Group';
import { GroupType } from '../../types/GroupType';

export const ContactList = ({ contacts, toggleModal, fetchContacts, setEditContact, loading, groups }: {
    contacts: ContactType[];
    toggleModal: () => void;
    fetchContacts: () => Promise<void>;
    setEditContact: React.Dispatch<React.SetStateAction<ContactType | null>>;
    loading: boolean;
    groups: GroupType[];
}) => {
    const [checkedIds, setCheckedIds] = useState<GridRowSelectionModel>([]);
    const [searchOpen, setSearchOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [groupFilter, setGroupFilter] = useState<number>();
    const [filteredContacts, setFilteredContacts] = useState<ContactType[]>([]);

    const [_, startTransition] = useTransition();
    const dataGridRef = useGridApiRef();
    const style = contactListStyle({ searchOpen });
    const paginationModel = { page: 0, pageSize: 5 };
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 1 },
        { field: 'firstName', headerName: 'First Name' },
        { field: 'lastName', headerName: 'Last Name' },
        { field: 'country', headerName: 'Country' },
        { field: 'city', headerName: 'City' },
        { field: 'street', headerName: 'Street' },
        { field: 'zipcode', headerName: 'Zipcode' },
        { field: 'phone', headerName: 'Phone' },
        { field: 'email', headerName: 'Email' },
        {
            field: 'groups', headerName: 'Groups', valueGetter: (params: any) => (
                params.map((group: GroupType) => group.name).join(', ')
            )
        },
    ];
    const deleteSelectedContacts = async () => {
        if (!checkedIds.length) {
            return toast.error('No contacts were selected')
        }
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
    const handleEditContact = () => {
        if (checkedIds.length !== 1) {
            toast('Select a single contact to edit', {
                icon: '🌚'
            })
        } else {
            const selectedContact = contacts.find(contact => contact.id === checkedIds[0]) || null;
            setEditContact(selectedContact);
        }
    }
    const handleOnSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchQuery(value);
    }
    useEffect(() => {
        startTransition(() => {
            //If group filter isn't preset use contacts
            const groupFilteredContacts: ContactType[] = !groupFilter ? contacts :
                contacts.filter(contact => contact.groups?.map(group => group.id).includes(groupFilter))

            const keywords = searchQuery.toLowerCase().split(' ').filter(Boolean);
            //if search query isn't present - skip filtering by keywords
            const filtered = !searchQuery ? groupFilteredContacts :
                groupFilteredContacts.filter(contact => (
                    keywords.every(keyword => {
                        console.log(contact.firstName.toLowerCase().includes(keyword))
                        return contact.firstName.toLowerCase().includes(keyword) ||
                            contact.lastName.toLowerCase().includes(keyword)
                    })
                ))
            setFilteredContacts(filtered);
        });
    }, [searchQuery, groupFilter]);
    const handleGroupFilterChange = (event: SyntheticEvent<Element, Event>, value: { label: string; id: number; name: string; } | null): void => {
        setGroupFilter(value?.id);
    }
    const handleExport = () => {
        dataGridRef.current.exportDataAsCsv({
            //If there are selected rows export them, if not, export all
            getRowsToExport: !checkedIds.length ? (params) => (
                params.apiRef.current.getAllRowIds()
            ) : undefined
        });
    }
    const toggleSearchBar = () => setSearchOpen(!searchOpen);

    return (
        <Box className='contacts-wrapper' sx={style.contactsWrapper}>
            <Box className='actions-wrapper' sx={style.actionsWrapper}>
                <Tooltip title='Filter Groups' placement='top'>
                    <Autocomplete
                        options={groups.map(group => ({ ...group, label: group.name }))}
                        sx={style.groupFilterDropdown}
                        onChange={handleGroupFilterChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label='Groups'
                            />
                        )}
                    />
                </Tooltip>
                <Tooltip title='Search' placement='top'>
                    <Button
                        aria-label='Search'
                        variant='contained'
                        sx={style.tableAction}
                        onClick={toggleSearchBar}
                        color='inherit'
                    >
                        {searchOpen ? <CloseIcon /> : <SearchIcon />}
                    </Button>
                </Tooltip>
                <Box sx={style.searchBarWrapper}>
                    <Box sx={style.animationWrapper}>
                        <TextField
                            placeholder='Search'
                            sx={style.searchBar}
                            onChange={handleOnSearch}
                        />
                    </Box>
                </Box>
                <Box className='action-buttons' sx={style.actionButtons}>

                    <Tooltip title='Export' placement='top'>
                        <Button
                            aria-label='Export'
                            variant='contained'
                            sx={style.tableAction}
                            onClick={handleExport}
                            color='secondary'
                        >
                            <FileOpenIcon />
                        </Button>
                    </Tooltip>
                    <Tooltip title='Delete Contact' placement='top'>
                        <Button
                            aria-label='Delete Contact'
                            variant='contained'
                            sx={style.tableAction}
                            onClick={deleteSelectedContacts}
                            color='error'
                        >
                            <DeleteIcon />
                        </Button>
                    </Tooltip>
                    <Tooltip title='Edit Contact' placement='top'>
                        <Button
                            aria-label='Edit Contact'
                            variant='contained'
                            sx={style.tableAction}
                            onClick={handleEditContact}
                            color='success'
                        >
                            <EditIcon />
                        </Button>
                    </Tooltip>

                    <Tooltip title='Add Contact' placement='top'>
                        <Button
                            aria-label='Add Contact'
                            variant='contained'
                            sx={style.tableAction}
                            onClick={toggleModal}
                        >
                            <AddIcon />
                        </Button>
                    </Tooltip>
                </Box>
            </Box>
            <Paper sx={style.paper}>
                <DataGrid
                    loading={loading}
                    apiRef={dataGridRef}
                    rows={searchQuery || groupFilter ? filteredContacts : contacts}
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