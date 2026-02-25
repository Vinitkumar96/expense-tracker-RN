import { SignOutButton } from '@/components/sign-out-button'
import { SignedIn, SignedOut, useSession, useUser } from '@clerk/clerk-expo'
import { Link, router, useRouter } from 'expo-router'
import { StyleSheet, View,Text,Image, TouchableOpacity, FlatList, Alert, RefreshControl } from 'react-native'
import useTransactions from '../../hooks/useTransactions'
import { useEffect, useState } from 'react'
import PageLoader from '../../components/PageLoader'
import { styles } from '../../assets/styles/home.style'
import { Ionicons } from '@expo/vector-icons'
import { BalanceCard } from '../../components/BalanceCard'
import { TransactionItem } from '../../components/TransactionItem'
import NoTransactionsFound from '../../components/NoTransactionsFound'

export default function Page() {
  const { user } = useUser()
  if(!user){
    return <PageLoader/>
  }
  const {transactions,summary,isLoading, loadData,deleteTransaction}= useTransactions(user.id)

  const router = useRouter()
  const[refreshing,setRefreshing] = useState(false)

  // If your user isn't appearing as signed in,
  // it's possible they have session tasks to complete.
  // Learn more: https://clerk.com/docs/guides/configure/session-tasks
  const { session } = useSession()
  console.log(session?.currentTask)

  const onRefresh = async () => {
    setRefreshing(true)
    await loadData();
    setRefreshing(false)
  }

  useEffect(()=>{
    loadData()
  },[])

  console.log("transactions",transactions);
  console.log("summary",summary);
  console.log(user.id);

  if(isLoading && !refreshing){
    return <PageLoader/>
  }

  const handleDelete = (id) => {
    Alert.alert("Delete Transaction","Are you sure you want to delete this transaction?", [
      {text:"Cancel",style:"cancel"},
      {text:"Delete", style:"destructive", onPress: () => deleteTransaction(id)}
    ])
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* header */}
          <View style={styles.header}>
            {/* header left side */}
              <View style={styles.headerLeft}>
                  <Image source={require("../../assets/images/logo.png")} style={styles.headerLogo} resizeMode='contain' />
                  <View style={styles.welcomeContainer}>
                    <Text style={styles.welcomeText}>Welcome,</Text>
                    <Text style={styles.usernameText}>{user?.emailAddresses[0].emailAddress.split("@")[0]}</Text>
                  </View>
              </View>
              {/* header right side */}
              <View style={styles.headerRight}>
                  <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
                    <Ionicons name="add" size={20} color="#fff"/>
                    <Text style={styles.addButtonText}>Add</Text>
                  </TouchableOpacity>
                  <SignOutButton/>
              </View>
          </View>

        <BalanceCard summary={summary} />

        <View style={styles.transactionsHeaderContainer}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>

        <FlatList
            style={styles.transactionsList}
            contentContainerStyle={styles.transactionsListContent}
            data={transactions}
            renderItem={({ item }) => <TransactionItem item={item} onDelete={handleDelete} />}
            ListEmptyComponent={<NoTransactionsFound />}
            showsVerticalScrollIndicator={false} 
             refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
           
        />
      

      </View>
    </View>
  )
}

