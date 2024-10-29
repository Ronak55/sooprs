import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {wp, hp} from '../../assets/commonCSS/GlobalCSS';
import FSize from '../../assets/commonCSS/FSize';
import Header from '../../components/Header';
import Images from '../../assets/image';
import Colors from '../../assets/commonCSS/Colors';
import ProfileComponent from '../../components/ProfileComponent';
import ProfileContent from '../../components/ProfileContent';
import ContactDetails from '../../components/ContactDetails';
import ProfileTabs from '../../components/ProfileTabs';

const ProfessionalProfile = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const {id, img, name, services, slug, skills, avgrating, listing_about} = route?.params;

  const [isClient, setisClient] = useState(false);

  const tabs = ['Portfolio', 'Services', 'Skills', 'Reviews'];

  useEffect(() => {
    console.log('Services in ProfessionalProfile:', services);
    console.log('Skills in ProfessionalProfile:', skills);
    console.log('portfolio get id:::::::', id)
    console.log('professional slug::::::', slug)
  }, [services, skills, slug, id]);

  return (
    <View style={styles.container}>
      {/* <ScrollView style={styles.profileView}> */}
       <View style={{}}>
        <ProfileComponent
          navigation={navigation}
          img={img}
          name={name}
          role={services}
          rating={avgrating}
        />
        </View>
        <ProfileContent heading={'Bio'} content={listing_about} />
        {/* <ContactDetails email="rj.rjain567@gmail.com" phone="8474081159" location="New Delhi"/> */}
        {/* </ScrollView> */}
        <ProfileTabs
          tabs={tabs}
          isClient={isClient}
          portfolio={id}
          services={services}
          skills={skills}
        />
    </View>
  );
};

export default ProfessionalProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  profileView: {
    margin: wp(2),
  },

  profileSection: {
    marginHorizontal: wp(5),
    marginVertical: hp(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  backArrow: {
    width: wp(8),
    height: hp(8),
  },
  profile: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginRight: wp(20),
    marginVertical: hp(5),
    alignItems: 'center',
    gap: 1,
  },
  profileIcon: {
    width: wp(50),
    height: hp(25),
    borderWidth: 5,
    borderColor: '#D4E3FC',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(30),
    marginBottom: wp(2),
  },
  Icon: {
    width: hp(23),
    height: hp(23),
    borderRadius: wp(50),
  },
  starIcon: {
    width: wp(3),
    height: hp(3),
  },
  rating: {
    fontSize: FSize.fs12,
    color: Colors.black,
  },
  profileName: {
    fontSize: FSize.fs24,
    fontWeight: '600',
    color: Colors.black,
  },
  profileRole: {
    fontSize: FSize.fs12,
    fontWeight: '500',
    color: Colors.gray,
  },

  ratings: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
