import nodemailer from "nodemailer"
// import 'dotenv/config'

const emailRegistro = async (datos) => {
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
        subject: "Comprueba tu cuenta en APV",
        text: "Comprueba tu cuenta en APV ahora",
        html: `<p>Hola: ${nombre}, comprueba tu cuenta en APV ahora mismo</p>
        <p> Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace:
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a> </p>
        
        <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        `,
      })

      console.log("Mensaje enviado: %s", info.messageId)

  }

export default emailRegistro