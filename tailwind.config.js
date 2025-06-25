import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {

                primary: ['"Helvetica Neue"', '"Sakkal Majalla"', 'Arial', 'sans-serif'],
            },
        },
    },
    plugins: [daisyui],
};
