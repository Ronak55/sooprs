import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useEffect } from 'react';
import { hp, wp } from '../../assets/commonCSS/GlobalCSS';
import ServicesCard from '../../components/ServicesCard';

const Services = ({ route }: { route: { params: { services: string[] } } }) => {
    const services = route.params?.services || []; // Default to empty array if undefined

    const renderItem = ({ item }: { item: string }) => <ServicesCard item={item} />;

    useEffect(() => {
        console.log('services from route:::::::::', services);
    }, [services]);

    return (
        <View style={styles.servicesContainer}>
            <FlatList
                data={services} // Use the services array
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

export default Services;

const styles = StyleSheet.create({
    servicesContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: wp(1),
    },
    list: {
        justifyContent: 'space-between',
    },
});
