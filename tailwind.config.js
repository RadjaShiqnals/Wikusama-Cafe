import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                light: {
                  primary: '#ad6d2f',
                  primary_hover: '#805022',
                  secondary: '#A0522D',
                  accent: '#8B4513',
                  background: '#d2c1b0',
                  text: '#5C4033',
                  text_hover: '#33241c',
                },
                dark: {
                  primary: '#d2c1b0',
                  primary_hover: '#b3a496',
                  secondary: '#5C4033',
                  accent: '#3E2723',
                  background: '#37251b',
                  text: '#D2B48C',
                  form: '#4d3426',
                },
              },
        },
    },
    plugins: [forms],
};
