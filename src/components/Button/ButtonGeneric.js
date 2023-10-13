import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const ButtonGeneric = ({ onPress, title, backgroundColor, icon, marginTop, marginRight, marginLeft, marginBottom }) => {

    const styles = StyleSheet.create({
        loginButton: {
            backgroundColor: backgroundColor || '#2196F3',
            marginBottom: marginBottom || 0,
            marginTop: marginTop || null,
            borderRadius: 5,
            marginRight: marginRight || null,
            marginLeft: marginLeft || null
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
