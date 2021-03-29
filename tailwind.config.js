module.exports = {
  purge: ['./src/**/*.tsx'],
  theme: {
    extend: {
      zIndex: {
        overlay: '10',
      },
      fontSize: {
        xxs: '0.625rem',
        xs: '0.75rem',
        sm: '0.8125rem',
        base: '0.875rem',
        md: '0.9375rem',
        lg: '1rem',
        xl: '1.125rem',
        xxl: '1.25rem',
      },
      gridTemplateColumns: {
        16: 'repeat(16, minmax(0, 1fr))',
        20: 'repeat(20, minmax(0, 1fr))',
        24: 'repeat(24, minmax(0, 1fr))',
        28: 'repeat(28, minmax(0, 1fr))',
        32: 'repeat(32, minmax(0, 1fr))',
        'sidebar-16': '3rem repeat(15, minmax(0, 1fr))',
        'sidebar-20': '3rem repeat(19, minmax(0, 1fr))',
      },
      gridTemplateRows: {
        'header-6': '3rem repeat(5, minmax(0, 1fr))',
      },
      gridColumnStart: {
        14: '14',
      },
      gridColumnEnd: {
        14: '14',
      },
      gridRowEnd: {
        bottom: '-1',
      },
      inset: {
        4: '1rem',
      },
      width: {
        60: '15rem',
      },
      spacing: {
        0.5: '0.125rem',
        1.5: '0.375rem',
        2.5: '0.625rem',
        3.5: '0.875rem',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
