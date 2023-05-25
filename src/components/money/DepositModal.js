import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

const DepositModal = ({ show, onHide }) => {
    const [amount, setAmount] = useState('');

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    };

    const handleDeposit = () => {
        // Handle deposit logic here
        console.log('Deposit amount:', amount);
        setAmount('');
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Deposit Money</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label>Amount:</Form.Label>
                    <Form.Control
                        type="number"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="Enter the amount to deposit"
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleDeposit}>
                    Deposit
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

DepositModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
};

export default DepositModal;
