import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../utils/Color';
import { Assets } from '../../assets/images/Assets';

const HomeScreen = ({ navigation }) => {
  const cardData = [
    { id: 1, title: 'Inbound', icon: Assets.img_inbound },
    { id: 2, title: 'Outbound', icon: Assets.img_outbound },
    { id: 3, title: 'Internal', icon: Assets.img_internal },
    { id: 4, title: 'Print Label', icon: Assets.img_printlabel },
  ];

  const navToScreens = (itemID) => {
    switch (itemID) {

      case 1:
        navigation.navigate('InboundScreen');
        break;

      case 2:
        navigation.navigate('OutboundScreen');
        break;

      case 3:
        navigation.navigate('InternalScreen');
        break;

      case 4:
        Alert.alert("This page is not defined.");
        break;

      default:
        Alert.alert('No Screens');
    }
  }
  const renderCategoryCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navToScreens(item.id)}
    >
      <Image source={item.icon} style={styles.icon} />
      <Text style={styles.cardText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cardData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCategoryCard}
        numColumns={2}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.jadegreen,
    justifyContent: 'center',
  },
  grid: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('5%'),
  },
  card: {
    backgroundColor: Colors.theme,
    borderRadius: wp('5%'),
    elevation: 8,
    width: wp('42%'),
    height: hp('25%'),
    margin: wp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: wp('15%'),
    height: hp('10%'),
    resizeMode: 'contain',
  },
  cardText: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: Colors.white,
  },
});

export default HomeScreen;
