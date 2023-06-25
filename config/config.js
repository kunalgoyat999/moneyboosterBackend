module.exports = Object.freeze({
    production: {
      // baseUrl: 'https://workdone.trabko.com/api/v1/userDetails',
      baseUrl: 'http://localhost:3333/api/v1/userDetails',
      uri: "https://info.payu.in/merchant/postservice.php?form=1",
      key: "0j7zny", // kunal's payU Biz
      salt: "0bEORCg1", // kunal's payU Biz'
    //   key: "K1OlyanO", // Amit's payU Money
    //   salt: "eqbSH9Zkx7", // Amit's payU Money
      action: "https://secure.payu.in/_payment",
    //   mongodbURI:
    //     "mongodb+srv://kunal:MyPassword@newcluster.xiphf.mongodb.net/commonBackend?retryWrites=true&w=majority",
        // 'mongodb://localhost:27017/commonBackend'
    },
    staging: {
      baseUrl: 'https://workdone.trabko.com/api/v1/userDetails',
      uri: "https://test.payu.in/merchant/postservice.php?form=2",
      key: "gtKFFx",
      // key: "oZ7oo9",
      salt: "eCwWELxi",
      // salt: "UkojH5TS",
      action: "https://test.payu.in/_payment",
      mongodbURI: 'mongodb://localhost:27017/commonBackend',
    },
  });
  