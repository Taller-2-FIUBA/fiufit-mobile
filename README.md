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

### Google login
In order to use the Google login, you will need to run the app on an emulator
using the following command:
```
npx expo run:android
```

### Testing with jest
In order to test the app with jest, run the following command on your terminal:
```
npm run test
```
This will run all the tests in the app and provide you with a coverage report.

If you want to add more tests keep in mind that the tests file should be named
`<name>.test.js`.

### Building an apk
In order to build an apk, you first need to set up the environment variables in
the eas.json file. Then, run the following command on your terminal:
```
eas build -p android --profile production
```
The --profile flag can be changed according to your eas.json configuration.
Please refer to the expo documentation for more information.
