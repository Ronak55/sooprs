import {
    FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../assets/commonCSS/Colors';
import {hp, wp} from '../assets/commonCSS/GlobalCSS';
import FSize from '../assets/commonCSS/FSize';
import Images from '../assets/image';
import ButtonNew from './ButtonNew';
import CInput from './CInput';
import RazorpayCheckout from 'react-native-razorpay';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {mobile_siteConfig} from '../services/mobile-siteConfig';
import { useWindowDimensions } from 'react-native';
import {TabView, SceneMap } from 'react-native-tab-view';


const AddCredits = ({navigation}: {navigation: any}) => {

 const layout = useWindowDimensions();
 const [index, setIndex] = useState(0);
 const [routes] = useState([
    { key: 'all', title: 'All' },
    { key: 'credited', title: 'Credited' },
    { key: 'debited', title: 'Debited' },
  ]);
  const [visible, setVisible] = useState(false);
  const [credits, setCredits] = useState('');
  const [addcreditAmount, setaddCreditAmount] = useState('');

  const [orderId, setOrderId] = useState('');
  const isFocused = useIsFocused();
  const [sampleAmount, setsampleAmount] = useState(['$10', '$20', '$30']);
  const [name, setName] = useState('');
  const [transactions, setTransactions] = useState([]);

  const openModal = () => setVisible(true);
  const closeModal = () => setVisible(false);

  const AllTab = () => (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.updated_at}
      renderItem={({ item }) => (
        <View
          style={[
            styles.transactionCard,
            item.transaction_type === "0" ? styles.debitCard : styles.creditCard,
          ]}
        >
          <View style={styles.transactionRow}>
            {/* Transaction Date */}
            <Text style={styles.transactionDate}>
              {item.transaction_date || "No Date"}
            </Text>
  
            {/* Transaction ID */}
            {item.transaction_id ? (
              <Text style={styles.transactionId}>
                ID: {item.transaction_id}
              </Text>
            ) : null}
          </View>
  
          <Text style={styles.transactionRemark}>{item.remark}</Text>
  
          <View style={styles.transactionDetails}>
            {/* Transaction Amount */}
            <Text style={styles.transactionAmount}>
              {item.amount}
            </Text>
  
            {/* Transaction Type */}
            <Text style={styles.transactionType}>
              {item.transaction_type==='0' ? 'Debited' : 'Credited'}
            </Text>
          </View>
        </View>
      )}
      contentContainerStyle={{ padding: wp(4) }} // 16
    />
  );
  
  const CreditedTab = () => (
    <FlatList
    data={transactions.filter(item => item.transaction_type === "1")}
    keyExtractor={(item) => item.updated_at}
    renderItem={({ item }) => (
      <View
        style={[
          styles.transactionCard,
          styles.creditCard,
        ]}
      >
        <View style={styles.transactionRow}>
          {/* Transaction Date */}
          <Text style={styles.transactionDate}>
            {item.transaction_date || "No Date"}
          </Text>

          {/* Transaction ID */}
          {item.transaction_id ? (
            <Text style={styles.transactionId}>
              ID: {item.transaction_id}
            </Text>
          ) : null}
        </View>

        <Text style={styles.transactionRemark}>{item.remark}</Text>

        <View style={styles.transactionDetails}>
          {/* Transaction Amount */}
          <Text style={styles.transactionAmount}>
            {item.amount}
          </Text>

          {/* Transaction Type */}
          <Text style={styles.transactionType}>
            Credited
          </Text>
        </View>
      </View>
    )}
    contentContainerStyle={{ padding: wp(4) }} // 16
  />
  );

  const DebitedTab = () => (
    <FlatList
    data={transactions.filter(item => item.transaction_type === "0")}
    keyExtractor={(item) => item.updated_at}
    renderItem={({ item }) => (
      <View
        style={[
          styles.transactionCard,
          styles.debitCard,
        ]}
      >
        <View style={styles.transactionRow}>
          {/* Transaction Date */}
          <Text style={styles.transactionDate}>
            {item.transaction_date || "No Date"}
          </Text>

          {/* Transaction ID */}
          {item.transaction_id ? (
            <Text style={styles.transactionId}>
              ID: {item.transaction_id}
            </Text>
          ) : null}
        </View>

        <Text style={styles.transactionRemark}>{item.remark}</Text>

        <View style={styles.transactionDetails}>
          {/* Transaction Amount */}
          <Text style={styles.transactionAmount}>
            {item.amount}
          </Text>

          {/* Transaction Type */}
          <Text style={styles.transactionType}>
            Debited
          </Text>
        </View>
      </View>
    )}
    contentContainerStyle={{ padding: wp(4) }} // 16
  />
  );

  const renderScene = SceneMap({
    all: AllTab,
    credited: CreditedTab,
    debited: DebitedTab,
  });


  const addCredits = async () => {

    // console.log('amountcredits work')
    const amountInUSD = parseFloat(addcreditAmount);
    const conversionRate = 83.97; 
    const amountInINR = amountInUSD * conversionRate;
    const amountInPaise = amountInINR * 100; 

    // Initialize FormData
    const formdata = new FormData();
    formdata.append('amount', amountInPaise.toString());

    console.log('formdata:::::::::', formdata);

    try {
      const response = await fetch('https://sooprs.com/create_razr_order.php', {
        method: 'POST',
        body: formdata,
      });

      const res = await response.json();

      if(res.order_id){

        console.log('order id::::::::::', res.order_id);
        setOrderId(res.order_id); 

        const options = {
            key: 'rzp_live_SwPxj3HuCi6h9s',  // Replace with your Razorpay Key ID
            amount: amountInPaise,
            currency: 'INR',
            name: 'Gazetinc Technology LLP',
            description: 'Sooprs',
            order_id: res.order_id,
            image:'https://sooprs.com/assets/images/sooprs_logo.png',
            handler: (paymentResponse) => {
              // Handle successful payment here
              console.log('Payment Successful:::::', paymentResponse);
            },
            prefill: {
              email: 'contact@sooprs.com',
              contact: '8474081159',
            },
            theme: {
              color: '#0077FF',
            },
          };

          RazorpayCheckout.open(options).then((data) => {
            console.log('Payment data::::', data);
          }).catch((error) => {
            console.error('Razorpay error:', error);
          });

      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  useEffect(() => {
    const fetchWallet = async () => {
      const name = await AsyncStorage.getItem(mobile_siteConfig.NAME);
      const parsedName = JSON.parse(name);
      const formdata = new FormData();
      formdata.append('auth_user_slug', parsedName);

      console.log('formdata:::::::::', formdata);

      try {
        const response = await fetch(
          'https://sooprs.com/api2/public/index.php/wallet_balance',
          {
            method: 'POST',
            body: formdata,
          },
        );

        const res = await response.json();

        // Check if the response status is 200
        if (res.status === 200) {
          console.log('wallet balance::::::', res.msg.wallet);
          // Store the wallet value in state
          setCredits(res.msg.wallet);
        } else {
          console.error('Error fetching wallet balance:', res.msg);
        }
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
      }
    };

    const fetchTransactions = async () => {
        let lead_id = await AsyncStorage.getItem('uid');
        const formData = new FormData();
  
        if (lead_id) {
          lead_id = lead_id.replace(/^"|"$/g, '');
        }
        formData.append('user_id', lead_id);
        formData.append('data_value', '2');
  
        try {
          const response = await fetch(
            'https://sooprs.com/api2/public/index.php/get_transactions',
            {
              method: 'POST',
              body: formData,
            },
          );
  
          const res = await response.json();
  
          if (res.status === 200) {
            console.log('transactions fetched::::', res.msg)
            
            setTransactions(res.msg)
          } else {
            console.error('Error fetching transactions:', res.msg);
          }
        } catch (error) {
          console.error('Error fetching transactions:', error);
        }
      };
  

    fetchWallet();
    fetchTransactions();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <TouchableOpacity onPress={() => navigation.navigate('Account')}>
          <Image
            source={Images.backArrow}
            resizeMode="contain"
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Credits</Text>
      </View>
      <View style={styles.creditSection}>
        <View style={styles.creditsCard}>
          <View style={styles.walletContainer}>
            <Image
              style={styles.walletIcon}
              resizeMode="cover"
              source={Images.walletIcon}
            />
          </View>
          <Text style={styles.creditText}>Total Credits</Text>
          <Text style={styles.creditAmount}>{credits || 0}</Text>
          <ButtonNew
            imgSource={null}
            btntext="Add Credits"
            bgColor="#0077FF"
            textColor="#FFFFFF"
            onPress={openModal}
          />
          <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={closeModal}>
            <TouchableWithoutFeedback onPress={closeModal}>
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback>
                  <View style={styles.modalContent}>
                    {/* Close Icon */}
                    <View style={styles.modalsec}>
                      <TouchableOpacity
                        onPress={closeModal}
                        style={styles.closeIconContainer}>
                        <Image
                          source={Images.crossIcon}
                          style={styles.crossIcon}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                      {/* Modal Title */}
                      <Text style={styles.modalTitle}>Add Credits</Text>
                    </View>
                    <CInput
                      title="Amount (in Dollars)"
                      name="Enter your credit amount."
                      newlabel={false}
                      style={undefined}
                      setValue={(val: any) => setaddCreditAmount(val)}
                      value={addcreditAmount}
                      isPassword={false}
                      keyboardType={'number-pad'}
                    />
                    <View style={styles.conversion}>
                      <Text style={styles.convertText}>
                        (US $1 = 5 Credits)
                      </Text>
                    </View>
                    <View style={styles.or}>
                      <Text style={styles.orText}>Or</Text>
                    </View>
                    <View style={styles.sample}>
                      {sampleAmount.map((amount, index) => (
                        <ButtonNew
                          key={index}
                          imgSource={null} // or specify an image if needed
                          btntext={amount}
                          bgColor="white"
                          textColor={Colors.sooprsblue}
                          onPress={() =>
                            setaddCreditAmount(amount.replace('$', ''))
                          }
                        />
                      ))}
                    </View>
                    {/* Submit Button */}
                    <TouchableOpacity
                      onPress={addCredits}
                      style={styles.submitBtn}>
                      <Text style={styles.submitText}>Add Credits</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={props => (
          <View style={styles.tabBar}>
            {props.navigationState.routes.map((route, i) => {
              const isActive = i === index;
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => setIndex(i)}
                  style={[
                    styles.tabItem,
                    isActive ? styles.activeTabItem : styles.inactiveTabItem,
                  ]}
                >
                  <Text style={isActive ? styles.activeTabText : styles.inactiveTabText}>
                    {route.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      />
    </View>
  );
};

export default AddCredits;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerSection: {
    marginHorizontal: wp(5),
    marginVertical: hp(1),
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  backArrow: {
    width: wp(8),
    height: hp(8),
  },
  headerTitle: {
    color: Colors.black,
    fontWeight: '500',
    fontSize: FSize.fs16,
  },

  creditSection: {
    marginHorizontal: wp(5),
    marginVertical: hp(3),
  },

  creditsCard: {
    backgroundColor: Colors.black,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(5),
    // paddingHorizontal: wp(5),
    paddingVertical: hp(4),
    gap: wp(3),
  },

  walletContainer: {
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(10),
    paddingHorizontal: wp(5),
    paddingVertical: hp(3),
  },

  walletIcon: {
    width: wp(8),
    height: hp(3),
    tintColor: Colors.sooprsblue,
  },

  creditText: {
    color: Colors.white,
    fontWeight: '500',
    fontSize: FSize.fs16,
  },

  creditAmount: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: FSize.fs22,
  },

  crossIconContainer: {
    marginLeft: wp(2),
  },

  crossIcon: {
    width: wp(3),
    height: hp(3),
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: wp(80),
    backgroundColor: '#FFF',
    padding: wp(5),
    borderRadius: wp(2),
  },
  closeIconContainer: {
    alignSelf: 'flex-end',
  },
  modalTitle: {
    fontSize: FSize.fs18,
    fontWeight: 'bold',
    marginBottom: hp(2),
    color: Colors.black,
  },
  modalsec: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  labelText: {
    fontSize: FSize.fs14,
    marginVertical: hp(1),
    color: Colors.sooprsblue,
  },

  submitBtn: {
    marginTop: hp(3),
    backgroundColor: '#0077FF',
    padding: wp(3),
    alignItems: 'center',
    borderRadius: wp(2),
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: FSize.fs16,
    fontWeight: 'bold',
  },
  conversion: {
    alignSelf: 'flex-end',
  },

  convertText: {
    fontWeight: '400',
    color: Colors.sooprsblue,
    fontSize: FSize.fs10,
  },
  or: {
    marginVertical: hp(1),
    alignSelf: 'center',
  },
  orText: {
    fontSize: FSize.fs16,
    color: Colors.gray,
    fontWeight: '500',
  },

  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 0, // Remove bottom border
    paddingHorizontal: wp(2), // Add horizontal padding for spacing
    paddingVertical: hp(1), // Add vertical padding for a cleaner layout
    backgroundColor: 'white', // Tab bar background color
  },
  tabItem: {
    width: wp(28), // Width for each tab
    alignItems: 'center',
    paddingVertical: hp(1.5), // Padding for better touch area
    borderRadius: wp(5), // Smooth rounded corners for tabs
  },
  activeTabItem: {
    backgroundColor: Colors.sooprsblue, // Active tab background color
    borderRadius: wp(5), // Smooth rounded corners
  },
  inactiveTabItem: {
    backgroundColor: '#f1f1f1', // Inactive tab background color
    borderRadius: wp(5), // Smooth rounded corners
  },
  activeTabText: {
    color: 'white', // Active tab text color
    fontWeight: 'bold',
    fontSize: FSize.fs14, // Responsive font size for active tab
  },
  inactiveTabText: {
    color: Colors.sooprsblue, // Inactive tab text color
    fontWeight: '500',
    fontSize: FSize.fs14
  },

  transactionCard: {
    padding: wp(4), // 16
    borderRadius: wp(2), // 8
    marginBottom: hp(2), // 12
    backgroundColor: '#f9f9f9', // Light gray background
    elevation: 2,
    borderColor: '#ddd', 
    borderWidth: 1,
  },
  debitCard: {
    backgroundColor: '#ffe6e6', 
  },
  creditCard: {
    backgroundColor: '#e6ffe6',
  },
  transactionRow: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginBottom: hp(1),
  },
  transactionRemark: {
    fontSize: FSize.fs16,
    fontWeight: 'bold',
    color: '#333', 
    marginBottom: hp(1), 
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1), 
  },
  transactionAmount: {
    fontSize: FSize.fs16, 
    fontWeight: '600', 
    color: '#0077FF',
  },
  transactionType: {
    fontSize: FSize.fs14, // Slightly smaller for transaction type
    color: '#666', // Gray for less emphasis compared to amount
  },
  transactionId: {
    fontSize: FSize.fs12, // Smaller size for the transaction ID
    color: '#999', // Light gray for less emphasis
  },
  transactionDate: {
    fontSize: FSize.fs12, // Smaller font for date
    color: '#999',
  },
 
});
