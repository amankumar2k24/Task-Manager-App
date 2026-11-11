module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4566EC",
        primaryDark: "#3A56D6",
        primaryLight: "#EFF2FF",
        pendingBg: "#FFE6E7",
        progressFill: "#253C98",
        danger: "#F04438",
        ink: "#090E23",
        muted: "#667085",
        line: "#EAEAEA",
        searchBorder: "#E6E6E6",
        track: "#DADAFF",
        homeBg: "#FDFDFF",
        // Values below come from the Figma "To-Do List Mobile app" file
        dayMuted: "#C0C0C0",
        completeTile: "#99ADFF",
        pendingTile: "#FFB1B5",
        weekText: "#6E7180",
        fieldLabel: "#717171",
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
      },
      letterSpacing: {
        tighter: '-0.02em',
      },
      boxShadow: {
        fab: "0 8px 20px rgba(69,102,236,0.45)",
        card: "0 1px 2px rgba(16,24,40,0.05)",
        sheet: "0 -8px 30px rgba(16,24,40,0.12)",
      },
    },
  },
  plugins: [],
};
