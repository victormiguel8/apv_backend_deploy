import nodemailer from "nodemailer"
// import 'dotenv/config'

const emailOlvidePassword = async (datos) => {
  const {email, nombre, token} = datos
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
     

      //Enviar Email

      const info = await transport.sendMail({
        from: "APV - Administrador Pacientes de Veterinaria",
        to: email, 
        subject: "Restablece tu Password",
        text: "Restablece tu Password",
        html: `<p>Hola: ${nombre}, has solicitado restablecer tu password</p>

        <p> Sigue el siguiente enlace para restablecer tu password:
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer Password</a> </p>
        
        <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        `,
      })

      console.log("Mensaje enviado: %s", info.messageId)

  }

export default emailOlvidePassword