import { Pressable, Dimensions, Image, StyleSheet } from 'react-native';
import { i18n } from '@/i18n/homeScreen.i18n';
import { BarChart, PieChart } from 'react-native-chart-kit';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors, kGreen, tintColorBeDark } from '@/constants/Colors';
import { GraphColors } from '@/constants/GraphColors';
import { mealData } from '@/dummies/pieChartData';
import { waterGlassesData } from '@/dummies/barChartData';

export default function HomeScreen() {
  const screenWidth = Dimensions.get('window').width - 60;

  const pieChartConfig = {
    backgroundColor: "#e26a00",
      backgroundGradientFrom: "#fb8c00",
      backgroundGradientTo: "#ffa726",
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: () => Colors.light.text,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#ffa726"
      },
      hasLegend: false,
  };

  const barChartConfig = {
    backgroundColor: Colors.light.background,
      backgroundGradientFrom: Colors.light.background,
      backgroundGradientTo: Colors.light.background,
      decimalPlaces: 0,
      color: () => GraphColors.light.water,
      labelColor: () => Colors.light.text,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#ffa726"
      }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: Colors.light.background, dark: Colors.dark.background }}
      headerImage={
        <ThemedView style={styles.headerContainer}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.reactLogo}
          />
        </ThemedView>
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText style={styles.title} type="title">{i18n.t("today")}, {new Date().toDateString()}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.titleContainer}>
      <PieChart
        data={mealData}
        width={screenWidth}
        height={200}
        chartConfig={pieChartConfig}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        center={[0, 0]}
        absolute
      />
      </ThemedView>
      <ThemedView>
      <BarChart
        style={styles.barGraphStyle}
        data={waterGlassesData}
        width={screenWidth - 30}
        height={220}
        yAxisLabel=""
        yAxisSuffix={` ${i18n.t('cup')}`}
        chartConfig={barChartConfig}
        verticalLabelRotation={0}
        />
      </ThemedView>
      <ThemedView style={styles.titleContainer}>
        <Pressable style={styles.button}>
          <ThemedText style={styles.buttonText}>
            {i18n.t('addMeal')}
          </ThemedText>
        </Pressable>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    fontFamily: 'cursive',
    color: Colors.light.tabIconSelected,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reactLogo: {
    height: 200,
    width: 200,
    bottom: 0,
    left: 0
  },
  pieGraphStyle: {
    maxWidth: "80%",
    maxHeight: 200,
    margin: 20,
  },
  barGraphStyle: {
    maxWidth: "80%",
    maxHeight: 200,
    marginVertical: 20,
  },
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: Colors.light.tabIconDefault,
    color: Colors.dark.text,
    width: "80%",
    margin: 20,
    padding: 12,
    borderRadius: 40
  },
  buttonText: {
    color: tintColorBeDark,
    fontSize: 20,
    fontWeight: 600,
  }
});
