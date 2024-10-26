import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import CategoriesCard from './CategoriesCard'; // Your card component
import { wp, hp } from '../assets/commonCSS/GlobalCSS';

const CategoriesList = ({ navigation, services, onSelectService }: { navigation: any, services: any[], onSelectService: (serviceName: string) => void }) => {
  // State to store services
  const [serviceList, setServicesList] = useState<{ service_name: string; service_imgs: string }[]>([]);

  // Fetch services from the API
  const fetchServices = async () => {
    try {
      const response = await fetch('https://sooprs.com/api2/public/index.php/sr_services_all', {
        method: 'POST',
      });
      const res = await response.json();
      
      if (res.status==200) {
        const servicesData = res.msg.map((service: any) => ({
          service_name: service.service_name,
          service_imgs: service.service_imgs,
        }));
        setServicesList(servicesData);
      } else{
        console.log('services not found !')
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  // Fetch services on component mount
  useEffect(() => {

    const fetchSer = async()=>{
      await fetchServices();
    }

    fetchSer();
  }, []);

  // Render each category card
  const renderCategories = ({navigation, item, index }: {navigation:any, item: any; index: any }) => {
    return (
      <CategoriesCard
        navigation={navigation}
        img={item.service_imgs} // Pass the image
        name={item.service_name} // Pass the service name
        index={index}
        onSelectService={onSelectService}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.CategoriesList}>
        <FlatList
          data={serviceList.slice(0, 10)} // Use services data
          renderItem={renderCategories}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  CategoriesList: {
    paddingVertical: hp(2),
  },
});

export default CategoriesList;
