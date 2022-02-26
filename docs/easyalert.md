# easyAlert

Simple, lightweight, and fast.

(In this project, easyAlert lives in `App.ui`)

## Example:

```js
const dlg = require('easyalert')

dlg.yesNo('Are you sure?', (btnId) => {
  console.log(btnId === dlg.YES ? 'Yes' : 'No')
})
```

## API

### `dialog(message [, options][, callback])`

the base for all the dialogs

### `alert(message [, options][, callback])`

"OK" button

### `confirm(message [, options][, callback])`

"OK"/"Cancel" buttons

### `yesNo(message [, options][, callback])`

"Yes"/"No"

### `yesNoCanc(message [, options][, callback])`

"Yes"/"No"/"Cancel"

### `prompt(message , caption, value [, callback])`

"OK"/"Cancel" dialog with an input box.

## The `options` object

This is a plain JavaScript object that holds dialog information.

`options` can have an object that defines an input field.

```js
{
  buttons: [easyAlert.OK]   // button identifiers
  input: {
    type: 'text',           // 'text', 'number', 'checkbox', etc.
    id: 0,                  // button id (a number)
    classes: '',            // classes to add
    value: '',              // value of the control
    checked: false,         // for radio/check boxes
    prompt: '',             // placeholder
  },
  closeOnEsc: false         // if true, the dialog remains on esc
}
```

The callback receives a parameter: The id of the clicked button.
If the callback returns `false`, the alert is not closed.

## User defined dialogs

Pass to `dialog` an object instead an ID in your button list:

```js
const dlg = require('easyalert')

dlg.dialog('Go to home?', { buttons: [dlg.NO, { id: 9, caption: 'Go!' }] },
  (btn) => {
    if (btn === 9) goHome()
  })
```

## Button IDs

Name   | ID | Caption
------ | -- | -------
OK     |  1 | Aceptar
YES    |  2 | Sí
NO     |  3 | No
CANCEL |  4 | Cancelar
IGNORE |  5 | Ignorar
ABORT  |  6 | Anular

The `OK` and `YES` buttons uses the primary color.
