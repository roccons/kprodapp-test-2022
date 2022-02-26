# Historial de Cambios Knotion Production

### 2019-04-02

Visor:

1. Arregla la pestaña Publicación, se refresca siempre a menos que esté enmedio de una edición.
2. Incrementa la demora de la rutina `setFocus` para dar tiempo a que termine el renderizado.
3. Corrección del mini-editor del título que anclaba parámetros en el closure del `require`.
4. Ajusta la altura del visor cuando se cambia a la pestaña de Requisiciones estableciendo `overflow:hidden` en la pestaña de detalles y `min-height:100%` en la de Requisiciones.
5. Elimina el autollenado de campos en blanco en inicio y durante la edición en la pestaña Publicación.

### 2019-03-20
- Tableros: Las columnas pueden ordenarse por sesión (individualmente, se memoriza).
- Tableros: Visor mantiene visible el título (probar en Safari)

### 2017-11-25
- Visor: Siempre muestra la OP aun si no se encuentra en el tablero.

### 2017-11-14
- Fix a mensaje de carga por cambio de filtros.
- Implementación de carga progresiva (por revisar).
- Actualiza dependencias.

### 2017-11-09
- Se intercepta click en notificaciones para ignorar reto/tablero si la OP ya está cargada.

### 2017-11-08
- En búsqueda avanzada de páneles se inhabilitan los botones Limpiar/Buscar si el form está en blanco.
- Ahora la acción del botón "Limpiar" del sidebar de filtros se aplica inmediatamente.
- Lanzar búsqueda en páneles con tecla Enter.

### 2017-10-19
- Implementa filtros globales Ciclo/País para vista de tableros y tarjetas.

### 2017-10-17
- Cards: Se permite que cualquier usuario edite quicktags desde la opción en la barra negra del visor de tarjetas

### 2017-10-13
- Cards: Quicktags visibles en las tarjetas.
- Cards: Bloquea el clic para abrir el visor en la OP que se está actualizando después de un drop.
- OP: Deshabilita edición y cambio de estatus de OP en el editor antiguo para todos los usuarios.
- OP: Elimina pestaña de tareas en visor antiguo.

### 2017-10-12
- Actualiza devDependencies, incluye versión npm de easyRouter y uglify-es-brunch.

### 2017-10-10
- Cards: Elimina OPs que se muevan a columnas ocultas.
- Botón "Aplicar" en el sidebar de filtros, ahora "Limpiar" necesita aplicarse.
- Cards: Actualiza texto contador de OPs para que coincida con las mostradas en el tablero.
- Visor: Deshabilita la opción "Eliminar" en comentarios con recurso final.

### 2017-10-08
- Refactoriza "Asignar usuarios", el reemplazo se efectúa al cerrar el popover.
- El campo `updated_at` puesto en el front debe ser string para no afectar la ordenación.

### 2017-10-06
- Cards: Se cambia a permanente la memorización de columnas (usando localStorage).
- Cards: Filtro "Asignadas a mí" debe mostrarse deshabilitado en vez de ocultarse.
- Cards: Mueve el botón "Actualizar" al icono "Refrescar" en del subtítulo del tablero.
- Cards: Link a la OP.

### 2017-10-05
- Cards: Se incluye botón de topbar para limpiar el filtro "Asignadas a mí".
- Cards: Completa la ocultación de columnas usando config global por sesión, a diferencia de los filtros regulares que cambian cuando el equipo/reto cambia.

### 2017-10-04
- Cards: Ocultación de columnas parte 1: Markup y CSS.
- Mejoras al diálogo "Mover a..."
- Visor: Normalización de comas-espacios en "Relacionado con" y "Palabras clave".
- Notificaciones: Agregar grado y reto a los mensajes de notificaciones relacionadas con OPs.
- Boards: Cambia el punto negro por una campanita de notificaciones.
- Cards: Agrega atajo de teclado (R) para "Actualizar". Ver `https://www.w3schools.com/tags/att_global_accesskey.asp`

### 2017-10-03
- Cards: Elimina las restricciones del front para mover una tarjeta a "Ready to publish" o "Publish".
- Cards: Deshabilita la tarjeta que se está actualizando después de haber hecho un cambio de columna.
- Bugfix: Si das click en equipos y retos y te cambias a requisiciones antes de que termine de cargar equipos...

### 2017-10-03
- Visor: Deshabilita iconos de la barra para usuarios sin "edit" y OPs publicadas.
- Visor: Evita el cambio de anchura del contenido del visor por la presencia de la barra de scroll.
- Visor: Evita cambiar thumbnail y cualquier otra cosa en OPs publicadas.
- Ajustes a CSS para enfatizar el uso de título personalizado o de KRB.
- Corrección a pusher/get-messahes.js y a scripts/open-in-tab.js para reconocer url de OP no válidas.
- Ajustes y fixes varios en preparación para la salida a producción.

### 2017-10-02
- Cards: Valida que la OP tenga un Thumbnail antes de poder moverla a Publicado.
- Visor: Solamente los usuarios ADMIN y TESTER pueden cambiar el Recurso final.
- Cards: Ordenación por `updated_at` DESC / Se proteje la carga de Publicadas y Actualizar para evitar recursión.
- Bugfix: Cambio de status desde "Mover a..." o actualización del visor no cambia a la OP de columna.
- Cards: Implementa la actualización de notificaciones en tiempo real.

### 2017-10-02
- Visor: Muestra icono para archivos sin vista previa y mejoras en el visor iPad que sí los muestra.
- Visor: Edición de comentarios y fix al historial agregando entradas de más al actualizarse.
- Visor: Botones de edición y eliminación de comentario como iconos.

### 2017-09-28
- Visor: Agrega localizador de OP al visor.
- Cards y Visor: Mejoras en respuesta del botón "En progreso" y Bugfix y mejora del historial.
- Boards: Fix a Vista de tableros no mostrando el resultado de los filtros.
- Cards: Integración de carga de "Publicado" con los filtros.

### 2017-09-27
- Fix a borrado de comentarios, ahora mucho depende de ellos, se lanza actualización de la orden.
- Fix a bugs de Sortable y a dataMan perdiendo sincronía entre `orders` y `columns`.
- Cards: Botón "CARGAR PUBLICADAS" trabajando, falta recargar al cambiar filtros.
- Cards: Preparado para carga de publicadas, cards/move-to.js se renombra a cards/drag-n-drop.js y se carga como los demás sub-módulos.
- Cards: Agrega opción "Actualizar" del encabezado y prepara el entorno para cargar publicadas.
- Revisión de Drag & Drop por más problemas, Sortable se pone en scripts/lib para fijar un bug.
- Fix a problemas persistentes de file_origen y el editor de Publicación.

### 2017-09-26
- Ajustes a rutinas de "Mover a", quedando preparadas para su uso en movimientos masivos.
- Se reimplementa el método genérico para PATCH (patchData) y se separa de bulkUpdate (bulkPatch).
- Visor: Arregla desajuste de requisiciones y en comentarios pone "Marcar como recurso final" en azul.
- Cards: Simplifica detección de destinos, agrega efecto de inclinación y opacidad de destinos no válidos.
- Cards: Correcciones a la búsqueda avanzada debido a cambios en la API y en el router.
- Cards: Apertura de visor por medio de queryString, para soportar links a una orden.
- App: Se amplía el router para manejar queryString como función.

### 2017-09-21
- Visor: Repara el problema de los index_*.html no mostrando defaults en publicación.
- Visor: Revisión y correcciones de sincronía entre la Vista de tarjetas y el visor.
- OP: Evita errores de carga en el panel.
- Se agrega el evento VIEWER_UPDATED en tableros, la biblioteca "observable" ahora atrapa error de nombre de evento.
- Cards: Evita que se muestre el infoBar de la tarjeta cuando está vacío.
- Refactoriza preprocesamiento de tarjetas y visor para evitar al máximo los errores de carga.
- Boards: Retoques a la precarga del markup de la vista.
- Cards: Ajustes para trabajar con el nuevo formato del response.
- Boards: Ajustes para mostrar el spinner durante más tiempo.

### 2017-09-20
- Se declara `CARDS_PER_PAGE` en el /config.js para controlar cuántas OP carga la Vista de tarjetas.
- Visor: Implementa el borrado de la OP.
- Visor: Implementa actualización del historial en tiempo real.
- Visor: Ajuste al CSS de requisiciones incluidas.
- OP: Usuarios no "ADMIN" no tienen acceso al módulo antiguo de OP.
- Visor: En Publicación si se selecciona el título de KRB se deshabilita el propio, por el contario se visualiza de forma evidente.
- Visor: Deshabilita la edición de datos generales de órdenes con estatus RP.
- Visor: Al marcar una orden como RP ahora sale una tostada que dice "Recurso listo para publicación".
- Visor: Restructura la clase Thumbnail para actualizar correctamente los cambios.
- Cubiertos varios puntos de la tarjeta "Ajustes al visor".

