export const formatNumber = (number: number): string => {
    const roundedNumber = Math.round(number)
    return roundedNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };