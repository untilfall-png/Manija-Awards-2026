# 🏆 Manija Awards 2026 - Sistema de Votación Completo

Sistema profesional de votación en tiempo real con administración, diseño Neon Max Pro y persistencia en Firebase.

## 🎯 Características Principales

### 👥 Registro y Votación
- **Registro Simple**: Nombre, email y teléfono (solo datos básicos)
- **Votación Secuencial**: Una categoría a la vez para mejor UX
- **Control de Duplicados**: Un voto por categoría, por votante
- **Sesión Persistente**: LocalStorage con opción de cerrar sesión
- **Validación Completa**: Verificación de datos en cliente y servidor

### 🛡️ Módulo Administrador
**Acceso**: http://localhost:3007/admin
**Contraseña**: ManijAdmin2026 (configurable en `NEXT_PUBLIC_ADMIN_PASSWORD`)

#### Funcionalidades:
- ✅ **Panel de Control**: Estadísticas en tiempo real
  - Votantes registrados
  - Total de votos
  - Categorías activas
  - Tasa de participación

- ✅ **Gestión de Categorías**
  - Crear nuevas categorías
  - Editar categorías existentes
  - Eliminar categorías
  - Agregar/editar/eliminar nominados por categoría
  - Orden personalizado de categorías
  - Persistencia en Firebase Firestore

- ✅ **Resultados Detallados**
  - Vista completa de todos los votos
  - Transparencia: votante, email, categoría, nominado elegido
  - Filtros por categoría y votante
  - Descarga CSV de resultados
  - Estadísticas por filtro

- ✅ **Lista de Votantes**
  - Todos los votantes registrados
  - Información de contacto
  - Fecha de registro
  - Búsqueda por nombre/email
  - Estadísticas de completitud

- ✅ **Gráficos Dinámicos**
  - Barras animadas por categoría
  - Porcentajes en tiempo real
  - Resumen general de participación
  - Visualización de líder por categoría

