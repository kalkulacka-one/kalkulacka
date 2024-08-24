import type { Config } from "tailwindcss";

const color: Pick<Config, "theme"> = {
  theme: {
    extend: {
      colors: {
        red: {
          100: "#BB0000",
        },
        star:{
          0: "#F2B807",
        },
        neutral: {
          "fg": '#565252',
          "fg-hover": '#ADA6A6',
          "fg-active": '#000000',
          "fg-muted": '#ADA6A6',
          "fg-strong": '#1D1C1C',
          "fg-inverse": '#FFFFFF',
          "fg-disabled": '#DAD8D7',
          "container": '#FFFFFF',
          "bg": '#F8F7F7',
          "bg-strong-hover": '#565252',
          "bg-strong-active": '#1D1C1C',
          "bg-disabled": '#DAD8D7',
          "border": '#DAD8D7',
          "border-hover": '#ADA6A6',
          "border-active": '#1D1C1C',
          "border-muted": '#F8F7F7',
          "border-strong": '#565252',
          "border-disabled": '#DAD8D7',
          "bg-backdrop-hover": '#33DAD8D7',
          '7010': '#1ADAD8D7',
          "bg-backdrop-active": '#99DAD8D7',
          "overlay": '#0DFFFFFF',
          "page": '#FFFFFF',
      },
      primary: {
          "fg": '#0070F4',
          "fg-hover": '#0A3EAF',
          "fg-strong": '#091233',
          "bg": '#EAF7FF',
          "bg-strong": '#0070F4',
          "bg-strong-hover": '#0A3EAF',
          "bg-strong-active": '#091233',
          "border": '#63B9FF',
          "border-strong": '#0070F4',
          "border-strong-hover": '#0A3EAF',
      },
      secondary: {
          "fg": '#D04646',
          "fg-hover": '#821414',
          "bg": '#FFF4F5',
          "fg-strong": '#821414',
          "bg-strong": '#D04646',
          "bg-strong-hover": '#821414',
          "border": '#F68585',
          "border-strong": '#D04646',
          "border-strong-hover": '#821414',
      },
          palette: {
            neutral: {
              0: '#000000',
              10: '#1D1C1C',
              30: '#565252',
              50: '#ADA6A6',
              70: '#DAD8D7',
              7020: '#33DAD8D7',
              7060: '#99DAD8D7',
              90: '#F8F7F7',
              100: '#FFFFFF',
              10080: '#CCFFFFFF',
            },
            primary: {
              0: '#091233',
              10: '#091233',
              30: '#0A3EAF',
              50: '#0070F4',
              70: '#63B9FF',
              90: '#EAF7FF',
            },
            secondary: {
              0: '#2E0A0A',
              10: '#2E0A0A',
              30: '#821414',
              50: '#D04646',
              70: '#F68585',
              90: '#FFF4F5',
            },
        },
      },
    },
  }
};

export default color;