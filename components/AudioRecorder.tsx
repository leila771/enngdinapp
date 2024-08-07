import React, { useState, useEffect } from 'react';
import { Button, View, Text } from 'react-native';
import { Audio } from 'expo-av';
import * as Permissions from 'expo-permissions';
import { AndroidAudioEncoder, AndroidOutputFormat, IOSAudioQuality, IOSOutputFormat, Recording } from 'expo-av/build/Audio';

const App = () => {
  const [recording, setRecording] = useState<Audio.Recording>();
  const [recordedUri, setRecordedUri] = useState('');
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
      setHasPermission(status === 'granted');
    };

    getPermissions();
  }, []);

  const startRecording = async () => {
    if (!hasPermission) {
      console.log('Permission to access microphone is denied');
      return;
    }

    try {
      const { recording, status } = await Audio.Recording.createAsync({
        web: {
          mimeType: 'audio/mp4'
        },
        android: {
          extension: '.acc',
          outputFormat: AndroidOutputFormat.DEFAULT,
          audioEncoder: AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.acc',
          outputFormat: IOSOutputFormat.MPEG4AAC,
          audioQuality: IOSAudioQuality.MEDIUM,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
      });

      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) {
      return;
    }

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI() as string;
      setRecordedUri(uri);
      setRecording(undefined)
      
      // Convert the recorded audio to a blob
      const response = await fetch(uri);
      const blob = await response.blob();
      console.log(blob)
      // const arrayBuffer = await blob.arrayBuffer();
      // const binaryData = new Uint8Array(arrayBuffer);
      
      
      // Send the blob to the Flask backend
      const formData = new FormData();
      formData.append('file', blob, 'recording.' + blob.type.replace(/(.*)\//, ''));
      
      const result = await fetch('http://192.168.0.101:5000/speech', {
        method: 'POST',
        
        headers: {
          'Accept': 'application/json',
          // 'Content-Type': 'application/json'
        },
        body: formData,
      });

      
      const responseData = await result.json();
      console.log('Server response:', responseData);
      
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      {recordedUri ? <Text>Recorded File: {recordedUri}</Text> : null}
    </View>
  );
};

export default App;
