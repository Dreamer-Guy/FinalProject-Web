import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporterCofig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass:process.env.NODEMAILER_PASS,
    }
};

const sendEmail=async(from, to, subject, text, html)=>{
    try{
        const transporter=nodemailer.createTransport(transporterCofig);
        await transporter.sendMail({
            from,
            to,
            subject,
            text,
            html,
        });
    }
    catch(e){
        throw new Error(e);
    }
};

export default sendEmail;


