import { Text } from "react-native";
import { Redirect, Stack, usePathname } from "expo-router";

import { useSession } from "../../ctx";
import { useEffect } from "react";

export default function AppLayout() {
  const pathname = usePathname();
  const authRoutes = ["/sign-in", "/register"];
  const { session, isLoading } = useSession();
  useEffect(() => {
    console.log(pathname, session);
  }, [pathname]);
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session && !authRoutes.includes(pathname)) {
    return <Redirect href={{ pathname: "/sign-in" }} />;
  }
  if (session && authRoutes.includes(pathname)) {
    return <Redirect href={{ pathname: "/home" }} />;
  }

  return <Stack />;
}
