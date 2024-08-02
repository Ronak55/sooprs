import { StyleSheet, Text, View, FlatList } from 'react-native'
import React from 'react'
import ServicesCard from '../../components/ServicesCard';
import { hp, wp } from '../../assets/commonCSS/GlobalCSS';

const Skills = () => {

  const SkillList = ['PHP', 'Java', 'HTML & CSS', 'Bootstrap', 'jQuery', 'Photoshop', 'Figma', 'Adobe Illustrator', 'Canva', 'InDesign'];


  const renderItem = ({ item } : {item:any}) => <ServicesCard item={item} />;

  return (
    <View style={styles.skillsContainer}>
      <FlatList
        data={SkillList}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
    </View>
  )
}

export default Skills

const styles = StyleSheet.create({


  skillsContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: wp(1),
  },
  list: {
    justifyContent: 'space-between',
  },
})

