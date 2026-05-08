import { Dimensions } from "react-native";
const { width, height } = Dimensions.get('window');
const FONTS_PATH = '../assets/fonts/';

// Define responsive font sizes based on screen dimensions
export const responsiveTitleFontSize = width * 0.042; // Adjust multiplier as needed
export const responsiveSubtitleFontSize = width * 0.04; // Adjust multiplier as needed
export const responsiveButtonFontSize = width * 0.045; // Adjust multiplier as needed
export const responsiveSecondaryButtonFontSize = width * 0.04; // Adjust multiplier as needed
export const responsiveNormalTextFontSize = width * 0.035;

export default {
  APP: {
    spaceMonoRegular: require(`${FONTS_PATH}SpaceMono-Regular.ttf`),
  },
};
