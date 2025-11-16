// src/screens/CameraScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  AppState,
  AppStateStatus,
  Platform,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, useCameraDevice, PhotoFile, CameraPermissionStatus } from 'react-native-vision-camera';
import log from '../utils/logger'; // Add logger import

const CameraScreen: React.FC = () => {
  
  const camera = useRef<Camera | null>(null);
  const device = useCameraDevice('back');

  const [isActive, setIsActive] = useState(AppState.currentState === 'active');
  const [photo, setPhoto] = useState<PhotoFile | null>(null);
  const [isTaking, setIsTaking] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<CameraPermissionStatus | 'pending'>('pending');

  //handle app state changes
  useEffect(() => {
    const sub = AppState.addEventListener('change', handleAppStateChange);
    return () => sub.remove();
  }, []);

  const handleAppStateChange = (next: AppStateStatus) => {
    setIsActive(next === 'active');
  };

  //request permission
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const status: CameraPermissionStatus = await Camera.getCameraPermissionStatus();
        log.info(`INFO: Camera permission status - ${status}`);
        //if permission status is not-determined, request permission
        if (status === 'not-determined') {
          const newStatus: CameraPermissionStatus = await Camera.requestCameraPermission();
          setPermissionStatus(newStatus);
        } else {
          setPermissionStatus(status); 
        }
      } catch (e) {
        console.warn('Permission check error', e);
        log.fatal("FATAL: CameraScreen - permission check failure");
        setPermissionStatus('denied');
      }
    };

    checkPermission();
  }, []);

  //take a photo
  const takePhoto = async () => {
    if (!camera.current || isTaking) return;
    setIsTaking(true);
    try {
      const p = await camera.current.takePhoto({ enableShutterSound: true });
      setPhoto(p);
    } catch (e) {
      console.error('takePhoto error', e);
      log.error("ERROR: CameraScreen - photo capture failed");
      Alert.alert('Error', 'Could not take photo. Please try again.');
    } finally {
      setIsTaking(false);
    }
  };

  //handle permission denied
  const handleRequestPermissionAgain = async () => {
    try {
      const newStatus: CameraPermissionStatus = await Camera.requestCameraPermission();

      if (newStatus === 'granted') {
        setPermissionStatus(newStatus);
      } else {
        log.warn("WARNING: CameraScreen - user denied camera permission again");
        Alert.alert(
          'Permission Denied',
          'Please enable camera access in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => {
                if (Platform.OS === 'ios') Linking.openURL('app-settings:');
                else Linking.openSettings();
              },
            },
          ]
        );
      }
    } catch (e) {
      log.error("ERROR: CameraScreen - error requesting camera permission");
      console.warn(e);
    }
  };

  //permision request pending
  if (permissionStatus === 'pending') {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.message}>Checking camera permission...</Text>
      </SafeAreaView>
    );
  }
  //permission denied or restricted
  if (permissionStatus === 'denied' || permissionStatus === 'restricted') {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.title}>Camera Access Required</Text>
        <Text style={styles.message}>
          This app requires camera access to take photos.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleRequestPermissionAgain}>
          <Text style={styles.buttonText}>Request Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  //if photo is taken, show preview
  if (photo) {
    return (
      log.info("INFO: CameraScreen - displaying photo preview"),
      <SafeAreaView style={styles.previewContainer}>
        <Image source={{ uri: `file://${photo.path}` }} style={styles.previewImage} />
        <View style={styles.previewActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => setPhoto(null)}>
            <Text style={styles.actionText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.saveButton]}
            onPress={() => Alert.alert('Photo selected', 'Save the photo on database')}
          >
            <Text style={styles.actionText}>Use Photo</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  //if no camera device found
  if (!device) {
    log.error("ERROR: CameraScreen - no camera device available");
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.msg}>No camera device available.</Text>
      </SafeAreaView>
    );
  }
  //main camera view
  return (
    <SafeAreaView style={styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        photo
        enableZoomGesture
      />

      <SafeAreaView style={styles.uiContainer} pointerEvents="box-none">
        <Text style={styles.header}>Camera</Text>
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePhoto}
            disabled={isTaking}
          />
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  title: { fontSize: 22, marginBottom: 12, color: '#fff' },
  message: { textAlign: 'center', color: '#fff', marginBottom: 20 },
  button: { backgroundColor: '#222', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: '600' },
  uiContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 40 },
  header: { position: 'absolute', top: 12, alignSelf: 'center', color: '#fff', fontSize: 18, fontWeight: '600' },
  controls: { width: '100%', alignItems: 'center' },
  captureButton: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#fff', borderWidth: 4, borderColor: 'rgba(255,255,255,0.6)' },
  previewContainer: { flex: 1, backgroundColor: '#000' },
  previewImage: { flex: 1, resizeMode: 'cover' },
  previewActions: { position: 'absolute', bottom: 28, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-evenly' },
  actionButton: { backgroundColor: 'rgba(0,0,0,0.6)', paddingVertical: 12, paddingHorizontal: 18, borderRadius: 10 },
  saveButton: { backgroundColor: '#111' },
  actionText: { color: '#fff', fontWeight: '600' },
  msg: { color: '#888' },
});

export default CameraScreen;
