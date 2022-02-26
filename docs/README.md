# Información General para Desarrollador

## Funciones Globales

Cargadas al arranque de la aplicación desde 'public/js/header.js'

El código fuente está en 'vendor/_libs' y con `npm run libs` se genera el archivo 'app/assets/js/header.js', que Brunch copia tal cual al directorio 'public/js'.

### `assign(dest-object, ...args)`

Copia superficialmente (shallow copy) las propiedades de los objetos `...args` en `dest-object`.
Los objetos en `args` puede ser `null`.

Devuelve `dest-object`.

### `getById(id)`

Ejecuta `document.getElementById` con el id dado (string) que puede estar precedido por '#'.

Devuelve un HTMLElement o `null` si el elemento no se encontró.

### `hasClass(html-element, classes)`

Similar a `$(elem).hasClass()`

Devuelve `true` si el elemento contiene una o más de las clases dadas delimitadas por espacio, o `false` en cualquier otro caso, incluyendo si el elemento es null o la clase está en blanco.

Note: El elemento debe ser de tipo *HTMLElement* (no jQuery).

### rIC

Shim de [requestIdleCallback](https://developers.google.com/web/updates/2015/08/using-requestidlecallback).

### `setImmediate(callback, ...args)`

Polyfill de MS `setImmediate()`
Ver [https://github.com/YuzuJS/setImmediate](https://github.com/YuzuJS/setImmediate)

### Polyfills ES6

Array.prototype.find
Array.prototype.includes
String.prototype.startsWith
String.prototype.endsWith
window.requestAnimationFrame
...y normalización de HTMLElement.classList

### Sobre `dataset`

La característica no está soportada por Safari 9, no usarla.

Los attributos de datos "data-*" son leídos por jQuery la primera vez que se usa `$(elem).data()` pero no son sincronizados con posterioridad, es decir la asignación por medio de `setAttribute(data-*)` no actualiza el `data` de jQuery y viceversa, así que no se deben mezclar en tiempo de ejecución.

### jscc

Los comentarios que aparecen en el código como `//#if 0` por ejemplo, son del [plugin jscc](https://github.com/aMarCruz/jscc-brunch).

La carga de "defines" globales se hace desde 'app/values.js'.

### App.store

La documentación de `Observable` tiene su [propio README](./observable.md).
Esta es la base de `App.store`, que implementa un modelo de eventos parecido al usado en Flux.

### App.ui

Esta propiedad incluye métodos de [easyAlert](./easyalert.md) y [toastr](https://github.com/CodeSeven/toastr).
(La documentación de easyAlert podría estar algo obsoleta).

### Otros

Documentación sobre otras bibliotecas usadas en el [README](../README.md) del proyecto.
