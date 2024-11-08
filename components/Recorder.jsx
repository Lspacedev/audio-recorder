import { Stack } from "expo-router";
import {
  ScrollView,
  View,
  Text,
  Image,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import { useState, useEffect } from "react";

export default function Recorder() {
  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.scrollView}></ScrollView>
      <StatusBar backgroundColor="#010709" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
