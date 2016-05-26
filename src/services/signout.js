const crypto = require('crypto');
const bcrypt = require('bcrypt');

export default (req, res) => {
  req.logout();
  res.send({ success: true });
};
