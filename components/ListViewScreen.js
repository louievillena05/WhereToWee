import React, { Component } from "react";
import {Platform, View, Text, StyleSheet, Image, FlatList, ActivityIndicator, TouchableOpacity, ToastAndroid, Picker} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import firebase from 'react-native-firebase'
import AddLocationButton from './AddLocationButton';
import geolib from 'geolib';
import { SearchBar } from 'react-native-elements';
import states from '../states.json';

const defaultRegion =  {
    latitude: 42.882004,
    longitude: 74.582748,
    latitudeDelta: 0.003,
    longitudeDelta: 0.003
}

class ListViewScreen extends Component {

    static navigationOptions =  {
        headerTitle: (
          <Image
            source={require('../images/logo2.png')}
            style={{ width: 75, height: 75 }}
          />
        ),
        headerTintColor: '#FF4354',
        headerStyle: {
          backgroundColor: '#000',
        }
    }

    constructor(props){
        super(props);

        this.ref = firebase.firestore().collection('toilets')
        this.unsubscribe = null;
        this.arrayholder = [];

        this.state = {
            loading: true,
            dataSource: [],
            error: null,
            refreshing: false,
            region: defaultRegion,
            search: '',
            pickerStates: '',
            states: states
        };
    }

    onCollectionUpdate = (querySnapshot) => {
        const dataSource = [];
        querySnapshot.forEach((doc) => {
            const { name, address, latitude, longitude, isDisabled, isKey, isFee, reviews, state, isVerified } = doc.data();

            let distance = geolib.getDistance(
            {
                latitude: this.state.region.latitude,
                longitude: this.state.region.longitude
            }, {
                latitude: latitude,
                longitude: longitude
            });

            distance = distance / 1000;

            dataSource.push({
                key: doc.id,
                doc, // DocumentSnapshot
                name,
                address,
                latitude,
                longitude,
                isDisabled,
                isKey,
                isFee,
                reviews,
                state,
                isVerified,
                distance
            });
        });
        
        dataSource.sort((a, b) => (a.distance > b.distance) ? 1 : -1)
        
        this.arrayholder = dataSource;
        
        this.setState({ 
            dataSource,
            loading: false,
        });
    }
    
    renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={{flex: 1, flexDirection: 'row'}}
                onPress= {() => {
                    this.props.navigation.navigate('Toilet', { toilet: item });
                  }}
            >
                <Icon name={Platform.OS === "ios" ? "ios-pin" : "md-pin"}  size={50} color="#FF4354" style={{ padding: 10 }} />
                <View style={{flex:1, paddingBottom: 10, paddingTop: 10, paddingRight: 5}}>
                    <View
                        style={{
                            flex: 1, 
                            flexDirection: 'row',
                        }}
                    >
                    <Text style={{fontSize: 20, fontWeight: 'bold', width: 150}} numberOfLines = { 1 }>
                        {item.name}
                    </Text>
                        <View
                            style={{
                                flex: 1, 
                                flexDirection: 'row',
                                justifyContent: 'flex-end'
                            }}
                        >
                        {
                            item.isDisabled
                            ?
                                <Icon name={Platform.OS === "ios" ? "ios-walk" : "md-walk"}  size={25} style={styles.iconActive} />
                            :
                                <Icon name={Platform.OS === "ios" ? "ios-walk" : "md-walk"}  size={25} style={styles.icon} />
                        }
                        {
                            item.isKey
                            ?
                                <Icon name={Platform.OS === "ios" ? "ios-key" : "md-key"}  size={25} style={styles.iconActive} />
                            :
                                <Icon name={Platform.OS === "ios" ? "ios-key" : "md-key"}  size={25} style={styles.icon}  />
                        }
                        {
                            item.isFee
                            ?
                                <Icon name={Platform.OS === "ios" ? "ios-cash" : "md-cash"}  size={25} style={styles.iconActive}  />
                            :
                                <Icon name={Platform.OS === "ios" ? "ios-cash" : "md-cash"}  size={25} style={styles.icon}  />
                        }
                        </View>
                    </View>
                    <Text numberOfLines = { 1 } style={{ paddingTop: 5, paddingBottom: 5}}>{ item.distance } km - {item.address}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderSeparator = () => {
        return (
            <View
                style={{ height:1, width:'100%', backgroundColor: 'gray'}}
            >
            </View>
        )
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log(position);
                this.setState({
                    region: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: 0.07,
                        longitudeDelta: 0.07,
                        error: null,
                    },
                });
                
                // After having done stuff (such as async tasks) hide the splash screen
                // this.makeRemoteRequest();
              this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate)
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: true, timeout: 20000 },
        );
    }
    
    componentWillUnmount() {
        this.unsubscribe();
    }

    searchFilterFunction = text => {  
        this.setState({
            value: text,
        });

        const newData = this.arrayholder.filter(item => {      
            const itemData = `${item.name.toUpperCase()} ${item.address.toUpperCase()}`;
            const textData = text.toUpperCase();
            
            return itemData.indexOf(textData) > -1;    
        });    
        this.setState({ dataSource: newData });  
    };

    stateList = () =>{
        return( this.state.states.map( (v) => { 
              return( <Picker.Item label={v.name} value={v.name}  />)} ));
    }

    pickerState = (value) =>{
        this.setState({
            pickerStates: value
        })
        if(value == 'All Data') {
            this.ref.onSnapshot(this.onCollectionUpdate)
        } else {
            const stateQuery = this.ref.where('state', '==', value)
            stateQuery.onSnapshot(this.onCollectionUpdate)
        }
    }

    render() {
        const { search } = this.state;
        return (
            this.state.loading
            ?
            <View style={styles.activityindicator}>
                <ActivityIndicator size='large' color='#330066' animating />
            </View>
            :
            <View style={styles.container}>
                <Picker
                selectedValue={this.state.pickerStates}
                onValueChange={(itemValue, itemIndex) =>
                    this.pickerState(itemValue)
                }>
                    { this.stateList() }
                </Picker>
                <SearchBar
                    placeholder="Type Here..."
                    lightTheme        
                    round  
                    onChangeText={text => this.searchFilterFunction(text)}
                    autoCorrect={false}
                    value={this.state.value}
                />
                <FlatList
                    data={this.state.dataSource}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index}
                    ItemSeparatorComponent={this.renderSeparator}
                />
                <AddLocationButton />
            </View>
        );
    }
}
export default ListViewScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    activityindicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon:{
        paddingRight: 5,
        paddingLeft: 5,  
        color: '#CCC'
    },
    iconActive:{
        paddingRight: 5,
        paddingLeft: 5, 
        color: '#FF4354'
    },
});