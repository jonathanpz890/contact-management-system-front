import { Button, TextField } from '@mui/material';
import React from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from 'yup'
import { SubmitHandler, useForm } from 'react-hook-form';
import { ContactType } from '../../types/ContactType';
import { addContact } from '../../services/api';
import { modalStyle } from './NewContactModal.style';

const NewContactModal = ({ modal, toggleModal, setLoading, fetchContacts, loading }: {
    modal: boolean;
    toggleModal: () => void;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    fetchContacts: () => Promise<void>;
    loading: boolean;
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

    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<ContactType>({
        resolver: yupResolver(validationSchema)
    });
    const onSubmitForm: SubmitHandler<ContactType> = async (data) => {
        setLoading(true);
        try {
            const response = await addContact(data);
            if (response.status === 201) {
                toggleModal();
                setLoading(false);
                reset();
                fetchContacts();
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }
    return (
        <Modal isOpen={modal} toggle={toggleModal}>
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

export default NewContactModal;