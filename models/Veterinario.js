import mongoose from "mongoose";
import bcrypt from "bcrypt"
import generarid from "../helpers/generarid.js";

const veterinarioSchema = mongoose.Schema({
    nombre : {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: generarid()
    },
    confirmado: {
        type: Boolean,
        default: false
    }
})

veterinarioSchema.pre('save', async function(next) {
    if(!this.isModified("password")) {
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

veterinarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password)
}

const Veterinario = mongoose.model('Veterinario', veterinarioSchema)
export default Veterinario;