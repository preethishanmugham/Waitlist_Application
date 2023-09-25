const userInfo = (req, res) => {
  try {

    console.log("jwt verified , sending user details to client");
    let userId = req.user;
    return res.status(200).json({ user: userId });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

module.exports = { userInfo };