### 2017-09-19
- Cards: El arrastre a "Ready to Review" abre spinner
- App: Se acelera el tiempo de carga ~1.5 segundos ...y se nota.
- Visor: Botón de lápiz para Publicación, no editable si el status ya es "Ready to Publish".
- Ignorado avatar genérico para usuarios (se elimina del catálogo "users").
- Visor: Número máximo de líneas de comentarios establecido con la nueva opción maxLines de $.autoHeight
- Cards: Manejo de `requires_final_resource`, impide al drag soltar en una columna que requiere recurso final y cuando la orden no tiene uno.
- Visor: Recurso final se cambia si el valor `set_final_resource` del catálogo `card_statuses` lo permite.
- Cards: Se integran iconos de retos con fondo transparente para adaptarse si hay cambio de color.

### 2017-09-19
- Editor de Publicación y "Ready to Publish" trabajando, con control de estado a la Dio/React.

### 2017-09-18
- Revisada la carga del visor, en especial se cambia la lógica de apertura y renderizado para manejar mejor los cambios rápidos de OP (la anterior no lo hacía bien) y mejoras al CSS de animación.
- Segunda revisión y preparación del CSS del visor.

### 2017-09-17
- Visor: Implementación del editor de la OP, dentro de la página de detalles.
- Visor: Separación de la parte de la página de la página de detalles que contendrá el editor.
- Limipeza de código y algunos ajustes globales.
- Visor: Refactorización del 60% del CSS del visor, corrección de bugs y homologación de clases.

### 2017-09-15
- Visor: Funciona ya el botón para alternar "En pausa" / "En progeso".
- Visor: Implementa Ctrl+Enter para guardar comentario y otro pequeño fix al markup.
- Debido a problemas de duplicación, se usa el nuevo spinner modal al cambiar el recurso final.
- En scripts/modal-spinner.js está un helper para crear un spinner modal con EasyAlert.
- Bugfix de EasyAlert no permitiendo inserción de markup en el mensaje.
- Visor: Implementa "Recurso final", funcionalidad y CSS en el visor y la tarjeta.

### 2017-09-15
- Bugfix a botón "Responder" comentario no trabajando.
- Bugfix a error al enviar comentario sin adjuntos (si se guardaba, no se veía).
- Bugfix a contador de comentarios/adjuntos incrementándose por cada archivo.
- Usando `MAXSIZE_THUMBNAIL` (0.4MB) y `MAXSIZE_DELIVERY` (100MB) desde el config.js

### 2017-09-14
- Se integra previsualización de Thumbnails en los comentarios.
- Visor: Link "Responder" de comentarios hace focus al editor e incluye mención.
- Soporte markdown para citaciones / Se actualiza el indicador de adjuntos de las tarjetas en tiempo real (también se ve la cuenta en el editor).
- Bugfix a doble apertura del visor.
- Se muestra Markdown y Emojis!
- Se actualizan los comentarios en el historial de la orden después de enviarlos.
- Bugfix mensaje "Cancelado" al destruir el Dropzone del "Thumbnail".
- Cards: Usando POST/orders/bulkUpdate con nueva rutina de errores (faltan pruebas).
- Visor: Lista de comentarios con "key", spinner y fade independiente, ajuste general del CSS.
- Visor: Se omite Bootstrap TAB para el cambio de pestañas de DetailsPage y 2 fixes menores al código.

### 2017-09-13
- Visor: "Archivos subidos" funcionando, Thumbnail (casi) funcionando, falta CSS.
- Visor: Ajustes a los componentes `DetailsPage` y `History` en preparación para cambio dinámico de datos.
- Visor: Se llama a dataMan.prepare antes que a prepareData con la orden del endpoint, prepareData ahora es más ligera.
- Visor: El array `history` ahora está en `versions` ya ordenado y con las versiones sin cambio excluídas.
- Visor: Ajustes al markup y CSS usando algunas reglas comunes al módulo, integra nuevos iconos SVG.
- Boards: Convierte el archivo evt_ids JSON a JS para poder incluir comentarios.
- Cards: Enviar el orders.status siempre que se envíe un el card_status

### 2017-09-12
- Cards: Implementa el diálogo del tester cuando una orden sale de una columna de validación.
- Cards: Mejoras al CSS del drag entre columnas.
- Cards: Elimina el botón "En espera" / "En progreso" de tarjetas en columnas que no soportan substatus.
- Cards: Mensaje "Aplicando filtros…" mientras se espera respuesta del endpoint.

### 2017-09-11
- Cards: Mueve archivos de servicio del módulo a "boards/lib".
- Cards: Se reduce la altura del encabezado secundario en 12px (2+10 en el commit anterior) para dejar más espacio a las columnas.
- Cards: Restablece "font-smoothing: antialiased" y "font-size: 300" como defaults del encabezado.
- Refactorización del cambio de estado, ahora el arrastre de tarjetas y la asignación de usuarios deben funcionar correctamente.

### 2017-09-10
- Cards: Diferencía el mensaje al poner o quitar prioridad.
- Cards: Evita que el form de filtros oculto con opacity:0 tape el input de la búsqueda rápida.
- Cards: Ajustes al cuadro de búsqueda rápida y el grosor de las fuentes del encabezado.

### 2017-09-09
- Cards: CSS más específico para los colores de la página.
- Cards: Segundo intento para igualar colores de los encabezados (bastante mejor).
- Cards: Implementación parcial de encabezado principal igualando color del reto.
- Cards: Evita mostrar texto demasiado tenue en el encabezado y aclara el color del placeholder de la búsqueda rápida.
- Cards: Muestra indicador para saber si hay filtros aplicados en la columna.
- Cards: Cambia a 10 el paginado de los resultados de las Búsquedas.
- Reacomodo de archivos .less para evitar duplicidad de declaraciones.
- Cards: Borde rojo a OP rechadas / Ajuste a sombra y padding de datos del thumbnail.
- Cards: Sustituye el subtítulo (contador) de la columna por "N órdenes (N en progreso)".
- Cards: Evita generar error si la posición de columna llega vacía.
- Cards: Agrega "T." al ID de la OP y el número de requisiciones cuando son más de una.
- Cards: Muestra cambio rápido de usuario en tarjeta al asignarlos (falta visor?).
- Visor: Evita que el preprocesamiento del visor altere el estado de las tarjetas (aun hay alteración).
- Cards: Mejora el arrastre de tarjetas entre columnas, se dispara error si hay inconsistencias.
- Nueva función de comparación de objetos en `modules/boards/lib/comparator.js`.

### 2017-09-08
- Ajustes para 3er entrega de fase3, completado 90% de substatus y CSS de las órdenes.

### 2017-09-07
- Cards: Agrega imágenes de avatar para los usuarios asignados.
- Cards: Filtrado de columnas por substatus, solo por ocultación.
- Implementados los subfiltros (substatuses) con nuevos códigos y reglas, preparado para manejarse en el estado.
- Refactorizada la lógica para marcar tarjetas (checkbox), el estado podrá separarse de los datos más adelante.
- Centraliza el estado en la clase CardsViewStore, podrá facilmente separarse de los datos.
- `queryChildren` (modules/boards/lib/query-children.js) ahora acepta un ID tipo string.
- Se usa el endpoint `PATCH/orders/:id` para mover una tarjeta de columna (sólo cambio de status) con Drag & Drop.
- Limpieza de la App, se crea "scripts/create-app.js" para crear e inicializar el objeto App.
- Ajustes a `App.store`, se hace un poco más rápida y evita `bind`s no necesarios.
- Cards: Todo preparado para el movimiento Drag & Drop con endpoint.

### 2017-09-06
- Cards: Se corrigen memory leaks introducidos por la combinación de Sortable y dio.
- Cards: Se pasan las funciones para mover tarjetas al archivo "movet-to.js"
- Implementación de los nuevos `card_status` usados en lugar de `status`.
- Cards: Implementa "La orden seleccionada debe abrirse en el visor"
- Cards: Limpieza y ajuste de la Búsqueda avanzada.
- Cards: Primer versión funcional de Búsqueda avanzada combinando modal de Bootstrap y componente dio.js

### 2017-09-04
- Primer versión de las búsquedas soportando cambio automático de equipo/reto para ordenes fuera de la vista actual.

### 2017-09-03
- Clase Filter más desacoplada, elimina la memorización de apertura.
- Topbar de filtros completo como componente.

