import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const ButtonGeneric = ({ onPress, title, backgroundColor, icon, marginTop }) => {

    const styles = StyleSheet.create({
        loginButton: {
            backgroundColor: backgroundColor || '#2196F3',
            marginBottom: 0,
            marginTop: marginTop || null,
            borderRadius: 5,
        },
        loginButtonContent: {
            height: 50,
        },
    });

    return (
        <Button
            mode="contained"
            onPress={onPress}
            style={styles.loginButton}
            contentStyle={styles.loginButtonContent}
            icon={() => icon}
            
        >
            {title}
        </Button>
    );
};



export default ButtonGeneric;
