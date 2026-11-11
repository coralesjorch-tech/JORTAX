# JORTAX – prototipo Android/iOS

## Generar un APK instalable en Android (requiere cuenta Expo/EAS)

La compilación APK se realiza en los servidores de Expo EAS; no se genera solo copiando el proyecto al teléfono.

1. Instala Node.js LTS en una computadora.
2. Descomprime este ZIP y abre una terminal dentro de la carpeta `jortax-mvp`.
3. Ejecuta:
   ```bash
   npm install
   npx eas-cli login
   npx eas-cli build:configure
   npx eas-cli build --platform android --profile preview
   ```
4. Si EAS pregunta si deseas crear el proyecto, confirma.
5. Espera a que termine la compilación en la nube. EAS mostrará un enlace para descargar el archivo `.apk`.
6. Abre ese enlace desde tu Samsung y permite instalar aplicaciones desde esa fuente si Android lo solicita.

## Probar durante el desarrollo

```bash
npm install
npx expo start
```
Escanea el QR con Expo Go.

## Qué incluye este prototipo

- Selector Pasajero / Conductor.
- Selector Auto / Mototaxi.
- Métodos de pago de demostración: efectivo, Yape y Plin.
- Cálculo referencial con distancia ingresada manualmente.
- Interruptor de disponibilidad de conductor (solo interfaz local).
- Identidad visual negro, dorado y blanco.

## Limitaciones importantes

Este prototipo todavía NO es un servicio de taxi operativo. No incluye autenticación real, backend, GPS/rutas conectadas, solicitudes entre teléfonos, notificaciones, pagos integrados, verificación de conductores ni panel administrativo. Los importes de `App.tsx` son valores DEMO y deben reemplazarse por tarifas aprobadas por JORTAX antes de publicar. La compilación del APK empaqueta el prototipo, no añade automáticamente esas funciones.
