function generateRandomOTP(): string {
  const otp = Math.floor(1000 + Math.random() * 9000);
  console.log(otp);

  return otp + "";
}

export default generateRandomOTP;
