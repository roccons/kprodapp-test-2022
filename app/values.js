const _KB = 1000

module.exports = {
  _USER: {
    SUPERADMIN: 4,
    ADMIN: 3,
    EDITOR: 2,
    READONLY: 1,
    NONE: 0
  },
  _DLG: {
    OK: 1,
    YES: 2,
    NO: 3,
    CANCEL: 4,
    IGNORE: 5,
    ABORT: 6,
    CLOSE: 7
  },
  _REQ_ST: {
    PENDING: "'EE'",
    APPROVED: "'AA'",
    READY: "'RR'",
    CANCELED: "'CA'",
    COMPLETED: "'CC'"
  },
  _ORDER_ST: {
    TODO: "'TD'",
    DOING: "'IP'",
    DONE: "'DD'",
    READY: "'RP'",
    PUBLISHED: "'PP'",
    CANCELED: "'CA'"
  },
  _TASK_ST: {
    DEFAULT: "'TD'",
    TODO: "'TD'",
    READY: "'RR'",
    REJECTED: "'RJ'",
    DONE: "'DD'"
  },
  _DELIVERY_ST: {
    TODO: "'TD'",
    READY: "'RR'",
    REJECTED: "'RJ'",
    VALID: "'DD'",
    DONE: "'DD'"
  },
  // order.card_substatus
  _SS: {
    WAITING: 0,       // En espera
    PROGRESS: 1,      // En progreso
    WAITING_FIX: 2,   // En espera + Correcciones
    PROGRESS_FIX: 3,  // En progreso + Correcciones
    PROGRESS_MASK: 1, // Para saber si está en progreso sin importar "Correciones"
    FIX_MASK: 6,      // Para saber si tiene "Correcciones"
  },
  _KB: _KB,
  _MB: _KB * _KB,
}
