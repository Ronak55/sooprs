import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    Linking,
    ScrollView,
  } from 'react-native';
  import React, {useState, useEffect} from 'react';
  import Colors from '../assets/commonCSS/Colors';
  import {hp, wp} from '../assets/commonCSS/GlobalCSS';
  import FSize from '../assets/commonCSS/FSize';
  import Images from '../assets/image';
  import ButtonNew from './ButtonNew';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import Toast from 'react-native-toast-message';
  import { useIsFocused } from '@react-navigation/native';
  
  const ManagePortfolio = ({navigation, route}: {navigation: any}) => {

    const {portfolioDetails} = route.params;
    const [portfolioData, setPortfolioData] = useState<any[]>([]);
    const isFocused = useIsFocused();
  
    useEffect(() => {
      
      console.log('portfolio details::::::::::', portfolioDetails)

      setPortfolioData(portfolioDetails);

    }, [route?.params?.portfolioDetails]);
  
    // const fetchPortfolioData = async () => {
    //   let lead_id = await AsyncStorage.getItem('uid');
    //   if (lead_id) {
    //     lead_id = lead_id.replace(/^"|"$/g, '');
    //   }
  
    //   const formData = new FormData();
    //   formData.append('user_id', lead_id);
  
    //   try {
    //     const response = await fetch(
    //       'https://sooprs.com/api2/public/index.php/manage_portfolio',
    //       {
    //         method: 'POST',
    //         body: formData,
    //       },
    //     );
  
    //     const res = await response.json();
  
    //     if (res.status === 200) {
    //       console.log('portfolio data fetched:::::::::::', res.msg)
    //       setPortfolioData(res.msg);
    //     } else if (res.status === 400) {
    //       Toast.show({
    //         type: 'error',
    //         text1: res.msg,
    //       });
    //     }
    //   } catch (error) {
    //     console.log('Error fetching portfolio:', error);
    //     Toast.show({
    //       type: 'error',
    //       text1: 'Something went wrong!',
    //     });
    //   }
    // };
  
    const handleLinkPress = (url: string) => {
      if (url) {
        Linking.openURL(url);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Invalid URL',
        });
      }
    };
  
    const renderPortfolioItem = ({item}: {item: any}) => {

      return (
        <TouchableOpacity style={styles.card} onPress={() => {}}>
          <View style={styles.imgBack}>
            <Image
              source={{uri: `https://sooprs.com/assets/portfolio-images/${item.files}`}}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
          <View style={styles.info}>
            <Text style={styles.name}>{item.title}</Text>
            <Text style={styles.role}>{item.description}</Text>
  
            {/* Link section with TouchableOpacity */}
            <TouchableOpacity onPress={() => handleLinkPress(item.link)}>
              <Text style={styles.link}>Visit Portfolio</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    };
  
    return (
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={Images.backArrow}
              resizeMode="contain"
              style={styles.backArrow}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manage Portfolio</Text>
        </View>
        <FlatList
          data={portfolioData}
          renderItem={renderPortfolioItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.portfolioList}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        />
        <View style={styles.title}>
          <ButtonNew
            imgSource={null}
            btntext="Add Portfolio"
            bgColor="#0077FF"
            textColor="#FFFFFF"
            onPress={() => navigation.navigate('AddPortfolio')}
            isBorder={true}
          />
        </View>
      </ScrollView>
    );
  };
  
  export default ManagePortfolio;
  
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
    title: {
      marginHorizontal: wp(5),
      marginVertical: hp(2),
    },
    portfolioList: {
      marginHorizontal: wp(5),
    },
    card: {
      backgroundColor: Colors.white,
      borderRadius: 10,
      width: wp(43),
      height: hp(25),
      marginBottom: hp(4),
      marginRight: wp(3),
      elevation: 4,
      shadowOpacity: 0.2,
      shadowRadius: 4,
      overflow: 'hidden',  // Prevent overflow
    },
    imgBack: {
      width: '100%',
      height: '50%',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    info: {
      marginVertical: hp(1),
      marginHorizontal: wp(2),
      flexDirection: 'column',
      gap: 2,
      height:hp(5),
      justifyContent: 'flex-start',
      flexShrink: 1,  // Allow info to shrink if there's too much content
    },
    name: {
      fontSize: FSize.fs14,
      fontWeight: 'bold',
      color: Colors.black,
      flexWrap: 'wrap', // Ensure long text wraps
    },
    role: {
      fontSize: FSize.fs12,
      color: Colors.gray,
      flexWrap: 'wrap', // Ensure long text wraps
    },
    link: {
      fontSize: FSize.fs12,
      color: '#0077FF',
      textDecorationLine: 'underline',
      marginTop: hp(0.5),
    },
  });
  