
import { Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Assets } from '../../assets/images/Assets';
import { Colors } from '../utils/Color';

export const getHeaderOptions = (navigation) => ({
  headerStyle: { backgroundColor: Colors.theme },
  headerTintColor: Colors.white,
  headerRight: () => (
    <TouchableOpacity
      style={{ marginRight: 15 }}
      onPress={() => navigation.navigate('ProfileScreen')}
    >
      <Image source={Assets.img_man} style={style.HeaderProfile} />
    </TouchableOpacity>
  )
});

const style = StyleSheet.create({
    HeaderProfile: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.white
    }
})