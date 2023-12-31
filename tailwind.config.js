/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js}", "./index.html"],
    theme: {
        extend: {
            colors: {
                "primary-red": "#FC4D40",
                "secondary-blue": "#058ECE",
                "secondary-blue-hover": "#36A4D8",
                "accent-yellow": "#FCCB1D",
                "accent-yellow-hover": "#FDD54A",
                "main-black": "#313638",
                "main-white": "#E8E9EB",
            },
            fontFamily: {
                khand: ['"Khand"', "sans-serif"],
                jetbrains: ['"JetBrains Mono"', "monospace"],
            },
            spacing: {
                34: "132px",
                "about-photo": "83%",
            },
        },
    },
    plugins: [],
};
