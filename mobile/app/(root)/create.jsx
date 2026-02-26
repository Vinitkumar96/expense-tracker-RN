import { View, Text, Alert} from 'react-native'
import { API_URL } from '../../constants/api'
import React, { useState } from 'react'
import {useRouter} from "expo-router"
import {useUser} from "@clerk/clerk-expo"

const CATEGORIES = [
  { id: "food", name: "Food & Drinks", icon: "fast-food" },
  { id: "shopping", name: "Shopping", icon: "cart" },
  { id: "transportation", name: "Transportation", icon: "car" },
  { id: "entertainment", name: "Entertainment", icon: "film" },
  { id: "bills", name: "Bills", icon: "receipt" },
  { id: "income", name: "Income", icon: "cash" },
  { id: "other", name: "Other", icon: "ellipsis-horizontal" },
];

const CreateScreen = () => {
  const router = useRouter()
  const {user} = useUser()

  const[title,setTitle] = useState("")
  const[amount,setAmount] = useState("")
  const[selectedCategory, setSelectedCategory] = useState("")
  const[isExpense, setIsExpense] = useState(true)
  const[isLoading, setIsLoading] = useState(false)

  const handleCreate = async () => {
    if(!title.trim()){
      return Alert.alert("Error","Please enter a transaction title")
    } 
    if(!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0){
     return Alert.alert("Error","Please enter a valid amount")
    }
    if(!selectedCategory){
      return Alert.alert("Error","Please select a category")
    }

    setIsLoading(true)

    try{
      const formatAmount = isExpense ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount))

      const response = await fetch(`${API_URL}/transactions`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          user_id: user.id,
          title,
          amount: formatAmount,
          category: selectedCategory
        })
      })

      if(!response.ok){
        const errorData = await response.json();
        console.log(errorData);
        throw new Error(errorData.error || "Failed to create transaction")
      }

      Alert.alert("Success","Transaction created successfully")
      router.back();
      
    }catch(error){
      Alert.alert("Error",error.message || "Failed to create transaction")
      console.error("Error creating transaction:", error)
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <View>
      <Text>create a routine and things to achieve till saturday dsa</Text>
    </View>
  )
}

export default CreateScreen