import bcrypt from 'bcryptjs';
import dotenv from "dotenv";
dotenv.config();

const bcryptSaltRounds = process.env.BCRYPT_SALT_ROUNDS;

const hashPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, Number(bcryptSaltRounds));
    return hashedPassword;
}

const comparePlainAndHashed = async (plain, hashed) => {
    const result = await bcrypt.compare(plain, hashed);
    return result;
}

export{hashPassword,comparePlainAndHashed};