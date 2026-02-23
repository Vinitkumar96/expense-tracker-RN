// import { Text } from '@/components/themed-text'
// import { View } from '@/components/themed-view'
import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import * as React from 'react'
import { Pressable, StyleSheet, TextInput, View,Text,TouchableOpacity, Image } from 'react-native'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from '../../assets/styles/auth.styles'
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { Platform } from 'react-native';

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [code, setCode] = React.useState('')
  const [showEmailCode, setShowEmailCode] = React.useState(false)
  const[error,setError] = React.useState("")

  // Handle the submission of the sign-in form
  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({
          session: signInAttempt.createdSessionId,
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
      } 
  
      else if (signInAttempt.status === 'needs_second_factor') {
        // Check if email_code is a valid second factor
        // This is required when Client Trust is enabled and the user
        // is signing in from a new device.
        // See https://clerk.com/docs/guides/secure/client-trust
        const emailCodeFactor = signInAttempt.supportedSecondFactors?.find(
          (factor) => factor.strategy === 'email_code',
        )

        if (emailCodeFactor) {
          await signIn.prepareSecondFactor({
            strategy: 'email_code',
            emailAddressId: emailCodeFactor.emailAddressId,
          })
          setShowEmailCode(true)
        }
      } 
   
      else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      if (err.errors?.[0]?.code === "form_password_incorrect") {
        setError("Password is incorrect. Please try again.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  }, [isLoaded, signIn, setActive, router, emailAddress, password])

  // Handle the submission of the email verification code
  const onVerifyPress = React.useCallback(async () => {
    if (!isLoaded) return

    try {
      const signInAttempt = await signIn.attemptSecondFactor({
        strategy: 'email_code',
        code,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({
          session: signInAttempt.createdSessionId,
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
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }, [isLoaded, signIn, setActive, router, code])

  // Display email code verification form
  if (showEmailCode) {
    return (
      <View >
        <Text type="title" >
          Verify your email
        </Text>
        <Text >
          A verification code has been sent to your email.
        </Text>
        <TextInput
         
          value={code}
          placeholder="Enter verification code"
          placeholderTextColor="#666666"
          onChangeText={(code) => setCode(code)}
          keyboardType="numeric"
        />
        <Pressable
         
          onPress={onVerifyPress}
        >
          <Text>Verify</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <KeyboardAwareScrollView style={{flex:1}} contentContainerStyle={{flexGrow:1}}
     enableOnAndroid={true} enableAutomaticScroll={true} 
     extraScrollHeight={30}
     >


    <View style={styles.container} >

      <View style={{alignItems:"center"}}>
          <Image source={require("../../assets/images/revenue-i4.png")} style={styles.illustration} />
      </View>
      

      <Text type="title" style={styles.title} >
        Welcome Back
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


      <TextInput
      style={[styles.input]}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        placeholderTextColor="#9A8478"
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        keyboardType="email-address"
      />
  
      <TextInput
        style={[styles.input]}
        value={password}
        placeholder="Enter password"
         placeholderTextColor="#9A8478"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />

      <Pressable
        style={styles.button}
        onPress={onSignInPress}
        disabled={!emailAddress || !password}
      >
        <Text style={styles.buttonText}>Sign in</Text>
      </Pressable>

      <View style={styles.footerContainer} >
        <Text style={styles.footerText}>{
          Platform.OS === "ios" ? (
            "Don't have an account ?"
          ): (
            "Don't have an account ?    "
          )
          }</Text>
        <Link href="/sign-up">
          <Text type="link" style={styles.linkText}>Sign up</Text>
        </Link>
      </View>
    </View>

    </KeyboardAwareScrollView>
  )
}

