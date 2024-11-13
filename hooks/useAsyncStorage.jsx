import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getData = async (key, defaultValue) => {
  try {
    const value = await AsyncStorage.getItem(key);

    if (typeof value === "object" && !Array.isArray(value) && x !== null) {
      const initial = JSON.parse(value);
      console.log({ initial });
      return initial;
    } else {
      return defaultValue;
    }
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
  const [value, setValue] = useState(() => {
    return getData(key, defaultValue);
  });

  useEffect(() => {
    storeData(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
export default useAsyncStorage;
