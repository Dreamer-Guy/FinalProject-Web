export default {
  content: [
    "./public/**/*.{html,js}", // Existing rule for static assets
    "./*.html",                // Existing rule for root HTML files
    "./views/**/*.ejs",      // Add this rule for EJS files in the views folder
  ],

  theme: {
    screen: {
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
    },
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
      colors: {
        primary: "#fd3d57",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
};


// module.exports = {
//   content: ["./public/**/*.{html, js}"],

//   theme: {
//     screen: {
//       sm: "576px",
//       md: "768px",
//       lg: "992px",
//       xl: "1200px",
//     },
//     container: {
//       center: true,
//       padding: "1rem",
//     },
//     extend: {
//       fontFamily: {
//         poppins: ["Poppins", "sans-serif"],
//         roboto: ["Roboto", "sans-serif"],
//       },
//       colors: {
//         primary: "#fd3d57",
//       },
//     },
//   },
//   plugins: [
//     require("@tailwindcss/forms"),
//   ],
// };


