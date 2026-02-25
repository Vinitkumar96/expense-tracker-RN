// import { ThemedText } from '@/components/themed-text'
import { useClerk } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Alert, Pressable, StyleSheet,Text, TouchableOpacity } from 'react-native'
import { styles } from '../assets/styles/home.style'
import {COLORS} from "../constants/colors"
import {Ionicons} from "@expo/vector-icons"

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk()
 
  const handlesSignOut = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {text: "Cancel", style:"cancel"},
      {text:"Logout", style:"destructive", onPress:signOut}
    ])
  }


  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handlesSignOut}>
      <Ionicons name='log-out-outline' size={22} color={COLORS.text} />
    </TouchableOpacity>
  )
}
