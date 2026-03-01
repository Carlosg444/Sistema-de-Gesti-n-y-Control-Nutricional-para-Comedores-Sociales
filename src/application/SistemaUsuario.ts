import { Usuario } from "../domain/Usuario";

export class SistemaUsuarios {
    private usuarios: Usuario[] = [];

    public registrar(usuario: Usuario): void {
        const existe = this.usuarios.find(u => u.getDni() === usuario.getDni());
        if (existe) throw new Error("El usuario ya existe");
        this.usuarios.push(usuario);
    }

    public login(dni: string, contrasena: string): Usuario {
        const usuario = this.usuarios.find(
            u => u.getDni() === dni && u.getContrasena() === contrasena
        );
        if (!usuario) throw new Error("Credenciales incorrectas");
        return usuario;
    }
}