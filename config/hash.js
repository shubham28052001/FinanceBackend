const bcrypt = require("bcryptjs");

async function hash() {
  const hashed = await bcrypt.hash("admin123", 12);
  console.log(hashed);
}

hash();