export const capitalizeFirstLetter = str => str[0].toUpperCase() + str.slice(1);

export const getNiceNumber = (num, precisionDigits = 4) => {
  return Number(num.toPrecision(precisionDigits));
};
