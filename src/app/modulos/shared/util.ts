export class utils {
    public static convertirFormatoPalabra(frase: string): string {
        // Utiliza expresiones regulares para reemplazar los guiones bajos por espacios
        var f =  frase.replace(/_/g, ' ');
        return f.toLowerCase();
    }
}