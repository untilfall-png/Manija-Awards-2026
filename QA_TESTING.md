# 🧪 QA Testing & Validación - Manija Awards 2026

## Checklist de QA Manual

### 📱 Responsiveness Testing

#### Mobile (320px - 480px)
- [ ] Hero: Se ve correctamente en tamaño pequeño
- [ ] Login form: Inputs legibles y accesibles
- [ ] Voting cards: Una columna en móvil
- [ ] Admin panel: Tabs colapsables/scrollables
- [ ] Buttons: Tamaño suficiente para touch (min 44px)
- [ ] No hay overflow horizontal

#### Tablet (768px - 1024px)
- [ ] Grid layouts: 2 columnas
- [ ] Admin tabs: Visibles sin scroll excesivo
- [ ] Imágenes: Escaladas correctamente
- [ ] Padding: Proporcional al tamaño

#### Desktop (1440px+)
- [ ] Layouts: 3-4 columnas donde corresponda
- [ ] Spacing: Óptimo y consistente
- [ ] Animations: Fluidez sin lag
- [ ] No se rompe con viewport muy ancho

### 🎯 Registro y Votación

#### Registro
- [ ] **Validación Nombre**: Solo acepta texto no vacío
- [ ] **Validación Email**: Verifica formato (@)
- [ ] **Validación Teléfono**: Opcional y acepta diversos formatos
- [ ] **Firebase**: Sin errores de 'undefined' en consola
- [ ] **LocalStorage**: Session se guarda correctamente
- [ ] **Duplicados**: Usuario existente reutiliza votación anterior

#### Votación
- [ ] **Categorías Cargan**: Desde Firebase sin errores
- [ ] **Una por Una**: Solo categoría activa se muestra
- [ ] **Prevención Doble Voto**: Botón deshabilitado si ya votó
- [ ] **Progreso**: Barra avanza correctamente
- [ ] **Confirmación**: Voto se registra en Firebase
- [ ] **Siguiente**: Avanza automáticamente a siguiente categoría

### 🔐 Panel Admin

#### Login Admin
- [ ] **Contraseña Correcta**: Acceso permitido
- [ ] **Contraseña Incorrecta**: Mensaje de error legible
- [ ] **Token**: Se guarda en localStorage
- [ ] **Persistencia**: Refresh mantiene sesión

#### Gestión de Categorías
- [ ] **Crear**: Nueva categoría se guarda en Firebase
- [ ] **Editar**: Cambios se persisten
- [ ] **Eliminar**: Confirmación antes de borrar
- [ ] **Nominados**: CRUD funciona correctamente
- [ ] **Orden**: Categorías siguen orden especificado

#### Resultados
- [ ] **Filtros**: Por categoría y votante funcionan
- [ ] **CSV**: Se descarga con formato correcto
- [ ] **Datos**: Votante, email, categoría, nominado visibles
- [ ] **Actualización**: Datos en vivo reflejan nuevos votos

#### Gráficos
- [ ] **Barras**: Se renderizan correctamente
- [ ] **Porcentajes**: Cálculos correctos
- [ ] **Animaciones**: Suaves sin lag
- [ ] **Responsivos**: Se ajustan a pantalla

### 🧬 Pruebas de Firebase

#### Conexión
- [ ] **Credenciales**: Correctas en .env.local
- [ ] **Firestore**: Conecta sin errores
- [ ] **Collections**: Existen (voters, votes, categories)

#### Datos
- [ ] **Voters**: Phone es OPCIONAL (no guarda undefined)
- [ ] **Votes**: Unique por (voterId, categoryId)
- [ ] **Timestamps**: Se registran en server time
- [ ] **Índices**: Queries usan índices existentes

### 📊 Flujo Completo

1. [ ] Usuario accede a homepage
2. [ ] Ve Hero con opción directa sin QR obligatorio
3. [ ] Ingresa al formulario de registro (sin QR)
4. [ ] Completa nombre, email, teléfono (opcional)
5. [ ] Se registra sin errores Firebase
6. [ ] Ve votación secuencial por categoría
7. [ ] Vota en cada categoría
8. [ ] Completa votación con confirmación
9. [ ] Ve resultados en vivo
10. [ ] Puede cerrar sesión
11. [ ] Acceso a panel admin es seguro

### 🔍 Errores Comunes a Verificar

```javascript
// ✅ CORRECTO - Phone opcional
const voter = {
  name: "Juan",
  email: "juan@example.com",
  // phone no incluído si está vacío
}

// ❌ EVITAR - Phone undefined
const voter = {
  name: "Juan",
  email: "juan@example.com",
  phone: undefined  // ← PROBLEMA
}

// ✅ CORRECTO - Validación en componentes
if (formData.phone && formData.phone.trim()) {
  dataToSave.phone = formData.phone.trim()
}
```

### 🚀 Performance Checks

- [ ] **Bundle Size**: npm run build muestra tamaño
- [ ] **Lighthouse**: Score verde (>90)
- [ ] **First Paint**: < 2s en 4G
- [ ] **Core Web Vitals**: Dentro de límites
- [ ] **Imágenes**: Optimizadas y lazy-loaded
- [ ] **CSS**: Minificado en producción
- [ ] **JS**: Code splitting habilitado

### 🔒 Security Checks

- [ ] **Admin Password**: No en HTML público
- [ ] **Firebase Rules**: Restringidas apropiadamente
- [ ] **CORS**: Configurado si necesario
- [ ] **Variables de Entorno**: .env.local ignorado en git
- [ ] **Sensible Data**: No en localStorage sin encripción
- [ ] **XSS Prevention**: Inputs sanitizados

## Testing en Diferentes Navegadores

### Chrome / Edge
- [ ] Todos los tests pasan
- [ ] Animaciones suaves

### Firefox
- [ ] Estilos se aplican correctamente
- [ ] Neon glow effects visibles

### Safari
- [ ] Gradientes se renderizan bien
- [ ] Touch events funcionan

### Mobile Browsers
- [ ] iOS Safari: Responsive
- [ ] Chrome Mobile: Sin freezes
- [ ] Samsung Internet: Compatible

## Notas de Build

```bash
# Build local
npm run build

# Start local
npm run start

# Check bundle
npm run build -- --analyze

# Lint code
npm run lint
```

## Casos de Error a Simular

1. **Sin conexión Firebase**: Mostrar mensaje de error
2. **Voto duplicado**: Prevenir en UI y BD
3. **Sesión expirada**: Re-login necesario
4. **Datos inválidos**: Validar en cliente y servidor
5. **Timeout**: Manejar con reintentos

---

**Última actualización**: Actualización continuada durante desarrollo  
**Estado**: En proceso