### 2017-09-02
- Cards: Asignación de usuarios y algunas correcciones en el Visor, se acelera la carga.
- Cards: La lectura de datos anteriormente en `cards/get-data.js` ahora se concentra el `cards/create-model.js`
- Cards: Actualización de usuarios asignados por medio del store, lanza evento USERS_UPDATE si hay éxito.
- App.server.showError ahora devuelve la cadena usaada como mensaje de error.
- Implementa la función global `selfDelete` como `$.selfRemove(el)` (el parámetro es el elemento DOM).
- Limpieza del código de app.js, las extensiones de jQuery/Bootstrap se cargan por separado.
- Se demora la limpieza de entorno de la App y se centralizan nombres de eventos en App.EVT
  La limpieza se efectúa después de llamar al preloader del controlador y solamente si
  éste se ejecuta en #main-page.
- Cards: Preparación de archivos para usar estilos compartidos por el módulo.
- Cards: Se agrupa el componente para filtros dentro de su propio directorio (modules/boards/cards/filters).

### 2017-09-01
- Correcciones a la asignación de usuarios, endpoint con bugs.

### 2017-08-31
- Implementa la asignación de usuarios en la "Vista de tableros" (por lote, sin endpoint).

### 2017-08-29
- Implementa la "Búsqueda rápida" en la Vista de tarjetas.

### 2017-08-28
- Integra filter-tokens.jsx en filters.js
- Agrega nuevo evento global para cerrar el popup de filtros con: `App.store.trigger(App.store.CLOSE_FILTERS)`.
- Agrega `app/modules/boards/lib/grade-key.js` que crea un objeto para transladar grade a su código de 2 letras.
- Usando `attachment_count` / Ajuste al CSS del indicador de la cuenta de comentarios.
- Implementa tokens de filtro / Ajustes a las rutinas de filtros del sidebar.
- Modificación de scripts/lib/get-value.js para soportar múltiples checkboxes.

### 2017-08-27
- Mejoras en los estilos del sidebar de filtros.
- Más ajustes a la clase Filter para facilitar su integración con los tableros.
- Efecto "fade" en el cambio de Búsqueda a Acciones globales al seleccionar tarjetas.
- Simplifica el control de las tarjetas marcadas usando un flag en las órdenes mismas.

### 2017-08-26
- Se agrega polyfil para "matches" y "closest" a header.js aunque todos los navegadores modernos las implementan.
- Refactorización para centralizar el control de los filtros al leer datos desde el servidor en boards/cards/get-data.js.

### 2017-08-25
- Cards: Avance de los filtros laterales.
- Refactorización de la clase Filter para soportar los filtros laterales de Vista de tarjetas.
- Teams: Deshabilita el alta y la edición edición de equipos, solamente administra usuarios.
- Cards: Implementa acción global de `priority` para OP seleccionadas.
- Cards: Manejo correcto de Drag & Drop imitando a Trello en lo posible.

### 2017-08-24
- Boards: Implementa la apertura de la Vista de tarjetas en nueva pestaña con Ctrl+Clic.
- Cards: Ajustes de márgenes y paddings para reducir la altura de algunos elementos.
- Se agraga una class a document.body con el mismo valor que document.section, actualizada cada vez que se cambia de página por medio del método changePage de app.js llamado por el router. El valor es uno de los listados en el array `menu` de routes.js. La intención es usarlo para aplicar estilos "contextuales" a elementos fuera de `#main-page` dependiendo del módulo en ejecución.
- OP: Los valores por omisión de `file_origin` en la pestaña Publicación se ponen solamente en modo de edición.
- Se implementa el catálogo "grades" como array de {id,name}, donde `id` es el código del grado de una OP.

### 2017-08-23
- OP: Agrega campo file_origin a la pestaña de publicación.
- Nuevo componente `UserAvatar` en scripts/user-avatar-h.js, acepta `userId` y `class`.

### 2017-08-19
- Avance filtros de Vista de tarjetas.
- Mejoras al CSS del checkbox de las tarjetas.
- Avance en Vista de tarjetas - mejoras al scroll e implementación de overlay.
- Implementa filtro memorizado en Vista de tableros.

### 2017-08-18
- OP: Cualquier usuario puede cambiar el thumbnail de una orden no publicada.
- Se inicializa el markup externo de la Vista de tarjetas.

### 2017-08-17
- Se implementa el la "Vista de Tableros" de forma básica.
- Inicio de fase 3 usando dio.js

### 2017-07-28
- Bugfix filtros: botón "Limpiar" no funciona y ajusta desplazamiento para no ocultar la tabla.

### 2017-07-27
- Mantiene fijo el sidebar de filtros de los páneles.

### 2017-07-26
- Páneles: Agrega opciones "Seleccionar todo" e "Invertir selección" a filtro de Tipo y Versión de recurso.
- Páneles: Compacta filtros laterales y convierte todos en expandibles.
- Implementa mensaje del estado del filtro en los páneles de OP y Req.

### 2017-07-25
- Reqs: Ajuste a commit de @roccons, cambia ID duplicado `#production_key_str` a `#location_key_str`.
- Reqs: Ajuste a commit de Richard para no-envío de `assigned_editor`.

### 2017-07-24
- Requisiciones: Vista de detalle muestra texto y oculta select de "Editor asignado" en modo de solo-lectura.

### 2017-07-20
- Bugfixes varios a vista de detalle y editor de Requisiciones.

### 2017-07-19
- Panel de requisiciones implementa el cambio masivo de "Editor asignado".
- Implementa nuevo filtro "Guión" para requisiciones y "Editor asignado" para requisiciones y OP.
- Requis: Soporte para nuevo campo `assigned_editor` en el editor de requisiciones (usuarios con permiso "edit").
- Requis: Soporte para cambio de status y edición de campos para usuarios con permisos "status-EE-RR", "title-edit", "storyboard-edit" y "assign-editor" (Solo vista de detalle).

### 2017-07-18
- Evita error en las imágenes de avatar que terminan en '.png.png'.
- Bugfix a campo de lenguaje inexistente tronando la edición de requisiciones.

### 2017-07-12
- OP: Implementa filtro de "Estado de revisión de tareas" en el pánel de órdenes.
- Fix a Gestión de equipos no direccionándose correctamente.

### 2017-06-19
- OP: En tareas con el botón para realizar entrega deshabilitado se muestra mensaje.
- OP: En órdenes con status DD (así como RP y PP) las tareas son de sólo-lectura.
- OP: Agrega botón "Rechazar" a tareas con entregas ya aprobadas (no Ready, no Published).

### 2017-06-19
- OP: Se implementa manejo de error de formatos KRB (bugfix a Publicación).

### 2017-06-16
- OP: Agrega campos para lanzadores en pestaña de publicación para recursos tipo HTML.
- OP: Se recarga la orden si ésta tenía un status PUBLISHED y el usuario lo cambia.
- OP: Bloqueo correcto del diálogo durante la subida de archivos.
- Fix a rutina de bloqueo de modales Bootstrap.

### 2017-06-07
- Se implementa el módulo de Reportes.

### 2017-06-06
- onlyDigits se convierte a plugin de jQuery.

### 2017-06-01
- Implementa modal de "Búsqueda avanzada" del pánel de Requisiciones.
- Refactorización de "Búsqueda avanzada" como clase, usable por OP y Requisiciones.
- Implementa modal de "Búsqueda avanzada" del pánel de OP.
- Agrega extensión de Tokenfield para direccionar los `focus()` al input del token.
- Agrega rutina de formateo de `production_key` para los input de tokenfield.

### 2017-05-25
- OP: Deshabilita botón "Completar" si entrega no contiene `can_be_completed` en Sidebar del creativo.

### 2017-05-25
- Agrega filtro "Sólo mis ordenes" a los filtros de los páneles.
- Agrega medallita roja al panel de OP para órdenes con tareas rechazadas (`rejected_tasks>0`).

### 2017-05-25
- Elimina la fuente knotion, el único icono usado (Home) se convierte a SVG.
- Se agrega "Productor responsable" a los filtros de Requisiciones y OP.
- En editor de OP la clave de producción se lee para cada requisición de la orden.
- Sustituye `location_key` por `production_key` en los editores, leyéndola desde Autoría si es necesario.

### 2017-05-24
- Ctrl+Clic en páneles abre pestaña en segundo plano (no en todos los navegadores).

### 2017-05-23
- Fix a salida errónea de markdown.
- Control "AutoHeight" como plugin de jQuery para autoajuste de TEXTAREA en sidebar entregas, hasta 25 líneas.
- Incorpora link a cheatsheet de markdown y emojis en editores de comentarios.

### 2017-05-11
- OP: Adaptación para recibir puntajes del tester con decimales como string.
- Requisiciones: Solamente pueden ser Productores responsables los `KPROD_PRODUCTOR_ACADEMICO` + fix.
- OP: El puntaje escalar acepta hasta 2 decimales en el panel del tester y otros sidebar.
- Requisiciones: Ajusta el historial para campo doble de Productor responsable.
- Requisiciones: Implementa "Productor responsable" en el editor. En historial solo el título.

