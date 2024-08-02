import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList} from 'react-native'
import Images from '../assets/image'
import React from 'react'
import { hp, wp } from '../assets/commonCSS/GlobalCSS'
import GigsCard from './GigsCard'

const GigsList = () => {

        const GigsItems = [
          {
            gigsImg: Images.topnotchone,
            gigsCategory:'UI/UX',
            gigsTitle: 'Top Notch Design',
            gigsDesc: 'Crafting user experiences that are both intuitive and visually stunning specialize in transforming',
            authorImg:Images.profileImage,
            authorName: 'Shivam',
            authorRating: '4.5',
            ratingCount:'30'
          },
      
          {
            gigsImg: Images.topnotchtwo,
            gigsCategory:'Web Development',
            gigsTitle: 'Top Notch Design',
            gigsDesc: 'Crafting user experiences that are both intuitive and visually stunning specialize in transforming',
            authorImg:Images.profileImagetwo,
            authorName: 'Rahul',
            authorRating: '4.2',
            ratingCount:'30'
          },
      
          {
            gigsImg: Images.topnotchone,
            gigsCategory:'UI/UX',
            gigsTitle: 'Top Notch Design',
            gigsDesc: 'Crafting user experiences that are both intuitive and visually stunning specialize in transforming',
            authorImg:Images.profileImage,
            authorName: 'Shivam',
            authorRating: '4.5',
            ratingCount:'30'
          },
      
          {
            gigsImg: Images.topnotchtwo,
            gigsCategory:'Web Development',
            gigsTitle: 'Top Notch Design',
            gigsDesc: 'Crafting user experiences that are both intuitive and visually stunning specialize in transforming',
            authorImg:Images.profileImagetwo,
            authorName: 'Rahul',
            authorRating: '4.2',
            ratingCount:'30'
          },
        ];

 const renderItem = ({item}: {item: any}) => (
            <GigsCard
              gigsImg={item.gigsImg}
              gigsCategory={item.gigsCategory}
              gigsTitle={item.gigsTitle}
              gigsDesc={item.gigsDesc}
              authorImg={item.authorImg}
              authorName={item.authorName}
              rating={item.authorRating}
              ratingCount={item.ratingCount}
            />
          );
        
          return (
            <View style={styles.GigsList}>
              <FlatList
                data={GigsItems}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
          );
}

export default GigsList

const styles = StyleSheet.create({


GigsList:{
    marginTop:hp(2),
    width:"100%",
    height:hp(50),

}

})