import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import {MaterialIcons} from "@expo/vector-icons"
import LottieView from 'lottie-react-native'
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';

export default function TextToImageScreen() {

  const [imageData,setImageData] = useState(null)
  const [inputText, setInputText] = useState("")
  const [loading,setLoading] = useState(false)

  const generateImage = async () => {
    console.log('Generate Image') 
    setLoading(true) 
    setImageData(null)
    let headers = new Headers();
    headers.append("Authorization", "Bearer vk-rJb3gCzORmn3DmYTCdk5DH8ui5YQ5yL9aUqIxrKR0EwDT");

    let formdata = new FormData();
    formdata.append("prompt", inputText);
    formdata.append("style", "realistic"); 
    formdata.append("aspect_ratio", "1:1"); 
    formdata.append("high_res_result", "1");


    let requestOptions = {
        method: "POST",
        headers, 
        body: formdata,
    };

    try {
        const response = await fetch("https://api.vyro.ai/v2/image/generations", requestOptions);
        const status = response.status;
        
        console.log("Status:", status);
        const imageBytes = await response.arrayBuffer()
        const base64 = arrayBufferToBase64(imageBytes)
        setImageData(`data:image/png;base64,${base64}`)

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error:", errorData);
            return;
        }
    } catch (error) {
        console.error("Fetch error:", error);
    } finally{
      setLoading(false)
    }
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = ""
    const bytes = new Uint8Array(buffer)
    const len = bytes.byteLength
    for(let i=0; i<len; i++){
      binary+= String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  const downloadImage = async () => {
    if (!imageData) return;
  
    try {
      // Request permission to access media library
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please allow access to save images.');
        return;
      }
  
      // Define a local file path
      const fileUri = FileSystem.documentDirectory + "downloaded_image.png";
  
      // Write the image to the file
      await FileSystem.writeAsStringAsync(fileUri, imageData.split(",")[1], {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      // Save the image to the gallery
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync("Download", asset, false);
  
      Alert.alert("Success", "Image saved to gallery!");
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert("Error", "Failed to download image.");
    }
  };

  return (

    <View style={styles.container}>
      {
        imageData? 
        <Image 
        source={{uri:imageData}}
        style={{flex:1, resizeMode:'contain',width:'100%'}}
        />
        :loading? 
          <View style = {{flex:1, justifyContent:"center"}}>
            <LottieView 
              source={require('../assets/animation.json')}
              autoPlay loop 
              style = {{width:250,height:250}}
            />
          </View>
        :<View style = {{flex:1, justifyContent:"center"}}>
            <LottieView 
              source={require('../assets/ani11.json')}
              autoPlay loop 
              style = {{width:250,height:250}}
            />
          </View>
      }

      {imageData && (
        <TouchableOpacity 
          onPress={downloadImage} 
          style={styles.downloadButton}
        >
          <MaterialIcons 
            name="download" 
            size={35} 
            color="black"
          />
        </TouchableOpacity>
      )}
      
      <View 
      style={{
        flexDirection:"row",
        borderColor:'white', 
        borderWidth:2,
        margin:10,
        paddingLeft:10,
        paddingRight:5
      }}>
      <TextInput 
      placeholder='write the prompt here' 
      placeholderTextColor="#bbb"
      color="#fff"
      style={{flex:1}}
      value={inputText}
      onChangeText={(text) => setInputText(text)}
      ></TextInput>
      
      <TouchableOpacity onPress={generateImage} disabled={loading}>
        <MaterialIcons 
          name = "send" 
          size = {35} 
          color={loading?'gray':'blue'}
        />
      </TouchableOpacity>
      </View>
      
      <StatusBar style="auto" />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
  },
  loadingAnimation: {
    width: 250,
    height: 250,
  },
  inputContainer: {
    flexDirection: "row",
    borderColor: 'black', 
    borderWidth: 2,
    margin: 10,
    paddingLeft: 10,
    paddingRight: 5,
    alignItems: "center",
  },
  input: {
    flex: 1,
    color: 'white',
  },
  downloadButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
    borderRadius: 50,
    elevation: 5, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  }, 
  
});
