import { Stack } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'

const MainLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index"/>
      <Stack.Screen name="recommendations"/>
      <Stack.Screen name="history"/>
      <Stack.Screen name="historyresult"/>
    </Stack>
  )
}

export default MainLayout

const styles = StyleSheet.create({})