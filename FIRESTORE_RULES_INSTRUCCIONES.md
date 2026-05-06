# 🔐 Firestore Rules - Instrucciones de Configuración

## Problema
Error: `permission-denied` al guardar/eliminar categorías
Código: `permission-denied`

## Causa
Las reglas de Firestore publicadas en Firebase Console no coinciden con las reglas locales.
Las reglas locales permiten todo, pero las publicadas están más restrictivas.

## Solución

### Opción 1: Actualizar reglas en Firebase Console (Recomendado)

1. Ir a [Firebase Console](https://console.firebase.google.com/)
2. Seleccionar proyecto: `manija-awards-2026`
3. Ir a **Firestore Database** → **Rules**
4. Reemplazar con estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Voters - permitir todo para votación abierta
    match /voters/{voterId} {
      allow create: if true;
      allow read, write: if true;
    }

    // Votes - permitir todo
    match /votes/{voteId} {
      allow read, write: if true;
    }

    // Categories - permitir todo para admin
    match /categories/{categoryId} {
      allow read, write: if true;
    }

    // System config - permitir lectura/escritura
    match /system_config/{config} {
      allow read, write: if true;
    }
  }
}
```

5. Clic en **Publish**

### Opción 2: Usar Firebase CLI para publicar reglas

```bash
# Instalar Firebase CLI si no está instalado
npm install -g firebase-tools

# Login
firebase login

# Inicializar en el proyecto (si no está)
firebase init firestore

# Publicar reglas
firebase deploy --only firestore:rules
```

### Opción 3: Desde la app (temporal para pruebas)

Si es solo para desarrollo/pruebas, las reglas actuales ya deberían funcionar.
Verificar que el proyecto Firebase en Render use las mismas credenciales que `.env.local`.

## Verificación

Después de actualizar reglas, probar:
1. Guardar una categoría → debería funcionar
2. Eliminar una categoría → debería funcionar
3. El toggle de votación en admin → debería funcionar

## Nota Importante

Para producción, se recomienda usar reglas más restrictivas con autenticación:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo permitir operaciones si hay un admin autenticado
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    match /voters/{voterId} {
      allow create: if true;
      allow read, write: if request.auth != null;
    }
    match /votes/{voteId} {
      allow read, write: if true;
    }
    match /system_config/{config} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

Pero para la demo/prototipo, las reglas abiertas (`if true`) son suficientes.