### 🎨 Diseño Neon Max Pro
- Paleta de colores: Pink (#ff2edf), Purple (#7c3aed), Orange (#ff6a00), Cyan (#00ffff)
- Efectos de brillo (neon) en textos y elementos
- Glassmorphism cards
- Animaciones suaves con Framer Motion
- Tema oscuro premium
- Responsive design (móvil, tablet, desktop)

### 🏅 Diplomas Digitales
- Diplomas automáticos para ganadores de cada categoría
- Estilo basado en Font.jpeg (imagen de referencia neon)
- Mostrados en la sección de resultados
- Mensaje personalizado de felicitación
- Información del votante y votos obtenidos

### 📊 Resultados en Vivo
- Actualizaciones en tiempo real con Firestore listeners
- Resultados organizados por categoría
- Ganador destacado con troféo
- Porcentajes calculados automáticamente
- Gráficos de barras animadas

## 🏗️ Arquitectura Técnica

### Frontend
- **Framework**: Next.js 14.0.0 (App Router)
- **Lenguaje**: TypeScript 5.1.6
- **Estilos**: Tailwind CSS 3.3.0
- **Animaciones**: Framer Motion 10.16.0
- **Iconos**: Lucide React
- **UI Components**: Personalizados con neon styling

### Backend
- **Base de Datos**: Firebase Firestore
- **Autenticación**: Admin con contraseña (simple)
- **Persistencia**: Todos los datos en la nube
- **Reglas de Seguridad**: Configuradas en `firestore.rules`

### Colecciones Firestore

#### `voters`
```typescript
{
  id: string
  name: string
  email: string
  phone?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

#### `votes`
```typescript
{
  id: string
  voterId: string
  categoryId: string
  nomineeId: string
  createdAt: Timestamp
}
```

#### `categories`
```typescript
{
  id: string
  name: string
  description: string
  order: number
  nominees: Array<{
    id: string
    name: string
    description?: string
    imageUrl?: string
  }>
}
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Firebase project configurado

### Pasos

1. **Clonar repositorio**
```bash
git clone https://github.com/untilfall-png/Manija-Awards-2026.git
cd "Manija Awards 2026"
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar Firebase**
Crear archivo `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

NEXT_PUBLIC_ADMIN_PASSWORD=ManijAdmin2026
```

4. **Desarrollo local**
```bash
npm run dev
```
Acceder a:
- Votación: http://localhost:3000
- Admin: http://localhost:3000/admin

5. **Build producción**
```bash
npm run build
npm run start
```

## 📱 Flujo de Usuario

### Votante Regular
1. Ingresa a la app
2. Se registra con nombre, email y teléfono (opcional)
3. Ve la sección hero con información
4. Navega secuencialmente por categorías
5. Selecciona nominado y confirma voto
6. Recibe confirmación (marca verde, "Ya votaste en esta categoría")
7. Avanza a siguiente categoría
8. Cuando termina, ve "VOTACIÓN COMPLETADA"
9. Puede ver resultados en vivo en la misma página
10. Ve diplomas de ganadores al final

### Administrador
1. Accede a http://localhost:3000/admin
2. Ingresa contraseña (ManijAdmin2026)
3. Puede:
   - **Panel**: Ver estadísticas en tiempo real
   - **Categorías**: Crear/editar/eliminar categorías y nominados
   - **Resultados**: Ver todos los votos con transparencia completa
   - **Votantes**: Listar todos los participantes
   - **Gráficos**: Ver visualizaciones dinámicas de datos

## 🔐 Seguridad

### Configuración de la Contraseña Admin

**Ubicación del archivo de configuración:**
- `.env.local` (local development)
- `.env` (production environment variables)

**Contraseña por defecto:**
```
NEXT_PUBLIC_ADMIN_PASSWORD=ManijAdmin2026
```

⚠️ **IMPORTANTE - Cambiar la contraseña en producción:**

1. **Paso 1: Generar nueva contraseña segura**
   - Usar un password manager o generador
   - Mínimo 12 caracteres
   - Incluir mayúsculas, minúsculas, números y símbolos

2. **Paso 2: Actualizar .env.local / .env**
   ```
   NEXT_PUBLIC_ADMIN_PASSWORD=tu_nueva_contraseña_segura
   ```

3. **Paso 3: Documentar la nueva contraseña**
   - Guardar en un password manager seguro
   - NO guardar en el repositorio
   - Compartir solo con administradores autorizados

4. **Paso 4: Verificar en Panel Admin**
   - Acceder a `/admin`
   - Probar la nueva contraseña
   - Confirmar acceso exitoso

### Firestore Rules
- Lectura pública de votos (para resultados en vivo)
- Votantes solo lectura por su ID
- Creación de votantes sin autenticación
- Creación de votos solo para usuarios registrados
- Prevención de doble votación por categoría (validación en BD)
- Categorías: solo lectura pública, escritura restringida

### Mejoras de Seguridad Implementadas
- ✅ Validación de datos undefined para prevenir errores Firebase
- ✅ Teléfono opcional (no se guarda undefined)
- ✅ Variables de entorno documentadas en .env.example
- ✅ LocalStorage para tokens con renovación

## 📊 Estructura de Archivos

```
├── app/
│   ├── layout.tsx
│   ├── page.tsx (home - votación)
│   ├── globals.css
│   └── admin/
│       ├── layout.tsx
│       └── page.tsx
├── components/
│   ├── Hero.tsx
│   ├── Login.tsx
│   ├── Voting.tsx
│   ├── LiveResults.tsx
│   ├── AdminDashboard.tsx
│   ├── AdminLogin.tsx
│   ├── AdminCategories.tsx
│   ├── AdminResults.tsx
│   ├── AdminVoters.tsx
│   └── AdminCharts.tsx
├── lib/
│   ├── firebase.ts
│   ├── types.ts
│   └── voting.ts
└── firestore.rules
```

## 🎨 Paleta de Colores Neon

- **Pink**: #ff2edf (Principal)
- **Purple**: #7c3aed (Secundario)
- **Orange**: #ff6a00 (Acento)
- **Cyan**: #00ffff (Información)
- **Green**: #22c55e (Éxito)
- **Red**: #ef4444 (Error)

## 📈 Métricas y Analytics

El sistema recopila:
- Nombres de votantes
- Emails
- Teléfonos
- Votos por categoría
- Timestamps de cada voto
- Orden cronológico

Todo accesible a través del panel admin con filtros y descarga CSV.

## 🐛 Troubleshooting

### Error: "Categories not loading"
- Verificar Firebase connection en `.env.local`
- Revisar Firestore rules
- Crear colección `categories` en Firestore si está vacía

### Error: "Admin login fails"
- Verificar contraseña en `NEXT_PUBLIC_ADMIN_PASSWORD`
- Limpiar localStorage (admin_token)
- Token se guarda en base64 con timestamp

### Votos no se guardan
- Revisar conexión a Firebase
- Verificar rules permiten crear votes
- Comprobar que voterId existe en voters

## 🚢 Deployment

### Render.com
1. Conectar repo GitHub
2. Configurar variables de entorno (Firebase + Admin password)
3. Build command: `npm run build`
4. Start command: `npm run start`
5. Node version: 18+

### Vercel
1. Conectar repo
2. Configurar env vars
3. Deploy automático en push a main

## 📝 Notas Importantes

- La sección de Patrocinadores fue eliminada como se solicitó
- Los diplomas digitales se muestran automáticamente para ganadores
- Las categorías se cargan dinámicamente desde Firestore
- Admin puede modificar categorías en vivo, afectando votación activa
- Todos los datos persisten en Firebase
- Sistema está optimizado para producción

## 🎯 Próximos Pasos

- [ ] Mejorar autenticación admin (OAuth)
- [ ] Agregar más gráficos (pie charts, etc)
- [ ] Sistema de notificaciones por email
- [ ] Exportar resultados a PDF
- [ ] Agregar imágenes a nominados
- [ ] Dashboard analytics avanzado
- [ ] Auditoría de cambios admin

## 📞 Soporte

Para preguntas o problemas, revisar los logs en:
- Console del navegador (F12)
- Firebase Console
- Build logs en terminal

---

**Manija Awards 2026** - Sistema Premium de Votación en Tiempo Real 🎉
