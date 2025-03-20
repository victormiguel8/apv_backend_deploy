import Veterinario from "../models/Veterinario.js"
import generarJWT from "../helpers/generarJWT.js"
import generarid from "../helpers/generarid.js"
import emailRegistro from "../helpers/emailRegistro.js"
import emailOlvidePassword from "../helpers/emailOlvideoPassword.js"


const registrar = async (req, res)  => {

    //Revisar usuarios duplicados
    const {email, nombre} = req.body
    const existeUsuario = await Veterinario.findOne({email})

    if (existeUsuario) {
        const error = new Error('Usuario ya registrado')
        return res.status(400).json({msg: error.message})
    }

    try {
        //Guardar nuevo Veterinario
        const veterinario = new Veterinario(req.body)
        const veterinarioGuardado = await veterinario.save()

        //Enviar el email
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        })

        res.json(veterinarioGuardado)
    } catch (error) {
        console.log(error)
    }
     

    
}

const perfil = (req, res) => {
    
    const {veterinario} = req
    res.json(veterinario)

}

const confirmar = async (req, res) => {
    const { token } = req.params

    const usuarioConfirmar = await Veterinario.findOne({token})

    if(!usuarioConfirmar) {
        const error = new Error("Token no valido")
        return res.status(404).json({msg: error.message})
    }
    
    try {
        usuarioConfirmar.token = null
        usuarioConfirmar.confirmado = true
        await usuarioConfirmar.save()

        res.json({msg: "Usuario confirmado correctamente"}) 
    } catch (error) {
        console.log(error)
    }
    
}

const autenticar = async (req, res) => {
    const { email, password } = req.body

    //Comprobar si usuario existe
    const usuario = await Veterinario.findOne({email})

    if(!usuario) {
        const error = new Error("El Usuario no existe")
        return res.status(404).json({msg: error.message})
    }    

    //Comprobar si el usuario esta confirmado
    if(!usuario.confirmado) {
        const error = new Error('Tu cuenta no ha sido confirmada')
        return res.status(403).json({msg: error.message})
    }

    //Revisar el password
    if (await usuario.comprobarPassword(password)) {
        //Autenticar
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id),
        })
    }else {
        const error = new Error('Contraseña Incorrecta')
        return res.status(403).json({msg: error.message})
    }

}

const olvidePassword = async (req, res) => {
    const {email} = req.body
    
    const existeVeterinario = await Veterinario.findOne({email})

    if(!existeVeterinario) {
        const error = new Error("El usuario no existe")
        return res.status(400).json({msg: error.message})
    }

    try {
        existeVeterinario.token =  generarid()
        await existeVeterinario.save()

        //Enviar email con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })

        res.json({msg: "Hemos enviado un email con las instrucciones"})
    } catch (error) {
        console.log(error)
    }
}
const comprobarToken = async (req, res) => {
    const { token } = req.params

    const tokenValido = await Veterinario.findOne({token})

    if(tokenValido) {
        //El toquen es valido el usuario existe
        res.json({msg: "Token valido y el usuario existe"})
    }else {
        const error = new Error('Token no valido')
        return res.status(400).json({msg: error.message})
    }
}
const nuevoPassword = async (req, res) => {
    const {token} = req.params

    const {password} = req.body

    const veterinario = await Veterinario.findOne({token})
    if(!veterinario) {
        const error = new Error("Hubo un error")
        return res.status(400).json({msg: error.message})
    }

    try {
        veterinario.token = null
        veterinario.password = password
        await veterinario.save()
        res.json({msg: "password modificado correctamente"})
    } catch (error) {
        console.log(error)
    }
}

const actualizarPerfil = async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id)
    if (!veterinario) {
        const error = new Error("Hubo un error")
        res.status(400).json ({ msg: error.message})
    }

    const {email} = req.body
    if(veterinario.email !== req.body.email) {
        const existeEmail = await Veterinario.findOne({email})
        if(existeEmail) {
            const error = new Error("Ese email esta en uso")
            res.status(400).json ({ msg: error.message})
        }
    }

    try {
        veterinario.nombre = req.body.nombre
        veterinario.email = req.body.email
        veterinario.web = req.body.web
        veterinario.telefono = req.body.telefono

        const veterinarioActualizado = await veterinario.save()
        res.json(veterinarioActualizado)

    } catch (error) {
        console.log(error)
    }
}

const actualizarPassword = async (req, res) => {
    //Leer los datos
    const { id } = req.veterinario
    const {pwd_actual, pwd_nuevo} = req.body

    //Comprobar que el veterinario exista
    const veterinario = await Veterinario.findById(id)
    if (!veterinario) {
        const error = new Error("Hubo un error")
        res.status(400).json ({ msg: error.message})
    }
    // Comprobar su password
    if (await veterinario.comprobarPassword(pwd_actual)) {
        veterinario.password = pwd_nuevo
        await veterinario.save()
        res.json({msg: 'Password Almacenado Correctamente'})
    } else {
        const error = new Error("El Password Actual es incorrecto")
        res.status(400).json ({ msg: error.message})
    }
    // Almacenar el nuevo password
}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}