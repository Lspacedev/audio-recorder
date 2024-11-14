import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getData = async (key, defaultValue) => {
  try {
    const value = await AsyncStorage.getItem(key);
    console.log({ value });
    // if (typeof value !== "object" && !Array.isArray(value) && x !== null) {
    const initial = JSON.parse(value);
    return initial || defaultValue;
    // } else {
    //   return defaultValue;
    // }
  } catch (e) {
    // error reading value
  }
};
const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
  }
};
function useAsyncStorage(key, defaultValue) {
  const [value, setValue] = useState();
  useEffect(() => {
    (async () => {
      const data = await getData(key, defaultValue);
      setValue(data);
    })();
  }, []);
  useEffect(() => {
    (async () => {
      await storeData(key, JSON.stringify(value));
    })();
  }, [key, value]);

  return [value, setValue];
}

export default useAsyncStorage;
