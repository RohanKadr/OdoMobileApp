import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../utils/Color';
import { Assets } from '../../assets/images/Assets';
import { Screen } from 'react-native-screens';

const HomeScreen = ({ navigation }) => {
  const cardData = [
    { id: 1, title: 'Receipts', icon: Assets.img_receipt },
    { id: 2, title: 'Putaway', icon: Assets.img_putaway },
    { id: 3, title: 'Picking', icon: Assets.img_picking },
    { id: 4, title: 'Deliveries', icon: Assets.img_deliveries},
    // { id: 5, title: 'Internal', icon: Assets.img_internal },
    // { id: 6, title: 'Print Label', icon: Assets.img_printlabel },
  ];

  const navToScreens = (itemID) => {
    switch (itemID) {

      case 1:
        navigation.navigate('TabNavigator', { initialScreen: itemID });
        break;

      case 2:
        navigation.navigate('TabNavigator', { initialScreen: itemID });
        break;

      case 3:
        navigation.navigate('TabNavigator', { initialScreen: itemID });
        break;

      case 4:
        navigation.navigate('TabNavigator', { initialScreen: itemID });
        break;

      // case 5:
      //   navigation.navigate('InternalScreen');
      //   break;

      // case 6:
      //   Alert.alert('Page does not exists');
      //   break;

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
    height: hp('20%'),
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
