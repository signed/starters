import nodemailer, {SendMailOptions} from 'nodemailer';


const theFunction= async () => {

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    logger: true,
    debug: true,
    auth: {
      // create a temporary account at https://ethereal.email
      user: '<create-one>@ethereal.email',
      pass: '<your password>'
    }
  });
  const email: SendMailOptions = {
    from: 'Daemon <deamon@nodemailer.com>',
    to: '<create-one>@ethereal.email',
    subject: 'Hello You',
    text: 'Hello World'

  };
  const report = await transporter.sendMail(email)
  console.log(JSON.stringify(report, null, 2))
}
theFunction()