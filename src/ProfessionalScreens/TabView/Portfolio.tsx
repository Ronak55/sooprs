import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  Linking,
} from 'react-native';
import {hp, wp} from '../../assets/commonCSS/GlobalCSS';
import Toast from 'react-native-toast-message';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import FSize from '../../assets/commonCSS/FSize';

const Portfolio = ({route}) => {
  const [portfolioData, setPortfolioData] = useState([]);
  const [expandedCardId, setExpandedCardId] = useState(null); // Track only the expanded card's ID

  const fetchPortfolioData = async () => {
    const id = route?.params?.id;
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
        setPortfolioData(res.msg);
      } else if (res.status === 400) {
        Toast.show({
          type: 'error',
          text1: res.msg,
          text1Style: {fontSize: 16, fontWeight: '600'},
          text2Style: {fontSize: 14, color: '#666'},
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong!',
        text1Style: {fontSize: 16, fontWeight: '600'},
        text2Style: {fontSize: 14, color: '#666'},
      });
    }
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const handleLinkPress = url => {
    if (url) {
      Linking.openURL(url);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Invalid URL',
        text1Style: {fontSize: 16, fontWeight: '600'},
        text2Style: {fontSize: 14, color: '#666'},
      });
    }
  };

  const toggleExpand = id => {
    setExpandedCardId(prevId => (prevId === id ? null : id)); // Toggle expanded state for specific card
  };

  const renderPortfolioItem = ({item}) => {
    const isExpanded = expandedCardId === item.id;
    const description = item.description || '';
    const displayDescription = isExpanded
      ? description
      : description.slice(0, 50);
    const shouldShowReadMore = description.length > 50;

    return (
      <TouchableOpacity
        style={[styles.card, isExpanded && styles.expandedCard]}
        onPress={() => {}}>
        <View style={styles.imgBack}>
          <Image
            source={{uri: item.files}}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{item.title}</Text>
          <Text style={styles.role}>{displayDescription}</Text>
          {shouldShowReadMore && (
            <Text style={styles.readMore} onPress={() => toggleExpand(item.id)}>
              {isExpanded ? 'Read Less' : 'Read More'}
            </Text>
          )}
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
        showsVerticalScrollIndicator={false}
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
    paddingBottom: hp(5),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    width: wp(43),
    minHeight: hp(24), // Ensure minimum height, so card can expand
    marginBottom: hp(4),
    marginTop: hp(1),
    marginLeft: wp(5),
    elevation: 4,
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  expandedCard: {
    minHeight: hp(34), // Increase height to accommodate expanded content
  },
  imgBack: {
    width: '100%',
    height: hp(12),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(2),
    flexDirection: 'column',
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
  readMore: {
    fontSize: FSize.fs12,
    color: '#0077FF',
    marginTop: hp(0.5),
  },
  link: {
    fontSize: FSize.fs12,
    color: '#0077FF',
    textDecorationLine: 'underline',
    marginTop: hp(0.5),
  },
});

export default Portfolio;
