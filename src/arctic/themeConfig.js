export const themeConfig = {
  rtl: false, // options[Boolean] : true, false(default)
  isLoading: false,
  isDark: false
};

export const themePreset = {
  breakpoint: {
    scrollBarWidth: 16,
    thresholds: {
      xs: 600,
      sm: 960,
      md: 1280,
      lg: 1920
    }
  },
  rtl: false,

  theme: {
    dark: themeConfig.isDark,

    default: "light",
    disable: false,
    options: {
      cspNonce: undefined,
      customProperties: true,
      minifyTheme: undefined,
      themeCache: undefined
    },
    themes: {
      light: {
        primary: "#0081FF",
        secondary: "#304156",
        success: "#09B66D",
        danger: "#FF3D57",
        warning: "#ff9f0a",
        info: "#5e5ce6",
        dark: "#242939",
        black: "#242939",
        background: "#f2f3f8",
        color: "#304156"
      },
      dark: {
        primary: "#0081FF ",
        secondary: "#304156",
        success: "#09B66D",
        danger: "#FF3D57",
        warning: "#ff9f0a",
        info: "#5e5ce6",
        color: "#fff"
      }
    }
  }
};
