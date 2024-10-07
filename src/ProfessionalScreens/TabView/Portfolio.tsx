import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import Images from '../../assets/image';
import PortfolioCard from '../../components/PortfolioCard';
import { wp } from '../../assets/commonCSS/GlobalCSS';

const Portfolio = () => {

  const portfolioList = [
    { img: Images.topnotchone, name: 'Matrix Web Design' },
    { img: Images.topnotchtwo, name: 'Application Design' },
    { img: Images.topnotchone, name: 'Matrix Web Design' },
    { img: Images.topnotchtwo, name: 'Application Design' },
    { img: Images.topnotchone, name: 'Matrix Web Design' },
    { img: Images.topnotchtwo, name: 'Application Design' },
  ];

  const renderItem = ({ item } : {item:any}) => <PortfolioCard item={item} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={portfolioList}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: wp(1),
  },
  list: {
    justifyContent: 'space-between',
  },
});

export default Portfolio;
