import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, Text, Linking } from 'react-native';
import Images from '../../assets/image';
import PortfolioCard from '../../components/PortfolioCard';
import { hp, wp } from '../../assets/commonCSS/GlobalCSS';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useNavigation } from '@react-navigation/native';
import FSize from '../../assets/commonCSS/FSize';

const Portfolio = ({route} : {route:any}) => {

  const [portfolioData, setPortfolioData] = useState<any[]>([]);
  const navigation = useNavigation();

  const fetchPortfolioData = async () => {
   
    const id = route?.params?.id

    const formData = new FormData();
    formData.append('user_id', id);

    try {
      const response = await fetch(
        'https://sooprs.com/api2/public/index.php/manage_portfolio',
        {
          method: 'POST',
          body: formData,
        },
      );

      const res = await response.json();

      if (res.status === 200) {
        console.log('portfolio data::::::', res.msg)
        setPortfolioData(res.msg);
      } else if (res.status === 400) {
        console.log('portfolio data not found::::::', res.msg)
        Toast.show({
          type: 'error',
          text1: res.msg,
        });
      }
    } catch (error) {
      console.log('Error fetching portfolio:', error);
      Toast.show({
        type: 'error',
        text1: 'Something went wrong!',
      });
    }
  };

  
  useEffect(() => {
    console.log('portfolio id:::::::::::', route?.params?.id)
    fetchPortfolioData();

  }, []);


  // const portfolioList = [
  //   { img: Images.topnotchone, name: 'Matrix Web Design' },
  //   { img: Images.topnotchtwo, name: 'Application Design' },
  //   { img: Images.topnotchone, name: 'Matrix Web Design' },
  //   { img: Images.topnotchtwo, name: 'Application Design' },
  //   { img: Images.topnotchone, name: 'Matrix Web Design' },
  //   { img: Images.topnotchtwo, name: 'Application Design' },
  // ];

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
            source={{uri: item.files}}
            style={styles.image}
            resizeMode="cover"
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
    <View style={styles.container}>
      <FlatList
        data={portfolioData}
        renderItem={renderPortfolioItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.portfolioList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  
  portfolioList: {
    marginHorizontal: wp(5),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    width: wp(43),
    height: hp(24),
    marginBottom: hp(4),
    marginTop:hp(1),
    marginHorizontal:wp(1),
    // marginRight: wp(3),
    elevation: 4,
    shadowOpacity: 0.2,
    shadowRadius: 4,
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
  },
  name: {
    fontSize: FSize.fs14,
    fontWeight: 'bold',
    color: Colors.black,
  },
  role: {
    fontSize: FSize.fs10,
    color: Colors.black,
  },
  link: {
    fontSize: FSize.fs12,
    color: '#0077FF',
    textDecorationLine: 'underline',
    marginTop: hp(0.5),
  },
});


export default Portfolio;
