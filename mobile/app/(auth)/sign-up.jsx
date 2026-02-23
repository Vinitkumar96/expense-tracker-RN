// import { Text } from '@/components/themed-text'
// import { View } from '@/components/themed-view'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import * as React from 'react'
import { Pressable, StyleSheet,TouchableOpacity, TextInput, View,Text, Image } from 'react-native'
import { styles } from "@/assets/styles/auth.styles.js";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { Platform } from 'react-native';

export default function Page() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')
  const[error, setError] = React.useState()

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture code
      setPendingVerification(true)
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
       if (err.errors?.[0]?.code === "form_identifier_exists") {
        setError("That email address is already in use. Please try another.");
      } else {
        setError("An error occurred. Please try again.");
      }
      console.error(JSON.stringify(err, null, 2))
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({
          session: signUpAttempt.createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              // Handle pending session tasks
              // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
              console.log(session?.currentTask)
              return
            }

            router.replace('/')
          },
        })
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <View style={styles.verificationContainer} >
        <Text type="title" style={styles.verificationTitle} >
          Verify your email
        </Text>

        <TextInput
          style={[styles.verificationInput]}
          value={code}
          placeholder="Enter your verification code"
          placeholderTextColor="#9A8478"
          onChangeText={(code) => setCode(code)}
          keyboardType="numeric"
        />

        <Pressable
          onPress={onVerifyPress}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Verify</Text>
        </Pressable>

      </View>
    )
  }

  return (
    <KeyboardAwareScrollView style={{flex:1}} contentContainerStyle={{flexGrow:1}} enableOnAndroid={true} enableAutomaticScroll={true} >

    <View style={styles.container}>
      <View style={{ justifyContent:"center",alignItems:"center"}}>
      <Image source={require("../../assets/images/revenue-i2.png")} style={styles.illustration} />
      </View>

      <Text type="title" style={styles.title}>
        New Account
      </Text>

       {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

      {/* <Text >Email address</Text> */}
      <TextInput
      style={[styles.input, error && styles.errorInput]}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        placeholderTextColor="#9A8478"
        onChangeText={(email) => setEmailAddress(email)}
        keyboardType="email-address"
      />
      {/* <Text>Password</Text> */}
      <TextInput
        style={[styles.input, error && styles.errorInput]}
        placeholderTextColor="#9A8478"
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />

      <Pressable
        style={styles.button}
        onPress={onSignUpPress}
        disabled={!emailAddress || !password}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
           {Platform.OS === "ios"
              ? "Already have an account?"
              : "Already have an account?    "
           }
        </Text>
        <Link href="/sign-in">
          <Text type="link" style={styles.linkText}>Sign in</Text>
        </Link>
      </View>

    </View>
   </KeyboardAwareScrollView>
  )
}
