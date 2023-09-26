import React, { useState } from 'react';
import { useEffect } from 'react';
import { View } from 'react-native';
import { Button, Dialog, Paragraph, Portal } from 'react-native-paper';

const DialogMessage = ({ visible, setVisible, onCancel, message, type }) => {

    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                setVisible(false)
            }, 3000)
        }
    }, [visible])

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onCancel} style={{ backgroundColor: type === 'erro' ? 'red' : 'green' }}>
                {type === 'erro'
                    ?
                    <Dialog.Title>Erro</Dialog.Title>
                    :
                    <Dialog.Title style={{ color: 'white' }}>Sucesso</Dialog.Title>
                }
                <Dialog.Content>
                    <Paragraph style={{ fontSize: 16, color: type === 'erro' ? 'black' : 'white' }}>{message}</Paragraph>
                </Dialog.Content>
            </Dialog>
        </Portal>
    );
};

export default DialogMessage;

