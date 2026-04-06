import bcrypt from "bcrypt";

const hash = "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36Fuwp3o5z76M1q.joF4.kK";
const password = "Secure@123";

const match = await bcrypt.compare(password, hash);
console.log(match); // true if password matches