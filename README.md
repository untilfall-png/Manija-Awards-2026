# Manija Awards 2026

Sistema oficial de votación para los premios Manija Awards 2026, construido con Next.js, TypeScript, Tailwind CSS y Firebase.

## 🚀 Características

- ✅ Sistema de votación en tiempo real
- ✅ Resultados live con actualización automática
- ✅ Interfaz moderna y responsiva
- ✅ Prevención de votos duplicados
- ✅ Validación de formularios
- ✅ Animaciones con Framer Motion
- ✅ Diseño con tema oscuro

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Backend**: Firebase Firestore
- **Icons**: Lucide React

## 📋 Prerrequisitos

- Node.js 18+
- npm o yarn
- Proyecto de Firebase configurado

## 🔧 Instalación

1. **Clona el repositorio**
   ```bash
   git clone <repository-url>
   cd manija-awards-2026
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura Firebase**
   - Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
   - Habilita Firestore Database
   - Copia `.env.example` a `.env.local`
   - Completa las variables de entorno con tus credenciales de Firebase

4. **Ejecuta el proyecto**
   ```bash
   npm run dev
   ```

5. **Abre en el navegador**
   ```
   http://localhost:3000
   ```

## 🔥 Configuración de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita Firestore Database
4. Ve a Configuración del proyecto > Configuración general
5. Copia las credenciales de configuración
6. Pégalas en `.env.local`

## 📊 Estructura del Proyecto

```
manija-awards-2026/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Hero.tsx
│   ├── Categories.tsx
│   ├── Winners.tsx
│   ├── Gallery.tsx
│   ├── Voting.tsx
│   ├── LiveResults.tsx
│   └── Sponsors.tsx
├── lib/
│   └── firebase.ts
├── .env.example
└── package.json
```

## 🎯 Funcionalidades

### Sistema de Votación
- 14 categorías de premios
- Validación de al menos 10 votos por usuario
- Prevención de votos duplicados con localStorage
- Envío en tiempo real a Firebase

### Resultados en Vivo
- Actualización automática con Firebase listeners
- Visualización de barras de progreso
- Conteo total de votos
- Ranking en tiempo real

### Interfaz de Usuario
- Diseño responsivo
- Animaciones suaves
- Tema oscuro con acentos en rosa y púrpura
- Componentes interactivos

## 🚀 Despliegue

### Render
1. Crea una cuenta en https://render.com y conecta tu repositorio GitHub.
2. Crea un nuevo servicio web y selecciona la rama `main`.
3. Usa estos comandos:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. Agrega las variables de entorno de Firebase en Render:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
5. Despliega y espera a que el servicio quede activo.

También puedes usar el archivo `render.yaml` incluido en el repo para crear el servicio desde la interfaz de Render o con su CLI.

### Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Agrega las variables de entorno de Firebase
3. Despliega automáticamente

### Otros proveedores
- Asegúrate de configurar las variables de entorno
- El proyecto está optimizado para despliegue estático

## 📝 Notas de Desarrollo

- Los votos se almacenan en la colección `votos` de Firestore
- Se usa localStorage para prevenir votos duplicados
- El diseño está optimizado para móviles
- Las animaciones mejoran la experiencia de usuario

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🎉 ¡Disfruta los Manija Awards 2026!

La noche es nuestra. 🔥