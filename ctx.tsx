import {
  useContext,
  createContext,
  type PropsWithChildren,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
  signIn: (username: string, password: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
};
const AuthContext = createContext<AuthContextType>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);

  return value;
}
const getData = async (storageKey: string) => {
  try {
    const value = await AsyncStorage.getItem(storageKey);

    let data = value !== null ? JSON.parse(value) : value;

    return data;
  } catch (error) {
    // error reading value
    console.log(error);
  }
};
export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <AuthContext.Provider
      value={{
        signIn: async (username, password) => {
          let data = await getData("reg");
          // Perform sign-in logic here
          type Obj = {
            userName: string;
            password: string;
          };
          if (data !== null) {
            const user = data.filter(
              (account: Obj) => account.userName === username
            );
            if (user.length > 0) {
              if (user[0].password === password) {
                setSession("logged-in");
                await AsyncStorage.setItem("curr", JSON.stringify(user[0]));
              }
            }
          }
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
