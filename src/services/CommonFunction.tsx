import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeDataToAsyncStorage = async (indexName: string, value: any) => {
    let incomingData = JSON.stringify(value);
    try {
        await AsyncStorage.setItem(indexName, incomingData);
    } catch (error) {
        console.error("Error storing token:", error);
    }
}

export const getDataFromAsyncStorage = async (indexName: string) => {
    try {
        var value = await AsyncStorage.getItem(indexName);
        if (value !== null) {
            return JSON.parse(value);
        }
    } catch (error) {
        console.error("Error storing token:", error);
    }
};

export const validatePhoneNumber = (phoneNumber: string) => {
    const regex = /^\+?[1-9]\d{1,14}$/;
    return regex.test(phoneNumber);
};

export const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};