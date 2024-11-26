import { View, Text } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RadioButton, RadioGroup } from "@/components/RadioButton";

export default function Settings() {
  const [theme, setTheme] = useState("Dark");
  useEffect(() => {
    (async () => {
      setTheme(JSON.parse(await AsyncStorage.getItem("theme")));
    })();
  }, []);
  useEffect(() => {
    (async () => {
      await AsyncStorage.setItem("theme", JSON.stringify(theme));
    })();
  }, [theme]);

  return (
    <View style={{ flex: 1 }}>
      <View>
        <RadioGroup
          groupName={"Theme"}
          selectedValue={theme}
          setSelectedValue={setTheme}
        >
          <RadioButton label={"Dark"} value={"Dark"} />
          <RadioButton label={"Light"} value={"Light"} />
        </RadioGroup>
      </View>
    </View>
  );
}
