import React, { Component } from "react";
import {Platform, StyleSheet, TouchableHighlight } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { withNavigation } from 'react-navigation';


class AddLocationButton extends Component {
    render() {
        const { navigate } = this.props.navigation;
        return (
            <TouchableHighlight
                style={styles.addButton}
                onPress={() => navigate('AddLocation')} 
            >
            <Icon name={Platform.OS === "ios" ? "ios-add-circle" : "md-add-circle"}  size={75} color="#FF4354" />
            </TouchableHighlight>
        );
    }
}

export default withNavigation(AddLocationButton);

const styles = StyleSheet.create({
    addButton: {
        alignItems:'center',
        justifyContent:'center',
        width:75,
        height:75,
        borderRadius:75,
        position: 'absolute',
        bottom: 10,                                                    
        right: 10
    }
});