### 2017-05-10
- Fix "Al asociar una req a una op no se está actualizando el id de orden en el editor de req".
- Requisiciones: Agrega columna "Productor responsable" al panel.
- OP: Agrega el botón "Eliminar orden" al editor.

### 2017-05-08
- OP: Fix a bug que impide abrir el "Contexto del recurso".
- Requisiciones: Elimina restricción !order_id para generar/asociar a orden.

### 2017-04-03
- OP: Contadores de tareas muestra solo las activas, aun para usuarios "task-manage".
- OP: No se permite la desactivación de tareas que tienen entrega `is_final`.
- OP: Previene error por `users[]` inexistente en lista de tareas.

### 2017-05-02
- OP: Limpia Dropzone y acelera la carga en sidebars, avisa de interrupción de comentario con adjuntos.

### 2017-05-01
- Gestión de equipos: Sincronizando perfiles.
- OP: Limpieza de sidebar y Fix a error de carga en sidebar del creativo.
- Se mueve el visualizador iPad a la carpeta `helpers`.
- Revisada memorización por sesión, no parece haber problemas con los datos.
- Se elimina memorización de filtro por sesión en Gestión de tareas y equipos.
- Gestión de Tareas: Se actualiza lista por recurso al editar o eliminar una tarea.
- Sincronización correcta de ordenación en Gestión de Tareas y Equipos.
- OP: Revisión de permisos para las acciones de tareas, en especial PUBLISHED de la orden.
- OP: La lista de tareas omite acciones accidentales por doble clic.
- OP: La lista de entregas excluye el editor de comentarios para usuarios sin "comment-add".
- Mejoras en el despliegue de contenido del sidebar, se interceptan errores de carga.

### 2017-04-27
- OP: Los contadores de la lista de tareas excluyen tareas deshabilitadas.
- OP: Cambios en las tareas (is_final, entrega, revisión) generan la lectura completa de la orden para evitar inconsistencias entre los datos de la UI y el servidor.
- Se evitan más llamadas innecesarias para leer el historial.
- Fix a la búsqueda en los páneles que no permite espacios finales.
- OP: Fix a tareas con número incorrecto si hay tareas ocultas para usuarios sin "task-manage".

### 2017-04-26
- Requisiciones: Fix a la acción de "Editar" quitándose después de cambiar status.
- Homologación de estilos y mejoras de Primitivas y Equipos.

### 2017-04-25
- Clasificación visible en los editores de OP y Requisiciones.
- Clasificación con default "Curricular" en páneles.
- OP: Implementa publicación por lotes (`/orders/bulkPublish`).
- OP: Implementa selección de Prioridad en cambio por lote.
- OP: Agrega "Equipos" al panel y al editor.

### 2017-04-24
- Elimina archivos innecesarios, más ajuste a equipos.

### 2017-04-23
- Equipos: Mejoras de usabilidad con el teclado y corrección de CSS.
- Equipos: Previene edición doble de integrantes.

### 2017-04-22
- Equipos: Fix a deversos bugs.

### 2017-04-21
- Se implementa el módulo "Gestión de equipos".

### 2017-04-20
- OP: Agrega medallita de "Waiting for Review" al panel.
- Fix a Tareas Primitivas no lanzando el diálogo para "Nueva tarea".
- Fix a `hasClass` de header.js, ahora soporta elementos SVG.
- Clase Filter de panel-filter y archivos dependientes se mueven a helpers.

### 2017-04-19
- OP: Permite abrir una tarea desde una orden por medio del queryString "tarea_id".

### 2017-04-18
- App: `Date.min` y `Date.max` devuelven fecha mínima/máxima, excluyendo fecha NaN si alguna lo es.
- App: Nueva función dateCompare para comparar fechas (sin horas) similar a `String.compare`.
- OP: Fecha límite inicial de orden y tareas puesta a fecha actual, o la ya establecida si esta es menor.
- OP: Ajuste a colores de la fecha límite de órdenes (pánel) y tareas (lista).
- OP: Agrega marca de "Recurso final" a la lista de tareas.
- OP: Fix a bug lápiz y profiles en tareas, se hacen editables otros campos.
- OP: Fix a bug Sortable + Firefox en ordenación de tareas.
- OP: Se evita el envío de propiedades extrañas al PATCH de tareas para evitar falso historial.

### 2017-04-17
- OP: La reordenación de Tareas lanza actualización del historial.
- OP: Fix Publicación: al dar click en palomita de aceptar te debe sacar del modo de edición aunque haya cambios.
- OP: Implementadas las acciones en lote para "Fecha límite" y "Prioridad" en el panel.
- OP: Historial mostrando solo la primera línea, y actualizando al agregarse un comentario de entrega.
- OP: Cambiado mensaje de is_final en el historial.
- OP: Popover de icono KRB en Publicación se "ancla" automáticamente en modo edición (con focus() en hover del icono).
- OP: Historial no debe incluir la ruta completa del thumbnail.
- Requisiciones: Fix a acciones globales recargando la App.
- Se generaliza el diálogo de opciones masivas y la actualización de las bootstrap-table.

### 2017-04-16
- OP: Ajustes a la pestaña del historial.
- Fix: al editar una tarea desaparecen los checklists.
- Primitivas: Un poco más de espaciado a iconos de herramientas.
- Ordenes: Publicación carga el título de KRB y muestra alerta si hay discrepancia.
- Requisiciones: En páneles evita que se abra el popup "Otras acciones" cuando el botón está deshabilitado.
- Optimización de algunas rutinas relacionadas con bootstrap-table.

### 2017-04-15
- Fix: QuickTags no es ordenable en tablas de Órdenes y Requisiciones.

### 2017-04-14
- Refactorización de la Gestión de tareas, mejoras en rendimiento y apariencia...
  En las gestión de tareas se precarga el editor principal y la edición de checklist y criteros es en el lugar.
  En la gestión por recurso los elementos encontrados excluyen los que ya están enlazados y se permite editar la tarea.

### 2017-04-12
- OP: Se agrega evento de historial para comentario agregado.

### 2017-04-11
- OP: Incluye la acción "added" en el historial (en tareas sin valor anterior o nuevo).
- Requisiciones: Se agrupan algunas acciones globales del panel.
- Nuevo merge de "phase-2" con "dev", la rama de desarrollo se cambia a "dev".
- OP: Más correcciones y ajustes al formato del historial.
- OP: Se estilan los valores anterior y nuevo del historial con los elementos html `DEL` e `INS` respectivamente.

### 2017-04-10
- OP: Inicio de refactorización del historial para adecuarse a campos de phase-2.
- Requisiciones: Se permite seleccionar todas en el panel.
- Merge de phase-2 en dev.
- Requisiciones: Oculta botón "A+" en entorno de Producción.
- Requisiciones: Funcionando las acciones por lotes del panel.
- Tareas: Revisados permisos, detalles se encuentran en [doc/permisos.md](doc/permisos.md).
- Si la última tarea fue anulada, muestra mensaje en el sidebar del tester y el creativo.
- Oculta del botón para "Generar CSV" del Dashboard excepto en entorno DEV.

### 2017-04-09
- OP: Revisión de eventos del historial.

### 2017-04-07
- Tareas: Se cambia automáticamente el status de la OP a DOING si estaba en TODO y se inicia el trabajo de una entrega.
- Tareas: Si no hay entregas realizadas se abre el sidebar de entregas mostando mensaje.
- Tareas: Fix a BUG en el markup de sidebar creativo y tester mostrando revisión incorrectamente.
- Cambio de endpoints para la exportación de CSV de órdenes y requisiciones.
- Tareas: Los sidebar del creativo y el tester muestran previews, el botón "Anular entrega" ya no es primario.
- Normalización de Dropzone y previews, ahora todos lanzar visor iPad y recortan el nombre de archivo.

### 2017-04-06
- Ajustes al sidebar de OP y normalización de espaciado de las etiquetas en general.
- Tareas: Sidebar de entregas excluye entregas TODO y la lista de tareas no muestra cursor pointer si no hay entregadas.
- Requisiciones: Intenta que el botón de cierre aparezca en los diálogos de "Asignar recurso KRB" y "Asociar a orden".
- Tareas: El editor de tareas no requiere los usuarios.
- Tareas: Primera implementación de anulación de tareas (pendiente aclarar detalles).
- Tareas: No se permiten comentarios en el sidebar de entregas para entregas no efectuadas.
- Tareas: Sidebars muestran ellipsis para títulos de tareas excedidos.
- Tareas: Se renumeran las tareas en la UI ignorando position, y omitiendo numerar tareas no visibles.
- Tareas: Sidebar del tester mantiene TODOs ignorados.
- Tareas: "Editar" y "Activa" en sus propias columnas, ajusta CSS y corrije pequeños bugs del editor.
- Implementado sidebar del tester guardando TODOs ignorados.

