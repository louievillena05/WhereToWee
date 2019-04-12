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
    ScrollView,
    FlatList,
    Alert
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import firebase from 'react-native-firebase'

class ReviewLocationScreen extends Component {

    static navigationOptions =  {
        headerTitle: 'Write a Review',
        headerTintColor: '#FF4354',
        headerStyle: {
          backgroundColor: '#000',
        }
    }

    constructor(props) {
        super(props);
    
        this.state = {
            toiletID: null,
            latitude: null,
            longitude: null,
            name: null,
            address: null,
            isDisabled: false,
            isFee: false,
            isKey: false,
            reviews: [],
            reviewerName: null,
            reviewerComment: null,
            isLike: true,
            isDislike: false,
        };
    }

    onPressLike = () => {
        this.setState({
            isLike: !this.state.isLike,
            isDislike: this.state.isLike
        })
    }

    onPressDislike = () => {
        this.setState({
            isDislike: !this.state.isDislike,
            isLike: this.state.isDislike
        })
    }

    componentDidMount() {
        const { navigation } = this.props;
        const ref = firebase.firestore().collection('toilets').doc(JSON.parse(navigation.getParam('toilet')));
        ref.get().then((doc) => {
          if (doc.exists) {
            const toilet = doc.data();
            this.setState({
                toiletID: doc.id,
                latitude: toilet.latitude,
                longitude: toilet.longitude,
                name: toilet.name,
                address: toilet.address,
                isDisabled: toilet.isDisabled,
                isFee: toilet.isFee,
                isKey: toilet.isKey,
                reviews: toilet.reviews
            });
          } else {
            console.log("No such document!");
          }
        });
    }

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

    insertReview = () => {
        const review = {
            name: this.state.reviewerName,
            isLike: this.state.isLike,
            comment: this.state.reviewerComment
        };
        this.state.reviews.push(review);
        const updateRef = firebase.firestore().collection('toilets').doc(this.state.toiletID);
        updateRef.set({
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            name: this.state.name,
            address: this.state.address,
            isDisabled: this.state.isDisabled,
            isFee: this.state.isFee,
            isKey: this.state.isKey,
            reviews: this.state.reviews
        }).then((docRef) => {
            this.setState({
                name: '',
                comment: ''
            });
            Alert.alert(
                'Success!',
                'Congratulations! You have successfully add a review!',
                [
                    {text: 'OK', onPress: () => this.props.navigation.goBack()},
                ],
                {cancelable: false},
            );
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    }

    render() {
        // const { navigation } = this.props;
        // const toilet = navigation.getParam('toilet', 'null');
        // const { navigate } = this.props.navigation;
        return (
            <ScrollView>
                <Text style={{fontSize: 22, fontWeight: 'bold', color: '#FF4354', marginLeft: 10, marginRight: 10, textAlign: 'center'}}>{this.state.name}</Text>
                <Text style={{fontSize: 18, color: '#FF4354', marginLeft: 10, marginRight: 10, textAlign: 'center'}}>{this.state.address}</Text>
                <View style={{flex:1, flexDirection:'row', margin: 10, justifyContent: 'center', padding: 10}}>
                    <TouchableOpacity onPress={this.onPressLike} style={{ margin: 5 }}>
                        {
                            this.state.isLike
                            ?
                            <View style={styles.buttonActive}>
                                <Icon name={Platform.OS === "ios" ? "ios-thumbs-up" : "md-thumbs-up"}  size={25} style={styles.iconActive} />
                                <Text style={styles.textActive}>Like</Text>
                            </View>
                            :
                            <View style={styles.button}>
                                <Icon name={Platform.OS === "ios" ? "ios-thumbs-up" : "md-thumbs-up"}  size={25} style={styles.icon} />
                                <Text style={styles.text}>Like</Text>
                            </View>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onPressDislike} style={{ margin: 5 }}>
                        {
                            this.state.isDislike
                            ?
                            <View style={styles.buttonActive}>
                                <Icon name={Platform.OS === "ios" ? "ios-thumbs-down" : "md-thumbs-down"}  size={25} style={styles.iconActive}  />
                                <Text style={styles.textActive}>Dislike</Text>
                            </View>
                            :
                            <View style={styles.button}>
                                <Icon name={Platform.OS === "ios" ? "ios-thumbs-down" : "md-thumbs-down"}  size={25} style={styles.icon}  />
                                <Text style={styles.text}>Dislike</Text>
                            </View>
                        }
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        padding: 5
                    }}>
                    <TextInput
                        style={{height: 50, borderColor: '#FF4354', borderBottomWidth:1, marginLeft: 10, marginRight: 10, fontSize: 18, textAlign: 'center'}}
                        onChangeText={(reviewerName) => this.setState({reviewerName})}
                        placeholder="Reviewer name here"
                        value={this.state.reviewerName}
                    /> 
                    <TextInput
                        style={{height: 100, borderColor: '#FF4354', borderBottomWidth:1, marginLeft: 10, marginRight: 10, fontSize: 18, textAlign: 'center'}}
                        onChangeText={(reviewerComment) => this.setState({reviewerComment})}
                        multiline = {true}
                        numberOfLines = {3}
                        placeholder="Write your review here"
                        value={this.state.reviewerComment}
                    /> 
                </View>
                <View
                    style={{
                    flex:1,
                    alignItems: 'center'
                    }}
                >
                    <TouchableHighlight
                        style={styles.addReview}
                        onPress={this.insertReview} 
                    >
                    <Text style={styles.textReview}>SUBMIT REVIEW</Text>
                    </TouchableHighlight>
                </View>
                
                {/* <View style={{flex:1}}>
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
                        data={this.state.reviews}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index}
                        ItemSeparatorComponent={this.renderSeparator}
                    />
                </View> */}
            </ScrollView>
        );
    }
}
export default ReviewLocationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    button: {
        borderRadius: 10,
        width: 100, 
        height: 100, 
        padding: 10, 
        backgroundColor: '#FFF', 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#FF4354'
    },
    text:{
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#FF4354', 
        padding: 5
    },
    icon:{
        padding: 5, 
        color: '#FF4354'
    },
    buttonActive: {
        borderRadius: 10,
        width: 100, 
        height: 100, 
        padding: 10, 
        backgroundColor: '#FF4354', 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#FFF'
    },
    textActive:{
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#FFF', 
        padding: 5
    },
    iconActive:{
        padding: 5, 
        color: '#FFF'
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
        fontWeight: 'bold', 
        color: '#FFF', 
        paddingTop: 5,
        paddingBottom: 5,
    }
});