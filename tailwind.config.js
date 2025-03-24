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
        "grey-4": "#cbcbcb",
        "grey-5": "#ababab",
        "grey-6": "#787878",
        "grey-7": "#7a7a7a",
        "grey-7b": "#5a5a5a",
        "grey-8": "#787878",
        "grey-8-100": "#464646",
        "grey-9": "#292929",
        "grey-10": "#1e1e1e",
        "grey-11": "#282828",
        "grey-12": "#d2d2d2",
        purple: "#5113a1",
        "purple-2": "#f2ecf8",
        "purple-3": "#d6c3e9",
        "purple-5": "#8e64b9",
        "purple-8": "#32056c",
        danger: "#fe0707",
        "danger-100": "#d32626",
        "red-5": "#db3030",
        green: "#26d351",
        offwhite: "#f5f5f5",
        yellow: "#d3ae28",
        "yello-100": "#e5ae0f",
      },
      boxShadow: {
        "shadow-mild": "0px 12px 12px red",
      },
      fontSize: {
        tiny: "8px",
        small: "10px",
      },
      borderRadius: {
        base: "5px",
      },
    },
  },
  plugins: [],
};
