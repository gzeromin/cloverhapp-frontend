export const thousandComma = (target: number) => {
  return target.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
