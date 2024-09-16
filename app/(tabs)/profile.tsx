import { StyleSheet, Image } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { i18n } from '@/i18n/profile.i18n';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: Colors.light.background, dark: Colors.dark.background }}
      headerImage={
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.reactLogo}
        />
      }
      title={i18n.t('userInfo')}
    >
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  reactLogo: {
    height: 200,
    width: 200,
    bottom: 0,
    left: 0
  },
});
