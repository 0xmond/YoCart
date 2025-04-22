import Randomstring from 'randomstring';

export const generateOTP = () => {
  return Math.ceil(Math.random() * 1000000 + 99999).toString();
};
