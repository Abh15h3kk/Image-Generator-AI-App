import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import {MaterialIcons} from "@expo/vector-icons"
import LottieView from 'lottie-react-native'
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';

export default function BackgroundRemoverScreen() {

  const [imageData,setImageData] = useState(null)
  const [loading,setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null);

  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission required", "Please allow access to select images.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Function to upload and remove background
  const removeBackground = async () => {
    if (!selectedImage) {
      Alert.alert("No Image", "Please select an image first.");
      return;
    }

    setLoading(true);
    setImageData(null);

    let headers = new Headers();
    headers.append("Authorization", "Bearer vk-rJb3gCzORmn3DmYTCdk5DH8ui5YQ5yL9aUqIxrKR0EwDT");

    let formData = new FormData();
    formData.append("image", {
      uri: selectedImage,
      name: "upload.jpg",
      type: "image/jpeg",
    });

    let requestOptions = {
      method: "POST",
      headers,
      body: formData,
    };

    try {
      const response = await fetch("https://api.vyro.ai/v2/image/background/remover", requestOptions);
      const status = response.status;

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData);
        Alert.alert("Error", "Failed to process image.");
        return;
      }

      const imageBytes = await response.arrayBuffer();
      const base64 = arrayBufferToBase64(imageBytes);
      setImageData(`data:image/png;base64,${base64}`);
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
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
    {!selectedImage && !imageData && !loading ? (
      // Initial Animation when screen loads
      <View style={{ flex: 1, justifyContent: "center" }}>
        <LottieView
          source={require("../assets/ani3.json")}
          autoPlay
          loop
          style={{ width: 800, height: 800 }}
        />
      </View>
    ) : loading ? (
      // Loading Animation when processing
      <View style={{ flex: 1, justifyContent: "center" }}>
        <LottieView
          source={require("../assets/animation.json")}
          autoPlay
          loop
          style={{ width: 250, height: 250 }}
        />
      </View>

    ) : imageData ? (
      // Show the generated image after processing
      <Image source={{ uri: imageData }} style={styles.previewImage} />
    ) : (
      // Show selected image before processing
      <Image source={{ uri: selectedImage }} style={styles.previewImage} />
    )}
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

      {/* Buttons Container */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity onPress={pickImage} style={styles.button}>
          <MaterialIcons name="photo-library" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={removeBackground} style={styles.button} disabled={loading}>
          <MaterialIcons name="edit" size={30} color="white" />
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
    alignItems: "center",
    justifyContent: "center",
  },
  previewImage: {
    width: "100%",
    height: "60%", // Adjust so image takes most space
    resizeMode: "contain",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    alignItems: "center",
    flex: 1, // Ensure equal width
  },
  bottomButtons: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    width: "90%",
    justifyContent: "space-between",
  },
  downloadButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
    borderRadius: 50,
    elevation: 5,
  },
});

