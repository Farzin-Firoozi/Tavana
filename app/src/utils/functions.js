export const doublePointNumber = (number) => {
  return number < 10 ? `0${number}` : number
}

export const convertSecondsToTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds - hours * 3600) / 60)
  const secondsLeft = seconds - hours * 3600 - minutes * 60

  return `${doublePointNumber(hours)}:${doublePointNumber(
    minutes
  )}:${doublePointNumber(secondsLeft)}`
}

export const getUserTypeFromUsername = (username = '') => {
  const name = username.toUpperCase()
  if (name.includes('PEARLS')) {
    return 'PEARLS'
  } else if (name.includes('OPAL')) {
    return 'OPAL'
  } else if (name.includes('RENAL')) {
    return 'RENAL'
  } else {
    return 'UNKNOWN'
  }
}
