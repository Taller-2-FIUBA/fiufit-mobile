# FiuFit-mobile
Mobile app for users.

### Testing  with expo
Please refer to this [expo documentation](https://docs.expo.dev/get-started/installation/)
for information about installation on your system.

In order to test the app with expo, you need to install the [expo go](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=es_MX&gl=US&pli=1) 
app on your phone or emulator. The app is also available on iOS.

Then, run the following command on your terminal:
```
npx expo start
```
This will start the expo server and provide you with a QR code. Scan the QR code
with expo go and the app will be loaded on your phone.

If you are running the expo go app on an emulator, you won't be able to scan the
QR code. Instead, you will need to enter manually the provided URL in the expo go
app.

You can now make changes to the code and after saving, the app will be reloaded
automatically on your phone.

### Testing with jest
In order to test the app with jest, run the following command on your terminal:
```
npm run test
```
This will run all the tests in the app and provide you with a coverage report.

If you want to add more tests keep in mind that the tests file should be named
`<name>.test.js`.

# Components
## FiufitDialog
Dialog component that can be used to display information to the user. It can 
be used with one confirm button in order to dismiss the dialog or with two 
buttons, one to confirm and one to cancel. Each button's behavior can be 
customized by passing a function as a prop.

### Props
* **visible**: boolean that indicates if the dialog should be displayed or not.
* **title**: string that will be displayed as the dialog's title.
* **content**: string that will be displayed as the dialog's content.
* **isOk**: boolean that indicates if the dialog should have one or two buttons.
* **onDismiss**: function that will be called when the dialog is dismissed.
* **handleConfirm**: function that will be called when the confirm button is pressed.
* **handleCancel**: function that will be called when the cancel button is pressed.
* **handleOk**: function that will be called when the confirm button is pressed and the
isOk prop is set to true.
