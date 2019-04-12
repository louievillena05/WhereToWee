import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Button,
    Platform,
    TouchableHighlight,
    TouchableOpacity,
    Linking,
    ScrollView,
    FlatList,
    Share
} from "react-native";
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Icon from "react-native-vector-icons/Ionicons";

import googleMapStyle from '../google_map_style.json';

const defaultRegion =  {
    latitude: 42.882004,
    longitude: 74.582748,
    latitudeDelta: 0.003,
    longitudeDelta: 0.003
}

class ToiletScreen extends Component {

    static navigationOptions =  {
        headerTitle: 'Toilet List',
        headerTintColor: '#FF4354',
        headerStyle: {
          backgroundColor: '#000',
        }
    }

    constructor(props) {
        super(props);
    
        this.openDirection = this.openDirection.bind(this);
        this.onShare = this.onShare.bind(this);

        this.state = {
          region: defaultRegion,
          mapStyle: googleMapStyle,
        };
    }

    openDirection (latitude, longitude){
        Platform.select({
            ios: () => {
                Linking.openURL('http://maps.apple.com/maps?daddr=' + latitude + ',' + longitude);
            },
            android: () => {
                Linking.openURL('http://maps.google.com/maps?daddr=' + latitude + ',' + longitude);
            }
        })();
    }

    onShare(shareMessage, url){
        try {
          const result = Share.share({
            message:
                shareMessage,
            url:
                url
          });
    
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error) {
          alert(error.message);
        }
    };

    renderItem = ({ item }) => {
        return (
            <View
                style={{flex: 1, flexDirection: 'row'}}
            >
                {
                    item.isLike
                    ?
                    <Icon name={Platform.OS === "ios" ? "ios-thumbs-up" : "md-thumbs-up"}  size={50} color="#FF4354" style={{ padding: 10 }} />
                    :
                    <Icon name={Platform.OS === "ios" ? "ios-thumbs-down" : "md-thumbs-down"}  size={50} color="#FF4354" style={{ padding: 10 }} />
                }
                <View style={{flex:1, justifyContent: 'center'}}>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>{item.name}</Text>  
                    <Text>{item.comment}</Text>
                </View>
            </View>
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

    render() {
        const { navigation } = this.props;
        const toilet = navigation.getParam('toilet', 'null');
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <View style={{flex:1}}>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={{flex:1}}
                        region={{
                            latitude: toilet.latitude,
                            longitude: toilet.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                        showsUserLocation={true}
                        showsMyLocationButton={true}
                        customMapStyle={this.state.mapStyle}
                    >
              
                    {!!toilet.latitude && !!toilet.longitude && <MapView.Marker
                        image={require('../images/map-marker/marker-min.png')}
                        coordinate={{"latitude":toilet.latitude,"longitude":toilet.longitude}}
                        title={toilet.name}
                    />}

                    </MapView>
                    <TouchableHighlight
                        style={styles.openDirectionButton}
                        onPress={() => this.openDirection(toilet.latitude, toilet.longitude)} 
                    >
                    <Icon name={Platform.OS === "ios" ? "ios-compass" : "md-compass"}  size={50} color="#FF4354" />
                    </TouchableHighlight>
                </View>
                <View 
                    style={{
                        flex:2, 
                    }}>
                <ScrollView>
                    <View
                        style={{flex:1, flexDirection: 'row', justifyContent: 'flex-end'}}
                    >
                        <TouchableOpacity
                            // style={styles.addReview}
                            onPress={() => navigate('Review', { toilet: `${JSON.stringify(toilet.key)}` })} 
                        >
                        <Text style={styles.textReview}>ADD A REVIEW</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            // style={styles.addShare}
                            onPress={() => this.onShare(
                                Platform.OS === "ios" 
                                ? 
                                toilet.name + " | http://maps.apple.com/maps?daddr=" + toilet.latitude + ',' + toilet.longitude 
                                : 
                                toilet.name + " | http://maps.google.com/maps?daddr=" + toilet.latitude + ',' + toilet.longitude 
                            ,
                                Platform.OS === "ios" 
                                ? 
                                "http://maps.apple.com/maps?daddr=" + toilet.latitude + ',' + toilet.longitude 
                                : 
                                "http://maps.google.com/maps?daddr=" + toilet.latitude + ',' + toilet.longitude 
                            )} 
                        >
                        <Text style={styles.textShare}>SHARE</Text>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{alignItems: 'center'}}
                    >
                    <Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#FF4354', marginLeft: 20, marginRight: 20}}>{toilet.name}</Text>  
                    <Text style={{textAlign: 'center', fontSize: 18, color: '#FF4354', marginLeft: 20, marginRight: 20}}>{toilet.address}</Text>
                    {
                        toilet.isDisabled
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
                    {
                        toilet.isKey
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
                    {
                        toilet.isFee
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
                    </View>
                    <Text
                        style={{
                            padding: 5,
                            fontSize: 18, 
                            fontWeight: 'bold',
                            color: '#FF4354',
                            textAlign: 'center'
                        }}
                    >
                    Reviews
                    </Text>
                    <FlatList
                        data={toilet.reviews}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index}
                        ItemSeparatorComponent={this.renderSeparator}
                    />
                </ScrollView>
                </View>
            </View>
        );
    }
}
export default ToiletScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 300,
        marginTop: 10, 
        backgroundColor: '#FFF',
        borderWidth: 1, 
        borderRadius: 5,
        borderColor: '#FF4354'
    },
    text:{
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#FF4354', 
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 10,
        paddingLeft: 5
    },
    icon:{
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 5,
        paddingLeft: 70,  
        color: '#FF4354'
    },
    buttonActive: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 300,
        marginTop: 10, 
        backgroundColor: '#FF4354',
        borderWidth: 1,  
        borderRadius: 5,
        borderColor: '#FFF'
    },
    textActive:{
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#FFF', 
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 10,
        paddingLeft: 5
    },
    iconActive:{
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 5,
        paddingLeft: 70, 
        color: '#FFF'
    },
    openDirectionButton: {
        alignItems:'center',
        justifyContent:'center',
        width:50,
        height:50,
        borderRadius:50,
        position: 'absolute',                                              
        right: 5,
        bottom: 5
    },
    addReview: {
        alignItems: 'center',
        width: 200,
        margin: 10, 
        backgroundColor: '#FF4354',
        borderWidth: 1, 
        borderColor: '#FF4354',
        borderRadius: 10
    },
    textReview: {
        fontSize: 16, 
        color: '#FF4354', 
        padding: 5
    },
    addShare: {
        alignItems: 'center',
        width: 120,
        backgroundColor: '#FF4354',
        borderWidth: 1, 
        borderColor: '#FF4354',
        borderRadius: 10
    },
    textShare: {
        fontSize: 16, 
        color: '#FF4354', 
        padding: 5
    }
});