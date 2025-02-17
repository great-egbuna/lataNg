/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "grey-1": "#f6f6f6",
        "grey-2": "#ececec",
        "grey-5": "#ababab",
        "grey-8": "#787878",
        purple: "#5113a1",
        danger: "#fe0707",
        offwhite: "#f5f5f5",
      },
      boxShadow: {
        "shadow-mild": "0px 12px 12px red",
      },
      fontSize: {
        tiny: "8px",
        small: "10px",
      },
    },
  },
  plugins: [],
};
