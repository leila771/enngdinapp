import { Image, StyleSheet, Platform, TouchableOpacity, LogBox, } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import AudioRecord from "@/components/AudioRecorder"
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { Avatar, Button, Card, IconButton, Text, TextInput } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';

export default function HomeScreen() {
  const [result, setResult] = useState("")
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  async function translate() {
    setLoading(true)
    try {
      const response = await fetch('http://192.168.0.101:5000/translate', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text
        })
      })
      const data = await response.json()
      setResult(data)
    } catch (e) {
      console.log(e)
    }
    setLoading(false)
  }


  return (
    <>
      <Card style={[styles.card]}>
        <Card.Content style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" }}>
          <Text>English</Text>
          <IconButton icon={"swap-horizontal"}></IconButton>
          <Text>Pidgin</Text>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Title style={{ justifyContent: 'space-between', display: 'flex', alignItems: 'center', flexDirection: 'row' }} title={<>
          <Text>English</Text>
        </>} />
        <Card.Content style={styles.card_content}>
          <TextInput style={styles.input} mode='outlined' onChangeText={setText} value={text} multiline={true} numberOfLines={5} placeholder='english text here!!!'></TextInput>
        </Card.Content>
        <Card.Actions>
          <IconButton mode='contained' icon="microphone"></IconButton>
          <Button onPress={translate} mode={text.length ? 'contained' : 'contained-tonal'} disabled={text.length < 2 || loading}>translate</Button>
        </Card.Actions>
      </Card>
      <Card style={styles.card}>
        <Card.Title title="Pidgin" />
        <Card.Content style={styles.card_content}>
          <Text>{result}</Text>
        </Card.Content>
        <Card.Actions>
          <IconButton mode="contained" size={20} style={{ borderRadius: 0, }} icon={"content-copy"}></IconButton>
          <IconButton mode="contained" size={20} style={{ borderRadius: 0, }} icon={"star-outline"}></IconButton>
          <IconButton mode="contained" size={20} style={{ borderRadius: 0, }} icon={"share"}></IconButton>
        </Card.Actions>
      </Card>
      <AudioRecord />
    </>

  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    textAlign: 'center',
    color: 'white'
  },
  card: {
    margin: 10,
    backgroundColor: 'white'
  },
  card_content: {
    gap: 10
  },
  input: {
    paddingVertical: 10
  }
});

