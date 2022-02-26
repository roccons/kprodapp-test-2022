# Inicio de Sesión

Las funciones de inicio de sesión devuelven una promesa que se resuelve cuando el usuario inicia sesión exitosamente.

1. Comprobar si es usuario no está en sesión (app.js)

2. Si el usuario no está en sesión, presentar el popup regular de inicio de sesión, con nombre de usuario y contraseña (modules/users/user-login.js).

3. Llamar al endpoint `user/status` (modules/users/user-login.js).

4. Si se obtiene un `need2fa` == `false`, el TOTP está inhabilitado, resolver. FIN.

5. Si el status indica `generateQR` mostrar el diálogo para instalar la App del celular.

6. Si el status indica `validateCode` mostrar el diálogo para ingresar el código del celular.

7. Resolver con éxito.
