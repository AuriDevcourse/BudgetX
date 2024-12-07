import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtjSLKN5_w8JqvwlGlRA8VVDCirbzBiCM",
  authDomain: "budgetx-personal.firebaseapp.com",
  projectId: "budgetx-personal",
  storageBucket: "budgetx-personal.firebasestorage.app",
  messagingSenderId: "1012317201156",
  appId: "1:1012317201156:web:7513c7022f71376fb62651",
  measurementId: "G-F3WD7B318G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
console.log('Firebase Analytics initialized:', analytics);
const db = getFirestore(app);

export const createWallet = async (walletData) => {
  try {
    const docRef = await addDoc(collection(db, 'wallets'), {
      ...walletData,
      createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...walletData };
  } catch (error) {
    console.error('Error creating wallet:', error);
    throw error;
  }
};

export const addTransaction = async (transactionData) => {
  try {
    const docRef = await addDoc(collection(db, 'transactions'), {
      ...transactionData,
      createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...transactionData };
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

export const getWallets = async (userId) => {
  try {
    const q = query(collection(db, 'wallets'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting wallets:', error);
    throw error;
  }
};

export const getTransactions = async (walletId) => {
  try {
    const q = query(collection(db, 'transactions'), where('walletId', '==', walletId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting transactions:', error);
    throw error;
  }
};

export const updateWallet = async (walletId, updates) => {
  try {
    const walletRef = doc(db, 'wallets', walletId);
    await updateDoc(walletRef, updates);
    return { id: walletId, ...updates };
  } catch (error) {
    console.error('Error updating wallet:', error);
    throw error;
  }
};

export const deleteWallet = async (walletId) => {
  try {
    await deleteDoc(doc(db, 'wallets', walletId));
    return walletId;
  } catch (error) {
    console.error('Error deleting wallet:', error);
    throw error;
  }
};

// Helper function to calculate monthly averages
export const calculateMonthlyAverages = async (walletId) => {
  try {
    const transactions = await getTransactions(walletId);
    const monthlyData = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = {
          income: 0,
          expenses: 0,
        };
      }
      
      if (transaction.type === 'income') {
        acc[monthKey].income += transaction.amount;
      } else {
        acc[monthKey].expenses += transaction.amount;
      }
      
      return acc;
    }, {});

    const months = Object.keys(monthlyData);
    const totalMonths = months.length;
    
    return {
      averageIncome: months.reduce((sum, month) => sum + monthlyData[month].income, 0) / totalMonths,
      averageExpenses: months.reduce((sum, month) => sum + monthlyData[month].expenses, 0) / totalMonths,
      monthlyData,
    };
  } catch (error) {
    console.error('Error calculating monthly averages:', error);
    throw error;
  }
};
