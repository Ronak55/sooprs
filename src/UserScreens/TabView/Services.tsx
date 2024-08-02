import { StyleSheet, Text, View, FlatList } from 'react-native'
import React from 'react'
import { hp, wp } from '../../assets/commonCSS/GlobalCSS'
import ServicesCard from '../../components/ServicesCard'

const Services = () => {

  const ServicesList = ["Software Development", "AI services", "Web Redesign", "Home Automation", "UI/UX Design", "Graphic Design"]

  const renderItem = ({ item } : {item:any}) => <ServicesCard item={item} />;


  return (
    <View style={styles.servicesContainer}>
      <FlatList
        data={ServicesList}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
    </View>
  )
}

export default Services

const styles = StyleSheet.create({

  servicesContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: wp(1),
  },
  list: {
    justifyContent: 'space-between',
  },

})