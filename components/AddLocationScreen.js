import React, { Component } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Button,
    Platform,
    TouchableOpacity,
    TouchableHighlight,
    Alert,
    LayoutAnimation,
} from "react-native";
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Icon from "react-native-vector-icons/Ionicons";
import Geocoder from 'react-native-geocoder-reborn';
import googleMapStyle from '../google_map_style.json';
import firebase from 'react-native-firebase'

// Geocoder.fallbackToGoogle('AIzaSyDLLBSspiJ1_ow-ZfVmbNWd0vxxoh6syPc');

const defaultRegion =  {
    latitude: 42.882004,
    longitude: 74.582748,
    latitudeDelta: 0.003,
    longitudeDelta: 0.003
}

class AddLocationScreen extends Component {

    static navigationOptions =  {
        headerTitle: 'Add Toilet Location',
        headerTintColor: '#FF4354',
        headerStyle: {
          backgroundColor: '#000',
        }
    }

    constructor(props) {
        super(props);

        this.ref = firebase.firestore().collection('toilets')

        this.state = {
            region: defaultRegion,
            mapStyle: googleMapStyle,
            address: null,
            adminArea: null,
            name: null,
            isDisabled: false,
            isKey: false,
            isFee: false,
            isVerfied: false,
            isLoading: false,
        };
    }

    onPressDisabled = () => {
        this.setState({
            isDisabled: !this.state.isDisabled
        })
    }

    onPressKey = () => {
        this.setState({
            isKey: !this.state.isKey
        })
    }

    onPressFee = () => {
        this.setState({
            isFee: !this.state.isFee
        })
    }

    onAddLocation = () => {
        this.setState({
          isLoading: true,
        });
        this.ref.add({
            address: this.state.address,
            name: this.state.name,
            state: this.state.adminArea,
            latitude: this.state.region.latitude,
            longitude: this.state.region.longitude,
            isDisabled: this.state.isDisabled,
            isKey: this.state.isKey,
            isFee: this.state.isFee,
            reviews: []
        }).then((docRef) => {
            this.setState({
                address: null,
                name: null,
                isDisabled: null,
                isKey: null,
                isFee: null,
                isLoading: false,
            });
            Alert.alert(
                'Success!',
                'Congratulations! You have successfully add a location!',
                [
                    {text: 'OK', onPress: () => this.props.navigation.goBack()},
                ],
                {cancelable: false},
            );
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
          this.setState({
            isLoading: false,
          });
        });
    }

    getFormattedAddress = () => {
        var latlng = {
            lat: this.state.region.latitude,
            lng: this.state.region.longitude
        }

        Geocoder.geocodePosition(latlng).then(res => {
            console.log(JSON.stringify(res[0]));
            this.setState({
                address: res[0].formattedAddress,
                adminArea: res[0].adminArea
            })
        })
        .catch(err => console.log(err))
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
            this.setState({
              region: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.003,
                longitudeDelta: 0.003,
                error: null,
              },
            });

