import nodemailer from 'nodemailer'

const mailPass = process.env.MAIL_PASS ? process.env.MAIL_PASS.replace(/\s+/g, '') : undefined
const mailUser = process.env.MAIL_USER

export const mailTransporter = nodemailer.createTransport({
	host: process.env.MAIL_HOST || 'smtp.gmail.com',
	port: Number(process.env.MAIL_PORT) || 465,
	secure: process.env.MAIL_SECURE !== 'false',
	auth: mailUser && mailPass ? {
		user: mailUser,
		pass: mailPass,
	} : undefined,
}, {
	from: process.env.MAIL_FROM || `Campus Care <${mailUser || 'system@clinic.edu'}>`,
})
