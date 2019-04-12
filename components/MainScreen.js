import React, { Component } from "react";
import SplashScreen from 'react-native-splash-screen';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {Platform, StyleSheet, Image, Text, View, Button, TouchableHighlight} from 'react-native';

import firebase from 'react-native-firebase';
import googleMapStyle from '../google_map_style.json';
import AddLocationButton from './AddLocationButton';
// import Geolocation from 'react-native-geolocation-service';

const defaultRegion =  {
    latitude: 42.882004,
    longitude: 74.582748,
    latitudeDelta: 0.003,
    longitudeDelta: 0.003
}

class MainScreen extends Component {

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

    constructor(props) {
        super(props);

        this.ref = firebase.firestore().collection('toilets')
        this.unsubscribe = null;
    
        this.state = {
          region: defaultRegion,
          mapStyle: googleMapStyle,
          markers: [],
          error: null
        };
    }

    onCollectionUpdate = (querySnapshot) => {
      const markers = [];
      querySnapshot.forEach((doc) => {
        const { name, address, latitude, longitude, isDisabled, isKey, isFee, reviews, isVerified } = doc.data();
        markers.push({
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
          isVerified
        });
      });
      this.setState({ 
        markers,
        loading: false,
     });
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
          },
          (error) => this.setState({ error: error.message }),
          { enableHighAccuracy: true, timeout: 20000 },
        );
        
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate) 
        SplashScreen.hide();
    }

    componentWillUnmount() {
      this.unsubscribe();
    }
      
    render() {
        return (
            this.state.error
            ?
            <Text>{this.state.error}</Text>
            :
            <View style={styles.map}>
                <MapView 
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    region={this.state.region}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    customMapStyle={this.state.mapStyle}
                >

                {this.state.markers.map(marker => (
                    <MapView.Marker
                      image={require('../images/map-marker/marker-min.png')}
                      coordinate={{"latitude":marker.latitude,"longitude":marker.longitude}}
                      title={marker.name}>
                      <MapView.Callout tooltip onPress={()=>this.props.navigation.navigate('Toilet', { toilet: marker })}>
                        <View style={{ alignItems: "center", backgroundColor: '#fff', padding: 5, borderRadius: 10 }}>
                            <Text style={{ fontWeight: 'bold' }}>{marker.name}</Text>
                            <Text style={{ color: "blue" }}>{"Click to view details"}</Text>
                        </View>
                      </MapView.Callout>
                    </MapView.Marker>
                  ))}
          
                </MapView>
                <AddLocationButton />
            </View>
        );
    }
}
export default MainScreen;

const styles = StyleSheet.create({
    map: {
        flex: 1
    }
});