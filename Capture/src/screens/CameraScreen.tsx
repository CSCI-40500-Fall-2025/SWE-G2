// src/screens/ImageUploadScreen.tsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary, Asset } from 'react-native-image-picker';
import API_BASE from "../utils/api";
import log from '../utils/logger';

type Visibility = 'public' | 'private' | 'shared';

const ImageUploadScreen: React.FC = () => {
  // FIXED: Store the full asset object, not just the URI string
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [caption, setCaption] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('private');
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.8, // Reduced slightly for faster uploads
      });

      if (result.didCancel) return;

      const asset = result.assets?.[0];
      if (!asset || !asset.uri) {
        Alert.alert('Error', 'Unable to select image');
        return;
      }

      // Store the whole asset to access .type and .fileName later
      log.info('Image selected:', asset.uri);
      setSelectedAsset(asset);

    } catch (e) {
      console.error('pickImage error', e);
      Alert.alert('Error', 'Could not open image picker.');
    }
  };

  const uploadEntry = async () => {
    if (!selectedAsset || !selectedAsset.uri) {
      Alert.alert('No image', 'Please choose an image before uploading.');
      return;
    }
  
    setIsUploading(true);
    try {
      const form = new FormData();

      // --- FIX 1: FILE DATA ---
      // We must provide uri, name, and type exactly as the server expects.
      form.append('photo', {
        uri: Platform.OS === 'ios' ? selectedAsset.uri.replace('file://', '') : selectedAsset.uri,
        name: selectedAsset.fileName || `upload_${Date.now()}.jpg`,
        type: selectedAsset.type || 'image/jpeg', 
      } as any);

      // --- FIX 2: SCHEMA MATCHING ---
      form.append('description', caption); // Matches schema 'description'
      form.append('visibility', visibility); // Matches schema 'visibility'
      
      // --- FIX 3: USER ID ---
      // Your Schema requires an ObjectId. "12345" crashes Mongoose.
      // TODO: Replace this with the real User ID from your Auth Context.
      // This is a dummy valid ObjectId for testing:
      form.append('userID', "654321654321654321654321"); 
  
      log.info(`Uploading file: ${selectedAsset.fileName} type: ${selectedAsset.type}`);
  
      const res = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        headers: {
          // IMPORTANT: Do NOT set 'Content-Type': 'multipart/form-data'
          // The browser/engine sets the boundary automatically.
          Accept: 'application/json',
        },
        body: form,
      });
  
      if (!res.ok) {
        const t = await res.text();
        log.error('Upload failed with response:', t);
        Alert.alert('Upload failed', `Server error: ${res.status}`);
      } else {
        const data = await res.json();
        log.info('Upload success:', data);
        Alert.alert('Success', 'Your journal entry was uploaded.');
        
        // Reset Form
        setSelectedAsset(null);
        setCaption('');
        setVisibility('private');
      }
    } catch (e) {
      console.error('Network error during upload:', e);
      Alert.alert('Upload error', 'Network request failed. Check your connection.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">

          <Text style={styles.header}>Create Journal Entry</Text>

          {/* Image section */}
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage} disabled={isUploading}>
            {selectedAsset?.uri ? (
              <Image source={{ uri: selectedAsset.uri }} style={styles.previewImage} />
            ) : (
              <Text style={styles.pickText}>Tap to choose an image</Text>
            )}
          </TouchableOpacity>

          {/* Journal fields */}
          <View style={styles.journalContainer}>
            <Text style={styles.label}>Caption</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Write about this moment..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              multiline
              value={caption}
              onChangeText={setCaption}
              editable={!isUploading}
            />

            <Text style={[styles.label, { marginTop: 12 }]}>Visibility</Text>

            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={visibility}
                onValueChange={(val) => setVisibility(val as Visibility)}
                enabled={!isUploading}
                dropdownIconColor="#fff"
                style={{ color: '#fff' }} // Android text color
              >
                <Picker.Item label="Private (only you)" value="private" />
                <Picker.Item label="Shared (selected people)" value="shared" />
                <Picker.Item label="Public (anyone)" value="public" />
              </Picker>
            </View>

            <TouchableOpacity style={[styles.uploadButton]} onPress={uploadEntry} disabled={isUploading}>
              {isUploading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.uploadText}>Upload Entry</Text>
              )}
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ImageUploadScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    alignSelf: 'center',
    marginTop: 16,
  },
  imagePicker: {
    marginTop: 20,
    width: '90%',
    height: 300,
    backgroundColor: '#111',
    alignSelf: 'center',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
  },
  pickText: { color: '#888' },
  previewImage: { width: '100%', height: '100%', borderRadius: 12, resizeMode: 'cover' },
  journalContainer: { padding: 16, marginTop: 10 },
  label: { color: '#fff', marginBottom: 8, fontWeight: '600' },
  textInput: {
    minHeight: 100,
    maxHeight: 220,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 12,
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.02)',
    textAlignVertical: 'top', // Fix for Android multiline
  },
  pickerWrapper: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  uploadButton: {
    marginTop: 20,
    backgroundColor: '#1a1a1a',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  uploadText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});