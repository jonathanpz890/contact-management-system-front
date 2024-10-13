import { yupResolver } from "@hookform/resolvers/yup";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { Autocomplete, Box, Button, Collapse, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import { countries } from 'countries-list';
import React, { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import * as Yup from 'yup';
import { addContact, updateContact } from '../../services/contacts';
import { addGroup } from "../../services/groups";
import { ContactType } from '../../types/ContactType';
import { GroupType } from "../../types/GroupType";
import { modalStyle } from './ContactFormModal.style';

const ContactFormModal = ({ modal, toggleModal, setLoading, fetchContacts, fetchGroups, loading, contact, setEditContact, groups }: {
    modal: boolean;
    toggleModal: () => void;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    fetchContacts: () => Promise<void>;
    fetchGroups: () => Promise<void>;
    loading: boolean;
    contact?: ContactType | null;
    setEditContact: React.Dispatch<React.SetStateAction<ContactType | null>>;
    groups: GroupType[];
}) => {
    const [newGroupCollapse, setNewGroupCollapse] = useState<boolean>(false);
    const [newGroupName, setNewGroupName] = useState<string>('');

    const style = modalStyle();
    const validationSchema = Yup.object().shape({
        firstName: Yup.string().trim().required('First Name is required'),
        lastName: Yup.string().trim().required('Last Name is required'),
        country: Yup.string().trim().required('Country is required'),
        city: Yup.string().trim().required('City is required'),
        street: Yup.string().trim(),
        zipcode: Yup.string().trim(),
        phone: Yup.string().matches(/^(\+972|0)([2-9]\d{1})-?\d{7}$/, 'Phone number is invalid')
            .required('Phone is required'),
        email: Yup.string().trim().matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email is invalid'),
        groups: Yup.array().of(
            Yup.object().shape({
                id: Yup.number().integer().positive('Group ID must be a positive integer').required('Group Id required'),
                name: Yup.string().trim().required('Group name is required'),
            })
        )
    });

    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<ContactType>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            country: '',
            city: '',
            street: '',
            zipcode: '',
            groups: []
        }
    });
    const contactGroups = useMemo(() => 
        watch('groups')?.map(group => ({ ...group, label: group.name}))
    , [contact, watch('groups'), groups])
    const textFieldLabel = (label: string) => (
        <>
            <span>{label}</span>
            <span style={{ color: 'red' }}> * </span>
        </>
    )
    const onSubmitForm: SubmitHandler<ContactType> = async (data) => {
        setLoading(true);
        try {
            contact?.id 
                ? await toast.promise(updateContact(contact.id, data), {
                    loading: 'Updating contact...',
                    success: 'Contact updated successfully',
                    error: 'Failed to update contact'
                })
                : await toast.promise(addContact(data), {
                    loading: 'Adding contact...',
                    success: 'Contact added successfully',
                    error: 'Failed to add contact'
                });
    
            await fetchContacts();
    
            toggleModal();
            reset();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);

        }
    };
    const handleResetForm = () => {
        setNewGroupCollapse(false);
        setNewGroupName('');
        reset();
    }
    const handleModalCancel = () => {
        toggleModal();
        setNewGroupCollapse(false);
        setNewGroupName('');
        reset();
    }
    const toggleNewGroupCollapse = () => setNewGroupCollapse(!newGroupCollapse);
    useEffect(() => {
        if (contact) {
            reset(contact);
        } else {
            reset({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                country: '',
                city: '',
                street: '',
                zipcode: '',
            })
        }
    }, [contact])
    const handleNewGroupInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setNewGroupName(value);
    }
    const handleNewGroupSubmit = async () => {
        if (!newGroupName) {
            return toast.error('No group name was entered')
        }
        setLoading(true);
        const group = {
            name: newGroupName
        }
        toast.promise(
            addGroup(group),
            {
                loading: 'Saving new group...',
                success: 'New group saved',
                error: 'New group failed to save'
            }
        ).then(() => {
            fetchGroups();
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            setNewGroupName('');
            setLoading(false);
        })
    }
    const handleCancelNewGroup = () => {
        setNewGroupCollapse(false);
        setNewGroupName('');
    }
    const handleGroupsOnChange = (event: SyntheticEvent<Element, Event>, values: { id: number; label: string; }[]) => {
        const parsedGroups: GroupType[] = values.map(value => ({ id: value.id, name: value.label }));
        setValue('groups', parsedGroups);
    }
    return (
        <Modal isOpen={modal} toggle={toggleModal} onClosed={() => setEditContact(null)}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
                <ModalHeader toggle={toggleModal}>Create new contact</ModalHeader>
                <ModalBody style={style.modalBody}>
                    <Typography variant="overline">Contact information</Typography>
                    <Box sx={style.horizontalInputWrapper}>
                        <TextField
                            sx={style.halfInput}
                            label={textFieldLabel('First Name')}
                            {...register('firstName')}
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                        />
                        <TextField
                            sx={style.halfInput}
                            label={textFieldLabel('Last Name')}
                            {...register('lastName')}
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                        />
                    </Box>
                    <Autocomplete
                        disablePortal
                        options={Object.values(countries).map(country => country.name)}
                        value={watch('country')}
                        renderInput={(params) =>
                            <TextField
                                {...params}
                                label='Country'
                                {...register('country')}
                                error={!!errors.country}
                                helperText={errors.country?.message}
                            />
                        }
                    />
                    <TextField
                        label={textFieldLabel('City')} {...register('city')} error={!!errors.city} helperText={errors.city?.message}
                    />
                    <TextField
                        label='Street' {...register('street')} error={!!errors.street} helperText={errors.street?.message}
                    />
                    <TextField
                        label='Zipcode' {...register('zipcode')} error={!!errors.zipcode} helperText={errors.zipcode?.message}
                    />
                    <TextField

                        label={textFieldLabel('Phone')} {...register('phone')} error={!!errors.phone} helperText={errors.phone?.message}
                    />
                    <TextField
                        label='Email' {...register('email')} error={!!errors.email} helperText={errors.email?.message}
                    />
                    <Box sx={style.horizontalInputWrapper}>
                        <Autocomplete
                            multiple
                            value={contactGroups}
                            options={groups.map(group => ({ ...group, label: group.name }))}
                            sx={style.halfInput}
                            onChange={handleGroupsOnChange}
                            filterOptions={(options, state) => 
                                options.filter(option => 
                                    !contactGroups?.some(group => group.id === option.id)
                                )
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label='Groups'
                                />
                            )}
                        />
                        <Tooltip title='Add new group' placement="top">
                            <IconButton
                                aria-label='Add Contact'
                                onClick={toggleNewGroupCollapse}
                            >
                                <GroupAddIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Collapse in={newGroupCollapse}>
                        <Typography variant="overline">New group</Typography>
                        <Box sx={style.horizontalInputWrapper}>
                            <TextField
                                value={newGroupName}
                                sx={style.halfInput}
                                placeholder='Group Name'
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                onChange={handleNewGroupInputOnChange}
                            />
                            <Tooltip title='Add new group' placement="top">
                                <IconButton
                                    color='success'
                                    aria-label='Add group'
                                    onClick={handleNewGroupSubmit}
                                >
                                    <CheckIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title='Add new group' placement="top">
                                <IconButton
                                    color='error'
                                    aria-label='Add Contact'
                                    onClick={handleCancelNewGroup}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Collapse>
                </ModalBody>
                <ModalFooter style={style.modalFooter}>
                    <Button variant='contained' color='primary' type='submit' disabled={loading}>
                        {!loading ? 'Save' : 'Loading...'}
                    </Button>
                    <Button variant='contained' color='error' onClick={handleResetForm}>reset</Button>
                    <Button variant='contained' color='inherit' onClick={handleModalCancel}>Cancel</Button>
                </ModalFooter>
            </form>
        </Modal>
    )
}

export default ContactFormModal;