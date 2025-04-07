import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select an Option</Text>
      
      <View style={styles.grid}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('TextToImage')}>
          <Image source={require('../assets/text-to-image.webp')} style={styles.image} />
          <View style={styles.overlay}>
            <Text style={styles.cardTitle}>Text to Image</Text>
            <Text style={styles.cardSubtitle}>Create images from text</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('TextToPng')}>
          <Image source={require('../assets/text-to-png.webp')} style={styles.image} />
          <View style={styles.overlay}>
            <Text style={styles.cardTitle}>Text to PNG</Text>
            <Text style={styles.cardSubtitle}>Create transparent images</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('BackgroundRemover')}>
          <Image source={require('../assets/bg-remover.webp')} style={styles.image} />
          <View style={styles.overlay}>
            <Text style={styles.cardTitle}>Background Remover</Text>
            <Text style={styles.cardSubtitle}>Remove image backgrounds</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AiBackground')}>
          <Image source={require('../assets/ai-backgrounds.webp')} style={styles.image} />
          <View style={styles.overlay}>
            <Text style={styles.cardTitle}>AI Backgrounds</Text>
            <Text style={styles.cardSubtitle}>Add contextually relevant backgrounds</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AiBackground')}>
          <Image source={require('../assets/image-upscale.webp')} style={styles.image} />
          <View style={styles.overlay}>
            <Text style={styles.cardTitle}>Image Upscale</Text>
            <Text style={styles.cardSubtitle}>Increase image resolution</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AiBackground')}>
          <Image source={require('../assets/generative-fill.webp')} style={styles.image} />
          <View style={styles.overlay}>
            <Text style={styles.cardTitle}>Generative Fill</Text>
            <Text style={styles.cardSubtitle}>Fill missing image areas</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
  },
  card: {
    width: 160,
    height: 200,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#1E1E1E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
  },
  overlay: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flex: 1,
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    flexWrap: 'wrap', 
    overflow: 'hidden',
  },
  cardSubtitle: {
    color: '#aaa',
    fontSize: 11,
    flexWrap: 'wrap',
    overflow: 'hidden', 
  },
});