import { SignOutButton } from '@/components/sign-out-button'
import { SignedIn, SignedOut, useSession, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { StyleSheet, View,Text } from 'react-native'
import useTransactions from '../../hooks/useTransactions'
import { useEffect } from 'react'
import PageLoader from '../../components/PageLoader'

export default function Page() {
  const { user } = useUser()
  const {transactions,summary,isLoading, loadData,deleteTransaction}= useTransactions(user.id)

  // If your user isn't appearing as signed in,
  // it's possible they have session tasks to complete.
  // Learn more: https://clerk.com/docs/guides/configure/session-tasks
  const { session } = useSession()
  console.log(session?.currentTask)

  useEffect(()=>{
    loadData()
  },[loadData])

  // console.log("transactions",transactions);
  // console.log("summary",summary);
  // console.log(user.id);

  if(isLoading){
    return <PageLoader/>
  }

  return (
    <View>
      

      {/* Show the sign-out button when the user is signed in */}
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <SignOutButton />
      </SignedIn>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
})