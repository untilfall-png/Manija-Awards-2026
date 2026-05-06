# 🔧 Verificación Rápida - Firebase Rules

## El Problema
El error `permission-denied` indica que Firestore está rechazando las operaciones
porque las reglas de seguridad no lo permiten.

## Diagnóstico
1. Las reglas locales en `firestore.rules` están correctas (allow read, write: if true)
2. Pero las reglas PUBLICADAS en Firebase Console son diferentes/restrictivas
3. Render usa Firebase real, no el emulador

## Solución Rápida (30 segundos)

### Paso 1: Abrir Firebase Console
- Ir a: https://console.firebase.google.com/
- Seleccionar proyecto: **manija-awards-2026**

### Paso 2: Navegar a Firestore Rules
- Menú izquierdo → Firestore Database
- Pestaña: **Rules** (Reglas)

### Paso 3: Reemplazar reglas
Copiar y pegar esto:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Paso 4: Publicar
- Clic en botón **Publish** (Publicar)
- Esperar 1-2 minutos

### Paso 5: Probar
- Volver a Render
- Recargar la app
- Intentar guardar/eliminar categoría

## Solución Definitiva (Segura)

Para producción, en lugar de `if true`, usar:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Votantes pueden registrarse
    match /voters/{voterId} {
      allow create: if true;
      allow read, write: if request.auth != null;
    }
    
    // Votos son públicos
    match /votes/{voteId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Categorías - admin puede modificar
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Config del sistema
    match /system_config/{config} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Pero para la demo actual, las reglas abiertas (`if true`) son suficientes.

## Verificar que es un problema de reglas

Si después de publicar las reglas sigue fallando:

1. Revisar que el proyecto Firebase en Render sea el mismo que en Console
2. Verificar credenciales en Render → Environment Variables
3. Revisar consola de Firebase → Analytics para ver si hay tráfico

## Nota

Las reglas locales (`firestore.rules`) NO se publican automáticamente.
Deben publicarse manualmente en Firebase Console o via Firebase CLI.