### 2017-04-05
- Tareas: La creación de tareas pone como default el flag "enabled" pero permite desactivarla.
- Tareas: Se sustituye la columna "Revisión" por "Acciones" para incluir Editar y Desactivar en ella (solo task-manage).
- Tareas: Implementado el editor de tareas para usuarios "task-manage".
- Limita "Agregar nueva tarea" a usuarios "task-manage" y muestra loader en el selector de nueva tarea.
- Ajustes al selector de nueva tarea permitiendo overflow-y, selección con clic sencillo o con Enter.
- Editor de tareas finalizado.

### 2017-04-04
- Tareas: Agregado eventos tokenfield para impedir introducir usuarios no válidos en el editor.
- Tareas: Integra Twitter Typeahead para autocomplete de IDs y nombres usuarios.
  Creado el CSS de Typeahead para coincidir con el tema material.
  Hack del código de Typeahead para detener Esc cuando el popup está abierto.
- Se incluye un array con nombres de validaciones como catálogo 'validations'.
- Tareas: Preparado el markup para agregar y editar tareas.
- Incluye "skills" dentro de los catálogos buscables con `nameFromId` y relacionadas.

### 2017-04-03
- Actualiza "Aprobado por" en el panel lateral después de aprobar una requisición.
- Endpoints sin uso en: https://docs.google.com/document/d/1eaL-MTeluhdCa7W9YS_6g-jz5v5H77VTRvZnZrhv7gQ/edit#
- OP: Sincroniza campos de Publicación título y tags con "Título" y "Keywords" de pestaña Detalle.

### 2017-04-02
- Tareas: Muestra los criterios de revisión desplegados inicialmente en el sidebar del tester.
- Requisiciones: Permite asignar a una orden aun si ya tiene un ID de recurso de KRB (`krb_resource_id`).
- Tareas: Sidebar oculta la suma de scores si la entrega no ha sido revisada.
- Requisiciones: El id de KRB recibido de Autoría se cambia a `resource.krbResourceInt`, excluye tipo 10 (APP).

### 2017-04-01
- Consulta API KRB si recibes de autoría un `krb_resource_id`.
  En este caso se autocompletan los campos `resource_tags`, `related_to` y `knotions_bank_description`.
- Algunos ajustes, correcciones y optimizaciones en las Tareas.
- Consolida rutinas y markup de los sidebar de tester y creativo.
- Ordenes: Elimina la columna "Equipos" de la tabla de ordenes.
- Se mueven a modules/orders/utils/ archivos que residian en models/.
- Tareas: Reemplaza posiciones cero de la lista de tareas por posiciones consecutivas no usadas.

### 2017-03-31
- Tareas: Fix a sidebar de checklist generando markup incorrecto cuando existen revisiones anteriores.
- Ordenes: Se muestra preview del Thumbnail en "Publicación" y se agrega texto "Thumbnail" y tooltip a su dropbox.
- Tareas: Ajustes a sidebar de Entregas, texto, tostada y cambio de estado al cambiar `is_final`.
- Tareas: Unifica el cálculo de puntaje del sidebar de entregas con el de checklist.
- Tareas: Sidebar de checklist mostrando más datos en entregas revisadas.
- Fix: Cuando se cambia el status de orden la lista de instancias de tareas queda inestable y sale tostada "Task N not found" al hacer clic en alguna de ellas.

### 2017-03-30
- Tareas: Se oculta columna Revisión para usuarios sin delivery-approve.
- Tareas: Sidebar de entregas muestra checkbox para seleccionar recurso final.
- Más ajustes a la pestaña de tareas y sus sidebar.

### 2017-03-29
- Tareas: Evita que se abra popup de comentarios para usuarios sin privilegios de creación + CSS distintivo.
- Tareas: El panel del creativo muestra los checkbox inicialmente colapsados.
- Tareas: Se impide agregar comentarios a usuarios sin "comment-add" (tabla y sidebar).
- Tareas: Se pueden comentar cualquier entrega realizada (sidebar), incluso las antiguas.
- Tareas: Margen a status en la tabla de tareas cuando el status es la primer columna.
- Se ocultan los menús no permitidos al usuario actual (usando roles por ahora).

### 2017-03-28 (Ajustes Post-entrega)
- El panel del tester muestra los criterios de validación desplegados inicialmente.
- Fix al panel de lista de versiones que mostraba un tooltip incorrecto en la medallita.
- El panel de lista de versiones muestra todas las versiones aun si no se han revisado.
- El panel del tester muestra información del tipo de la validación requerida.

### 2017-03-28
- Tareas: Color de encabezado diferente para el panel del tester.
- Fix a bug de filtros de OP mostrando el catálogo de status de Requisiciones.
- Elimina equipos de la orden y corrije pequeños bugs en la lista de tareas.
- Concluye la implementación de los páneles de instancias de Tareas, asume versión RC1.

