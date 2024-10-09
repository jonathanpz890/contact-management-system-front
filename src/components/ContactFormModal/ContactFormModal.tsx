import { Button, TextField } from '@mui/material';
import React, { useEffect } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from 'yup'
import { SubmitHandler, useForm } from 'react-hook-form';
import { ContactType } from '../../types/ContactType';
import { addContact, updateContact } from '../../services/api';
import { modalStyle } from './ContactFormModal.style';
import { AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';

const ContactFormModal = ({ modal, toggleModal, setLoading, fetchContacts, loading, contact, setEditContact }: {
    modal: boolean;
    toggleModal: () => void;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    fetchContacts: () => Promise<void>;
    loading: boolean;
    contact?: ContactType | null;
    setEditContact: React.Dispatch<React.SetStateAction<ContactType | null>>;
}) => {
    const style = modalStyle();
    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        country: Yup.string().required('Country is required'),
        city: Yup.string().required('City is required'),
        street: Yup.string().required('Street is required'),
        zipcode: Yup.string().required('Zipcode is required'),
        phone: Yup.string().matches(/^[0-9]+$/, 'Phone number is invalid').required('Phone is required'),
        email: Yup.string().email('Email is invalid').required('Email is required'),
    });

    const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactType>({
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
          }
    });
    const onSubmitForm: SubmitHandler<ContactType> = async (data) => {
        setLoading(true);
        toast.promise(
            contact?.id ? updateContact(contact.id, data) : addContact(data),
            {
                loading: 'Saving...',
                success: `Contact ${contact ? 'updated' : 'saved'}`,
                error: `Failed to ${contact ? 'update' : 'save' } contact`
            }
        ).then(() => {
            toggleModal();
            setLoading(false);
            reset();
            fetchContacts();
        }).catch(error => {
            console.log(error);
            setLoading(false);
        })
    }

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
    return (
        <Modal isOpen={modal} toggle={toggleModal} onClosed={() => setEditContact(null)}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
                <ModalHeader toggle={toggleModal}>Create new contact</ModalHeader>
                <ModalBody style={style.modalBody}>
                    <TextField
                        label='First Name' {...register('firstName')} error={!!errors.firstName} helperText={errors.firstName?.message}
                    />
                    <TextField
                        label='Last Name' {...register('lastName')} error={!!errors.lastName} helperText={errors.lastName?.message}
                    />
                    <TextField
                        label='Country' {...register('country')} error={!!errors.country} helperText={errors.country?.message}
                    />
                    <TextField
                        label='City' {...register('city')} error={!!errors.city} helperText={errors.city?.message}
                    />
                    <TextField
                        label='Street' {...register('street')} error={!!errors.street} helperText={errors.street?.message}
                    />
                    <TextField
                        label='Zipcode' {...register('zipcode')} error={!!errors.zipcode} helperText={errors.zipcode?.message}
                    />
                    <TextField
                        label='Phone' {...register('phone')} error={!!errors.phone} helperText={errors.phone?.message}
                    />
                    <TextField
                        label='Email' {...register('email')} error={!!errors.email} helperText={errors.email?.message}
                    />
                </ModalBody>
                <ModalFooter style={style.modalFooter}>
                    <Button variant='contained' color='primary' type='submit' disabled={loading}>
                        {!loading ? 'Save' : 'Loading...'}
                    </Button>
                    <Button variant='contained' color='error' onClick={() => reset()}>reset</Button>
                    <Button variant='contained' color='inherit' onClick={() => {
                        toggleModal();
                        reset();
                    }}>Cancel</Button>
                </ModalFooter>
            </form>
        </Modal>
    )
}

export default ContactFormModal;