            this.getFormattedAddress()
          },
          (error) => this.setState({ error: error.message }),
          { enableHighAccuracy: true, timeout: 20000 },
        );
    }

    render() {

        return (
            <View style={styles.container}>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={{flex:1}}
                        region={this.state.region}
                        showsUserLocation={true}
                        showsMyLocationButton={true}
                        customMapStyle={this.state.mapStyle}
                    >
              
                    {!!this.state.region.latitude && !!this.state.region.longitude && 
                    <MapView.Marker
                        draggable
                        image={require('../images/map-marker/marker-min.png')}
                        coordinate={{"latitude":this.state.region.latitude,"longitude":this.state.region.longitude}}
                        title='Toilet Location'
                        onDragEnd={(e) => {
                            e.nativeEvent.coordinate.latitudeDelta = 0.003;
                            e.nativeEvent.coordinate.longitudeDelta = 0.003;
                            this.setState({ region: e.nativeEvent.coordinate }, () => this.getFormattedAddress());
                        }}
                    />}
            
                    </MapView>
                    <View
                        style={{
                            flex:2, 
                            backgroundColor: '#FFF',
                        }}
                    >
                        <TextInput
                            style={{height: 40, borderColor: '#FF4354', borderBottomWidth: 1, margin: 5, textAlign:'center', fontSize: 18, color: '#FF4354'}}
                            onChangeText={(name) => this.setState({name})}
                            placeholder="Name of the Location"
                            value={this.state.name}
                        /> 
                        <Text style={{textAlign: 'center', fontSize: 18, color: '#FF4354', margin: 5}}>{this.state.address}</Text>
                        <View style={{flexDirection:'row', margin: 10, justifyContent: 'center', padding: 5}}>
                            <TouchableOpacity onPress={this.onPressDisabled}>
                                {
                                    this.state.isDisabled
                                    ?
                                    <View style={styles.buttonActive}>
                                        <Icon name={Platform.OS === "ios" ? "ios-walk" : "md-walk"}  size={25} style={styles.iconActive} />
                                        <Text style={styles.textActive}>Disabled Access?</Text>
                                    </View>
                                    :
                                    <View style={styles.button}>
                                        <Icon name={Platform.OS === "ios" ? "ios-walk" : "md-walk"}  size={25} style={styles.icon} />
                                        <Text style={styles.text}>Disabled Access?</Text>
                                    </View>
                                }
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.onPressKey}>
                                {
                                    this.state.isKey
                                    ?
                                    <View style={styles.buttonActive}>
                                        <Icon name={Platform.OS === "ios" ? "ios-key" : "md-key"}  size={25} style={styles.iconActive}  />
                                        <Text style={styles.textActive}>Requires Key?</Text>
                                    </View>
                                    :
                                    <View style={styles.button}>
                                        <Icon name={Platform.OS === "ios" ? "ios-key" : "md-key"}  size={25} style={styles.icon}  />
                                        <Text style={styles.text}>Requires Key?</Text>
                                    </View>
                                }
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.onPressFee}>
                                {
                                    this.state.isFee
                                    ?
                                    <View style={styles.buttonActive}>
                                        <Icon name={Platform.OS === "ios" ? "ios-cash" : "md-cash"}  size={25} style={styles.iconActive}  />
                                        <Text style={styles.textActive}>Requires Fee?</Text>
                                    </View>
                                    :
                                    <View style={styles.button}>
                                        <Icon name={Platform.OS === "ios" ? "ios-cash" : "md-cash"}  size={25} style={styles.icon}  />
                                        <Text style={styles.text}>Requires Fee?</Text>
                                    </View>
                                }
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                            flex:1,
                            alignItems: 'center'
                            }}
                        >
                            <TouchableHighlight
                                style={styles.addLocation}
                                onPress={this.onAddLocation} 
                            >
                            <Text style={styles.textLocation}>SUBMIT LOCATION</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
              </View>
        );
    }
}
export default AddLocationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    button: {
        borderRadius: 10,
        width: 100, 
        height: 100, 
        margin: 5, 
        backgroundColor: '#FFF', 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#FF4354'
    },
    text:{
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#FF4354', 
        padding: 5,
        textAlign: 'center'
    },
    icon:{
        padding: 5, 
        color: '#FF4354'
    },
    buttonActive: {
        borderRadius: 10,
        width: 100, 
        height: 100, 
        margin: 5, 
        backgroundColor: '#FF4354', 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#FFF'
    },
    textActive:{
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#FFF', 
        padding: 5,
        textAlign: 'center'
    },
    iconActive:{
        padding: 5, 
        color: '#FFF'
    },
    addLocation: {
        alignItems: 'center',
        width: 200,
        margin: 10, 
        backgroundColor: '#FF4354',
        borderWidth: 1, 
        borderColor: '#FF4354',
        borderRadius: 10
    },
    textLocation: {
        fontSize: 16, 
        fontWeight: 'bold', 
        color: '#FFF', 
        paddingTop: 5,
        paddingBottom: 5,
    }
});