module.exports = (mongoose) => {
    var schema = mongoose.Schema(
      {
        walletAddress: String,
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function () {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const TokenAddress = mongoose.model("tokenaddress", schema);
    return TokenAddress;
  };
  