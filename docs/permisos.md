

## Órdenes de Producción

Toda la edición se bloquea cuando el status de la orden es PUBLISHED, aunque se permite la visualización de los elementos en modo de solo lectura.

El status "Ready to Publish" es considerado equivalente a PUBLISHED, excepto para la pestaña "Publicación" que permite su edición.

### OP -> General

Descripción | Permisos | Notas
----------- | -------- | -----
Editar detalles | edit | Incluye campos editables del panel derecho.
Cambiar thumbnail | delivery-add

### OP -> Tareas

El icono de la acción no se muestra si el usuario no tiene permiso para abrir.

La reordenación y desactivación se consideran ediciones y son bloqueadas por PUBLISHED.

Los comentarios de las tareas y las entregas no son edición por lo que se pueden agregar aun si el status es PUBLISHED.


Descripción | Permisos | Notas
----------- | -------- | -----
Reordenar tareas | task-manage
Agregar tarea    | task-manage
Editar tarea     | task-manage
Agregar comentarios | comment-add | Todos pueden abrir y ver los comentarios
Abrir el sidebar del creativo | task-status | PUBLISHED no se permite edición aunque la tarea no esté completada
Abrir el sidebar del tester   | delivery-approve | PUBLISHED no se permite edición aunque la tarea no esté revisada
Anular tarea                  | task-status, task-manage | Solo la última tarea y si su status es TODO
Marcar recurso como final     | delivery-approve
Activar/Desactivar tarea      | task-manage
Ver tareas desactivadas       | task-manage