### 2017-03-22 a 2017-03-25
- Actualiza asScrollable a v0.4.7
- Tareas: Generaliza el CSS y oculta las noficiaciones de los comentarios.
- Centraliza previsualización mostrando solamente de tipos visibles en la mayoría de navegadores.
- Limpia archivos obsoletos de tareas y comentarios.
- Fix menor a dates.js, evita que las fechas muestren doble cero cuando provienen de cadenas.
- Implementación parcial del markup del visor lateral de Entregas.
- Finalizada preparación de lista de tareas para controlar a `App.sideViewer`.
- Se colocan hideTooltips y el singleton de Dropzone en jQuery como `$.Dropzone` y `$.hideTooltips`.
- Elimina el método `App.user.getKey` que accede a la clave de conexión del usuario.
- El servicio por evento "sideView" se elimina y en su lugar se usa el método `App.sideViewer`.
- Ajustes a slidePanel para recibir contexto en lugar de url y usar defaults.
- Se sustituye slidePanel v0.2.2 por un fork de la v0.3.3 de [AmazingSurge](https://github.com/amazingSurge/jquery-slidePanel).
- Elimina los archivos relativos a "Entregas" de la implementación anterior.
- Corrección: Se oculta la pestaña "Entregas", no la pestaña de tareas.
- Se usa `$.slidePanel.closeView` para cerrar el panel lateral con clic en el documento.
- Renombra el CSS de tareas de "styles/\_list-tasks.less" a "styles/\_tasks.less".
- ~~Oculta la pestaña de tareas~~.

### 2017-03-21
- Elimina la previsualización automática de los comentarios.
- Tareas: Se envía lista de objetos completos al PATH para reordenar.
- Refactorización de comentarios de tareas, implementados múltiples adjuntos.

### 2017-03-18
- Tareas: Se usa Bootstrap Popover para el popup de comentarios.
- Se elimina la biblioteca no usada jsGrid.
- Fixes y limpieza de CSS (table-hover correjido).
- Fixes a `hasClass` (soporte SVG) y rutinas de scripts/lib/fpath.js
- BootstrapTable: La extensión smartResize sustituye a mobileResponsive.

### 2017-03-16
- Tareas: Guarda reordenación usando el endpoint `PATCH/orders/{order}/taskInstances`.
- Se muestran los usuarios asignados (reales) en la lista de tareas.
- Implementación de Avatar genérico, se usa una misma función para generar todos.
- Reacomodo y limpieza de estilos, estructura de archivos más parecida a KRB.

### 2017-03-15
- Avances a instancias de tareas:
  - Se elimina el botón "Editar" para la pestaña "Tareas".
  - Implementa y estila los contadores de tareas.
  - Implementa reordenación de tareas (falta llamada a endpoint para guardar la posición).
  - Despliegue correcto de número de comentarios con el icono de Knotion.
  - Usando colores en iconos, la medallita de Knotion modificada para aceptar "outline".
  - Se elimina la columna "Completar" que se usará en el mismo diálogo de entregas.

### 2017-03-13
- Sustituye jQuery-UI.sortable por [Sortable](https://github.com/RubaXa/Sortable) y elimina jQuery-UI.
- Revisión de detalles para inicio de Fase 2.

### 2017-03-10
- Requisiciones: Oculta el link "Eliminar requisición".

### 2017-03-08
- OP: La publicación omite leer datos faltantes en la respuesta de la API.
- OP: Pide confirmación para cambiar a status "DONE", excepto si viene de "Ready to publish".
- OP: Ajustes a Publicación:
  El botón "Publicar" se muestra únicamente con estado RP, debajo del dropdown "Estatus".
  El botón "Ready to publish" se muestra dentro de la pestaña Publicación si el status es RP.
  Se muestra mensaje de confirmación para publicar la orden.
- Usando Date.toISOString en lugar de Date.toJSON por compatibilidad con Safari 8/9.
- OP: Cambio de comportamiento y fix de la pestaña "Publicación".
  Ahora el botón inferior se deshabilita durante la edición, separando los procesos.
  Fix al cambio de Estatus no detectado por la etiqueta del botón.
- OP: Implementa Publicación, se prepara para merge con "dev".
- Requisiciones: Depurado el mensaje de duplicados imprimibles de Autoría, se elimina el link.

### 2017-03-07
- OP: Fix a reactivación al vuelo de deliverables.
- OP: Fix a mensajes duplicados después de guardar o en error de Publicación.
- OP: Fix a `location_key` mostrada con valor incorrecto cuando hay múltiples requisiciones.
- OP: Integra rutina de guardado de requisición.

### 2017-03-06
- OP: Restablece color después de cancelar cambios (quita el rojo de los campos inválidos).
- OP: Guardando cambios de Publicación.
- Requisiciones: La ventana de cierre de reprint de Autoría muestra un link con el título.

### 2017-03-03
- OP: Deshabilita la edición de pestaña Detalles para status "Ready to Publish".
- OP: El botón de estatus permite la regresión de "Ready to Publish".
- Homologación de estilos 'hidden' y 'hide'. Se usa 'hide'.
- OP: Refactorización terminada, form global con un único flag "-editmode".
- OP: Separación de pestañas, sincroniza estado y cambios de status.

### 2017-03-02
- Fix a easySelect.getValue() devolviendo resultados incorrectos para múltiples selecciones.
- Refactorización de mensajes de error XHR.

### 2017-03-01
- Requisiciones: Muestra ID de recurso duplicado.
- OP: Fix a color de req. por imprimir no cambia en tiempo real.
- Incluye ESLint como parte de la cadena del build.
- Requisiciones: Implementa redirección de la UI al encontrarse una requisición de Autoría duplicada.
- Separa componente thumbnail (autocontenido).
- Usa copia estática de Dropzone.
- `getById` soporta IDs que empiezan con '#'.

### 2017-02-28
- Requisiciones: Avance requisiciones duplicadas (faltan los campos requeridos).
- OP: Editor mostrando color de req no impresas en tiempo real.
- OP: Editor evita mostrar cambio de color en req "print" con status Done, Publish y Ready to publish.
- OP: Editor muestra en color diferente las requisiciones "print".

### 2017-02-26
- Agrega cache-control a los HTML
- Oculta el tamaño del thumbnail en el editor hasta que se pueda obtener lo correcto.
- Ajustes al CSS de easySelect.

### 2017-02-22
- OP: Deshabilita efectos cuando no se puede agregar un thumbnail (orden publicada).
- OP: Agrega Clave de localización en la tabla de requisiciones del editor.
- OP: Permite la descarga de thumbnail y visualizar su tamaño (en hover).
- Páneles: Habilita Ctrl+Clic para abrir vista en nueva página.
- Requisiciones: Agrega descarga CSV.

<<<<<<< HEAD
>>>>>>> da05e35... Requisiciones: Oculta el link "Eliminar requisición"
=======
>>>>>>> dev
### 2017-02-07
- Requisiciones: También confirmar antes de cancelar.
- Requisiciones: Deshabilita el SELECT de idioma si hay un valor `resource_translated_id` existente.
- OP: Pedir confirmación antes de establecer el estado de una orden a 'CANCELED'.
- OP: Homologa colores de clases op-* y req-* incluyendo el nuevo `order.CANCELED`.
- OP: Integra el status CANCELED.

### 2017-02-06
- Refactorización de estilos y limpieza del código de inicialización de Remark.
- Oculta bug en del menú principal causado por asHoverScroll de Remark.
- Corrección de errores por reglas de ESLint no cumplidas, ahora el 100% está Ok.

### 2017-02-05
- Implementa trigger en cascada en `App.store`.
- Limpieza de commentarios.
- La biblioteca "marked" (markdown) se incluye como dependencia en package.json.

### 2017-02-02
- Fix a $.ajax.beforeSend() (scrips/services/users) confundido por cambio de contexto.
- Ordenes: Desbloquea la publicación de recursos hacia Rresource Bank.

### 2017-01-31
- Se carga fontawesome por medio del CDN de Bootstrap.
- Retira de jQuery UI los controles no usados.
- Ordenes: Los comentarios envían `mentions[]`.
- Ordenes: Usando el catálogo `users`.

### 2017-01-30
- Ordenes: Menciones y Emojis en comentarios.

### 2017-01-27
- Requisiciones: Elimina la restricción de edición de status "En producción".

### 2017-01-24
- Mejoras al procesamiento del CSV.
- Mejor reconocimiento de tipos en previews.

### 2017-01-23
- La clave Pusher ahora se diferencía por entorno.
- Se actualiza Brunch a la v2.10.2

### 2017-01-20
- Corrige bug de hasClass dando falso negativo con ciertas repeticiones de nombres de classes.

### 2017-01-18
- Deshabilita la publicación a RB, el código quedó marcado con @TODO.
- Implementa datos de acceso de Autoría diferenciados por entorno.
- Ordenes: Implementa visor de contexto del recurso.

### 2017-01-17
- Ajuste al editor de quickTags para usar el nuevo endpoint.
- Procesar CSV: Fix al listado de errores para trabajar con el nuevo response.
- Ordenes: Agregar/Eliminar thumbnail por drag & drop.
- Requisiciones: Visor del contexto

### 2017-01-12
- Implementa la edición de QuickTags en ambos editores.
- Fix a las tablas no interceptando el clic en el TD del checkbox.

### 2017-01-11
- Fix a selects Category/Type/Version no actualizandose para usuarios change-ask.

### 2017-01-10
- Requisiciones: Los usuarios change-ask pueden editar todo, pero los cambios de Versión quedan pendientes para aprobación y las propiedades adicionales de la versión original no cambian hasta que se apruebe la nueva versión.

### 2017-01-09
- Traduce a inglés las etiquetas Categoría/Tipo/Versión.
- Requisición desde autoría: Lee el campo del idioma.

### 2016-12-29
- Detalle de órdenes/requisiciones: Efecto especial a campos Tokenfield.
- Updated pugjs-brunch to v2.8.6

### 2016-12-28
- Se usa el valor en `form_field_options` para el despliegue y envío de los campos.
- Requisiciones: Agregado campo "Language" como requerido, sin default.

### 2016-12-23
- Requisiciones: Agrega "Recursos repetidos" al Detalle y al Editor.
- Notificaciones: También actualiza contador en el response HTTP de "Marcar todo como leído".
- Se incluye `bublejs-brunch` en devDependencies, con Bublé v0.15.1
- Editor de requisiciones: Los SELECTs de propiedades adicionales se predefinen a cadena vacía.
- Editor de requisición de Autoría: Los SELECTs de versión se llenan correctamente.
- Panel de órdenes: Se incluye columna de marca `needs_review`.
- Notificaciones: Usando nuevo endpoint para marcar todas como leídas / El número descargado se incrementa a 250.

### 2016-12-22
- Notificaciones: Acelera el borrado, corrige bugs de CSS, y descarta tostadas múltiples cuando es posible.
- Requisiciones: Señala con borde izquierdo azul las requisiciones que necesitan aprobación de cambio de versión.
- Requisiciones: Ajustar historial para solicitud/aprobación/rechazo de cambio de versión.
- Ordenes: Se usa el nombre de usuario en los comentarios.
- Ordenes: Importación de CSV usando el nuevo endpoint `GET/exports`.

### 2016-12-21
- Detalle de requisición: Agrega link a IDs de recursos, se elimina la opción de menú "Ver en autoría".
- Detalle de requisición: Implementa botones exclusivos para Aprobar/Rechazar cambio de versión.
- Detalle de requisición: Se actualiza el ID de orden o recurso KRB al asociar o asignar.
- Se cambia la etiqueta de `krb_resource_id` a "ID resource bank".
- Panel de ordenes: Se implementa la exportación CSV por medio de GET.
- Se agrega columna para `krb_resource_id` en páneles de Requisiciones y Ordenes, y en Visor de requisiciones.
- Requisiciones: Fix al preprocesamiento de `needs_review` que no leía los datos de revisión.
Requisiciones:
  - Cambio a mensajes más descriptivos al "Agregar a orden" y "Asignar recurso"
  - La habilitación de "Generar orden", "Agregar a orden" y "Asignar recurso" se sincroniza usando la expresión `status === 'AA' && !(order_id || krb_resource_id || needs_review)`.
  - Ajustes al código de Charly para cumplir reglas de ESLint.
- Requisiciones: Implementa aprobación de cambios.

### 2016-12-20
- Requisiciones: Deshabilita "Asignar a recurso de R Bank" si ya hay `order_id` o `krb_resource_id`.
- Ordenes: Ajustes al chat para trabajar con FF y fix menor a estilos.
- Pusher: Impide la escritura de errores de conexión en el LOG y el uso de XHR.
- Requisiciones: El menú "Asignar recurso de R Bank" solo impide asignar si `krb_resource_id` ya tiene valor.
- Se libera preview PDF para pruebas.
- Fix a build `production`.

### 2016-12-19
- Complementa URLs  para visitar KRB.
- Ordenes: Implementa vista previa a petición en comentarios.

### 2016-12-17
- Detalle de órdenes: Avance en "Asignar recurso de Resource Bank".

### 2016-12-16
- Ordenes: Soporte para emojis y para adjuntar archivo a comentarios.
- Filtros: Fix a filtro no memorizado, se reordena datos de Sesión.

### 2016-12-15
- Requisiciones: Separa la rutina `resetSelects` para permitir su reutilización.
- Editor de requisiciones (Autoría): El UUID del usuario se recibe como parte del url, precediendo al ID y separado por guión (opcional por ahora).
- Editor de requisiciones: Lee título desde `titleOriginal` si está disponlibe.
- Panel de requisiciones: Agrega columna ocultable 'ID requisición'.
- Detalle de requisiciones: Fix a opciones de menú no trabajando para usuarios de sólo-lectura.

### 2016-12-14
- Detalle de requisiciones: Se agrupa "Disponibilidad"
- Detalle de órdenes: Se regresan las "Características generales del recurso" a su lugar original.
- Editor de requisiciones: Tareas: Fix a status no actualizando etiqueta y a numeración de grupos.

### 2016-12-13
- Editor de requisiciones: Se oculta las Visibilidades de padre y coach de la UI, al server se envían como 1.
- Editor de órdenes: Refactorización parcial de tareas, elimina restricción startDate debido a bug.
- Editor de requisiciones: Quita la pestaña de Comentarios.
- Editor de requisiciones: Cambia el input de `related_to` a Tokenfield.
- Panel de órdenes: Cambia el campo de ordenación `requisitions` por `master_requisition_id`.
- Editor de requisiciones: Fix a bug no mostrando link al campo con error de propiedades comunes / Se usa el prefijo "ap_" para propiedades adicionales.
- Panel de órdenes: Ordenación por id de requisición / Muestra la requisición master siempre primera.
- Pusher (dependency) actualizado a v4.0.0
- Agregar `related_to` al formulario de requisiciones.
- Se separan los descriptores de propiedades comunes de órdenes/requisiciones en config.js

### 2016-12-12
- Editor de requisiciones: Se agrega info y link del ID de la orden.
- Detalle de órdenes/requisiciones: Workaround a inconsistencia de la API con el valor de propiedades tipo "radio".
- Editor de requisiciones: Fix a SELECTs de Tipo/Versión no filtrando las opciones cuando tienen valor inicial.
- Editor de ordenes: El botón "Publicar" mostraba "Publicado" en solo lectura sin importar el status, ahora se oculta si la orden está publicada.

### 2016-12-11
- Agregados colores a status en panel de asociación y en forms faltantes.
Editor de requisiciones, revisión 2:
  - Creada rutina genérica para la creación de propiedades comunes y adicionales, formato unificado.
  - Fix a propiedaes comunes no usando el tipo de control especificado para los Textarea.
  - Otros fixes menores al código y a los estilos.
- Historial de órdenes y requisiciones: Usando traducciones disponibles para algunos nombres de campo.
Editor de requisiciones, revisión 1:
  - Fix a checkbox no leyendo el valor inicial correcto.
  - Fix a modo de edición parcial permitiendo la edición del título.
  - Simplificación de la creación inicial de las propiedades adicionales.

### 2016-12-10
- Notificaciones: Simplificación.
- Fix "Al crear un nuevo recurso desde autoría no se están agregando al formulario las propiedades adicionales"
- Notificaciones: Agrega submenú para ocultar/mostrar/borrar las notificaciones leídas y se evitan doble clics.

### 2016-12-09
- Menos avisos por fallas de conexión (se elimina aviso CORS). Las notificaciones se actualizan al restablecerse la red.
- Detalle de ordenes: Mueve "Características generales del recurso" al sidebar, como "Disponibilidad".
- Detalle de requisiciones: Se agranda el menú punteado.
- Notificaciones: Se implementa la opción "Marcar todas como leídas".
- Detalle de ordenes: Se agrega "Visible para el padre" y "Visible para el coach".
- Se centraliza el preprocesamiento de datos de ordenes ubicando la master_requisition correcta.
- Editor de ordenes: Simplificación parcial del CSS.
- Fix a las tareas generando error durante el aguardado.
- Editor de requisiciones: Lápiz de edición se muestra solamente en pestañas editables.
- Ajuste al historial para mostrar los nuevos formatos de Tareas.

### 2016-12-08
- Editor de requisiciones: Fix a bug no actualizando areYouSure al regresar la versión a la leída originalmente.
- Editor de ordenes: Ajuste a los de eventos del editor de Tareas, también corrige bug del historial.
- Editor de requisiciones: Fix a creación desde Autoría no permitiendo editar las propiedades generales.
- Páneles: Ajuste a filtros para usar el endpoint `GET /dynamicCatalogs`.
- Ordenes: Actualizar historial después de un cambio en las tareas.
- Panales: Se incluye campo Fecha de modificación e ID de orden en requisiciones, se incluye hora en estas fechas.
- Requisiciones: Ajustes al diálogo "Agregar requisición a orden existente" para usar nombres anidados.
- Ordenes: Cambia el título de "Prioridad" a "Prioritario" y se sustituye el icono warning por otro.
- Detalle de requisiciones: El texto del menú "Información extra" cambia a "Ver en autoría".
- Requisiciones: Cuando tiene estatus de producción (PP PO o PK) solamente se permite editar la versión y las propiedades adicionales.
- Fix al diálogo de error de formato de catálogos no mostrado y a la página de errores no desplegando el error.
- Editor de requisiciones: `production` es requerido con "Knotion" como default.
- Editor de requisiciones: Fix al bug de habilitación de opciones de menú - Agregado order_id solo para entorno DEV.

### 2016-12-07
- Editor de requisiciones (Autoría): Se lee el step desde `activity.steps` a partir de `resource.idStep`.
- Editor/Detalle de requisiciones: Se agrega el campo `production` como un SELECT.
- Editor de requisiciones: Se alinean etiquetas de campo a la derecha, fix a estilo en negritas.
- Editor de requisiciones: Refactorización de la lógica para habilitar botón status y menús.
- Editor de requisiciones: Primera ajuste de campos con tipo personalizado.
- Ordenes: Ajuste en la lectura de campos que originalmente venían en la raiz.
- Detalle de requisiciones: Generar/Asociar orden se habilita únicamente si el status es "Aproved" (AA).

### 2016-12-06
- Requisiciones: Ajuste a la edición del Estatus y sus efectos.
- Requisiciones: Regresión `requested_by` a `requested_by_str`.
- Requisiciones: Correcciones a los tipos de campos para propiedades adicioneles.
- Requisiciones: Se implementa el campo `requisition_type` con mini-catálogo y fix a guardado.
- Filtro órdenes/Requisiciones: Preparación para endpoint.
- Panel de requisiciones: Reimplementación del filtro de fechas.
- Detalle de órdenes: Correcciones al preview iPad.

### 2016-12-05
- Editor de órdenes: Se agregan campos de propiedades editables.
- Panel de órdenes: Se agrega el campo "Priority" como icono warning.
- Editor de requisición: Agrega campos `visible_for_parent`, `visible_for_coach`, `minimum_age` y `maximum_age`.
- Detalle de orden: Se despliega el ID de la orden encima del título.
- Se simplifican alguinas rutinas de inicialización de tablas.

### 2016-12-03
- Panel de órdenes: Publicación múltiple en espera de datos requeridos.

### 2016-12-02
- Se reemplaza el uso de `order_key` por `order_id`.
- Visor de órdenes: Implementa vista previa en Skin con dimensiones de iPAD.

### 2016-12-01
- Se leen campos adicionales en Creación de requisiciones desde Autoría, el texto HTML de preprocesa.
- Clic en notificación marca la notificación como leída además de abrir su enlace.
- Notificaciones leídas/borradas ahora se sincronizan entre múltiples pestañas y navegadores.
- Detalle/Editor de requisiciones: Se agregan datos básicos de contexto.
- Se completa el módulo de notificaciones, en espera para operar con notificaciones Push.

### 2016-11-30
- Notificaciones: Avances a la recepción y el dropdown de notificaciones.
- Login: Se emiten eventos "user:login" y "user:logout" de App al iniciar/cerrar sesión de usuario.
- Filtros: Los SELECTs integran mini-botón que se muestra cuando hay contenido y permite borrarlo.

### 2016-11-29
- Fix a 'Cuando una requisición ya está asociada a una orden el link de "asociar con orden de producción" debe estar deshabilitado'.
- Fix al selector de columnas de las tablas no deshabilitando las columnas no moviles.
- Páneles: Ajustes en los filtros para mostrar selección múltiple semi-independiente.
- Detalle de requisiciones: Implementa el diálogo "Asociar a una orden de producción existente".
- Refactorización de filtros como clase, fechas se manejan por rango, se aceptan múltiples solicitantes.

### 2016-11-28
- Requisiciones:
  Después de cambiar el estatus a completado no es necesario recargar la página para que se habilite la opción "Generar órden de producción".
  El formulario de Autoría siempre muestra habilitado el botón de "Guardar".

### 2016-11-25
- Se agrega "Ya puedes cerrar esta pestaña" al `bye-auth.pug`.
- Ajustes al Editor de requisiciones:
  Visible para el estudiante marcado por defecto.
  Se omite `created_at` y `requested_by_str` en el envío (el Solicitante nunca es editable).
  El status es 'RR' y de solo lectura en nueva requisición.
- Se integra Pusher v3.x al setup, por medio de npm.
- Permisos en `user_capabilities` implementados con objeto en lugar de array.
- Revisión y limpieza del módulo `user`.
- Editor de requisiciones: Implementación de permisos de usuario.
- Dashboard: Se elimina el botón "Limpiar archivos huérfanos".
- Ajuste al despliegue del historial, incluye el nuevo nombre `delivery` para Entregas.

### 2016-11-23
- Editor de órdenes: Mejora de estilo al uploader de entregables, se verifica archivo duplicado.
- Editor de requisiciones: Página sin marco para Autoría.
- Fix a helpers `-flex()` y al CSS de Dropzone en la subida de entregables.

### 2016-11-22
- Detalle de órdenes/requisiciones: El historial se agrupa por número de versión.
- Se reemplazan los `status` hardcode por los catálogos correspondientes para órdenes, tareas, y requisiciones.
- Detalle/Editor de requisiciones: Se muestra el ID del recurso debajo del título (en lugar del ID de orden).
- Mensajes de error en editores se amplía para aceptar un array de mensajes con clic hacia los campos erróneros con soporte de campos múltiples.
- Editor de requisiciones: Cambio a lógica simple para Guardar: se habilita botón al primer cambio y los errores se muestran al guardar.

### 2016-11-21
- Editor de requisiciones: Requeridos `resource_title`, `resource_version`, `knotions_bank_description` y `resource_tags`.
  Requiciones completadas no son editables.
- Detalle de requisición: Con estatus "COMPLETED" la requisición ya no es editable.
- Fix al botón "Guardar" ocultando el cierre de alerta de errores del form.
- Editor de órdenes: `knotions_bank_description` se hace editable.
  Corrección al CSS y el corpontamiento de la alerta de errores de edición.
- Detalle de requisiciones: Mientras el estatus no sea "COMPLETED" se puede crear una orden.
- Correcciones a columnas de Panel de órdenes y requiciones.

### 2016-11-18
- Ajustes al Detalle de requisición según tarjeta (básicamente al menú punteado)
- Crear orden trabajando.

### 2016-11-17
- Detalle de requisición: Ajustes al CSS, la apertura del form de edición es mucho más fluida.
- Detalle de requisición: Implementado el historial.
- Fix al Editor y Visor de requisiciones no mostrando el valor correcto de "Visible para el alumno".
- Editor de requisición: Se envía `apikey` en el queryString de la llamada al endpoint de Autoría.
- Fix a Editor de requisición no enviando el flag `change_resource_version` al endpoint.

### 2016-11-16
- Editor de requisiciones: Fix a estilo de las LABELs y corrección al lanzar el diálogo de cambio de versión.
- Fix al orden de tabulación del Editor de requisiciones.
- Detalle de requisición implementa eliminación.
- Panel de órdenes: Soporte para múltiple `resource_id` contenidos en `requisitions[]`.
- Editor de requisiciones: Usando el endpoint de Autoría.
- Detalle de orden: Se habilita "Editar" para tareas.
- Editor y Detalle de requisiciones:
  Revisión al CSS
  Se cambian H5 por LABELs.
  Los encabezados ahora muestran líneas punteadas.
- Editor de requisiciones:
  Corrección al orden de tabulación de los campos.
  Usando tokenfield para Keywords.
  Usando las propiedades adicionales correctas (requisition_properties)
- Panel de requisiciones: agregado `requisition_ids`

### 2016-11-15
- Se usa descriptor de campos para propiedades comunes de órdenes y requisiciones.
- El form de creación y edición de requisiciones usa endpoint para obtener propiedades adicionales.
- La creación de requisiciones extra-reto usa un popup para seleccionar grupo/tipo/versión.
- Form genérico de creación y edición de requisiciones.
- Se unifica el CSS para los forms de requisiciones y ordenes.

### 2016-11-14
- Visor de contexto req: Se actualiza slidePanel, reducción de código en su carga.
- Detalle de req: Se agrega funcionalidad del botón para abrir contexto.

### 2016-11-12

- Detalle de orden (Entregas): Fix al url que impedía subir archivos y corrección a los comentarios.
- Detalle de orden (Entregas): Se acortan los nombres de archivo en los previews.
- Detalle de req: Primera versión con el endpoint funcionando.

### 2016-11-11

*(El historial de días anteriores se omitió por falta de tiempo)*

- La librería "observable" no permite lanzar más de 1 evento con `on()`, el parámetro con el nombre de evento se elimina de la llamada al handler, excepto para el evento "*" (usado principalmente para depuración).
- Panel de requisiones: Se agregan la mayor parte de los campos recibidos a las columnas de la tabla.

### 2016-11-07
- Se renombran los templates para `include` con guión bajo para que no se incluyan por duplicado.
- Se envía el header "X-tzo" (timeZoneOffset) como parte de los encabezados HTTP en Ajax.
- Se reestructura la biblioteca de fechas `scripts/lib/dates.js`
- Usando `setImmediate` en lugar de `setTimeout`

### 2016-11-05
- App: Se completan los 10 puntos de la tarjeta "Ajustes".
- Detalle de orden: Validación de fecha en blanco.
- Panel de órdenes: Ajuste a los campos ordenables.

### 2016-11-04
- Detalle de orden:
  Implementa endpoint de guardado `PUT /order/{order}` con cambio al vuelo del modo de edición.
  Ajuste al CSS y el orden de los campos.
- Panel de órdenes:
  Ajuste de los campos para que coincidan con la ordenación de la API.
  Diseño del controlador de Filtro.

### 2016-11-01
- Detalle de orden: Regresión de edición en línea, se empleará edición completa.
- Panel de órdenes: Implementación de campos de Autoría.
- Panel de órdenes: Fix a CSS.
- App: Fix a bug en la estructura del marco de página.

### 2016-10-31
- Panel de órdenes: Implementación parcial de `GET /orders`.
- Se reactiva `App.server` y se implementa `GET /catalogs`.
- Source maps para Pug.

### 2016-10-30
- Ajustes al setup. Se actualizan dependencias, se elimina blueimp-fileupload y pug-runtime, se usan Dropzone y PubSubJS.

### 2016-10-26
- Detalle de orden: Finalizada maqueta de Tareas.
- Detalle de orden: Aplica formato de fecha-hora especial al Historial (`longDateTimeDMY`).
- Detalle de orden: Avance en maquetación del Historial.

### 2016-10-25
- Se integra [PubSub](https://github.com/mroderick/PubSubJS) en la app, como `App.pubSub`.
- Panel de órdenes: Ajuste a las columnas.
- Detalle de orden: Avance en maquetación de la pestaña Detalles.

### 2016-10-24
- Reimplementación de `App.store`, ver comentarios en `scripts/services/app-store.js`.

### 2016-10-21
- Fix a estilos en el marco de la página.
- Fix al logout no respondiendo.
- Se integra generador Remark en `./_remark`, las carpetas `._remark/fonts` y `._remark/vendor` no se incluyen.

### 2016-10-20
- Avance de maqueta para Generar Orden (Eduardo).
- Implementado login con el endpoint kprod y completada info en barra superior.
- Ajustes provisionales para trabajar sin endpoints, excepto para login.
- Ajustes a observable.js para simplificación de su API.

### 2016-10-19
- Implementado App.store, un objeto [observable](http://en.wikipedia.org/wiki/Observer_pattern) para dar servicio a los forms, principalmente.
- Se elimina la propiedad `title` de routes.routes (en routes.js), ahora se usa `routes.menu.title`.
- Páginas con fondo blanco, ajuste de estilos principalmente en márgenes.
- Maqueta del panel de órdenes de producción.

### 2016-10-18
- Se agrega versión simplificada de Alertify (easyAlert).
- Se agrega login usando el endpoint de Digono.
- Creado marco principal usando templates Pug.
- Commit inicial del repositorio.
