const shared = {
  primary: '#3AB0FF',
  secondary: '#fff',
  yellow: '#FFB562',
  purple: '#231C69',
  red: '#FF5F56',
  aqua: '#4acfbd',
  green: '#27C93F',
  staticWhite: '#FFFFFF',
  staticBlack: '#000000',
  generateStaticWhite: (alpha) => generateWhite(alpha),
  generateStaticBlack: (alpha) => generateBlack(alpha),
}

export const lightColors = {
  ...shared,
  surface: '#FFFFFF',
  white: '#FFFFFF',
  black: '#000000',
  error: shared.red,
  generateWhite: (alpha) => generateWhite(alpha),
  generateBlack: (alpha) => generateBlack(alpha),
}

export const darkColors = {
  ...shared,
  surface: '#1F1D36',
  white: '#000000',
  black: '#FFFFFF',
  error: '#CF6679',
  generateWhite: (alpha) => generateBlack(alpha),
  generateBlack: (alpha) => generateWhite(alpha),
}

const generateWhite = (alpha = 1) => {
  return `rgba(255, 255, 255, ${alpha})`
}

const generateBlack = (alpha = 1) => {
  return `rgba(0, 0, 0, ${alpha})`
}
