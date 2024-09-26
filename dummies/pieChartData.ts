import { GraphColors } from "@/constants/GraphColors";
import { i18n } from "@/i18n/homeScreen.i18n";
import { Colors } from "react-native/Libraries/NewAppScreen";

export const mealData = [
    {
      name: i18n.t('carbohydrates'),
      population: 5 * 4,
      color: GraphColors.light.carbohydrates,
      legendFontColor: GraphColors.light.legend,
      legendFontSize: 12
    },
    {
      name: i18n.t('fats'),
      population: 0.1 * 4,
      color: GraphColors.light.fats,
      legendFontColor: GraphColors.light.legend,
      legendFontSize: 12
    },
    {
      name: i18n.t('proteins'),
      population: 2.5 * 4,
      color: GraphColors.light.proteins,
      legendFontColor: GraphColors.light.legend,
      legendFontSize: 12
    },
    {
      name: i18n.t('fiber'),
      population: 3 * 4,
      color: GraphColors.light.fiber,
      legendFontColor: GraphColors.light.legend,
      legendFontSize: 12
    }
  ];

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