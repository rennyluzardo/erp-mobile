# ERP-System

Un sistema móvil de gestión empresarial (ERP) diseñado para el control completo de inventario, ventas y compras con proveedores.

## 📋 Descripción del Negocio

ERP-System es una aplicación móvil integral que permite a las empresas gestionar sus operaciones diarias de manera eficiente:

### 📦 Control de Inventario
- Gestión completa de productos y existencias
- Seguimiento en tiempo real del stock disponible
- Categorización y organización de productos

### 💪 Gestión de Ventas
- Creación y gestión de pedidos de venta
- Integración con escáner de códigos de barras para agregar productos rápidamente
- Sistema FIFO (First In, First Out) para rotación óptima de inventario
- Cálculo automático de totales y impuestos

### 🛒 Compras a Proveedores
- Gestión de pedidos de compra
- Control de relaciones con proveedores
- Seguimiento de recepciones y facturas

### 📱 Escáner de Productos
- Escaneo de códigos de barras usando la cámara del dispositivo
- Agregación automática de productos a ventas existentes
- Feedback sonoro para confirmación de escaneo
- Soporte para múltiples formatos de códigos de barras

## 🛠️ Stack Tecnológico

### Core Framework
- **Expo SDK 54** - Plataforma de desarrollo principal
- **React 19** - Biblioteca de UI
- **React Native 0.81** - Desarrollo móvil nativo
- **TypeScript (strict mode)** - Tipado estático y desarrollo seguro

### Navegación y Routing
- **Expo Router 6.0.23** - Sistema de routing file-based
- **React Navigation 7.1.6** - Navegación entre pantallas
- **React Native Screens 4.16.0** - Optimización de navegación
- **React Native Safe Area Context 5.6.0** - Manejo de áreas seguras

### Almacenamiento de Datos
- **expo-sqlite 16.0.10** - Base de datos local SQLite
- **expo-secure-store 15.0.8** - Almacenamiento seguro de credenciales

### UI y Experiencia de Usuario
- **React Native Paper 5.14.0** - Componentes de UI Material Design
- **React Native Reanimated 4.1.1** - Animaciones fluidas
- **React Native Vector Icons 10.2.0** - Sistema de iconos
- **Expo Vector Icons 15.0.3** - Iconos adicionales

### Funcionalidades Especializadas
- **expo-camera 17.0.10** - Acceso a cámara para escaneo
- **expo-av 16.0.8** - Reproducción de sonido (feedback de escaneo)
- **expo-font 14.0.11** - Gestión de fuentes personalizadas

### Desarrollo y Testing
- **Jest 29.2.1** - Framework de testing
- **jest-expo 54.0.17** - Configuración de Jest para Expo
- **Babel 7.25.2** - Transpilación JavaScript/TypeScript
- **TypeScript 5.9.2** - Compilador TypeScript

## 🏗️ Arquitectura del Proyecto

```
app/
├── (auth)/           # Flujo de autenticación
│   ├── loginScreen.tsx
│   ├── registerScreen.tsx
│   └── forgotPasswordScreen.tsx
├── (tabs)/           # Navegación principal
│   ├── index.tsx     # Home
│   ├── scannerScreen.tsx    # Escáner de productos
│   ├── inventoryScreen.tsx  # Gestión de inventario
│   └── profileScreen.tsx    # Perfil de usuario
└── _layout.tsx       # Layout principal

components/           # Componentes reutilizables
├── AuthForm.tsx      # Formularios de autenticación
├── ProductScanner.tsx # Componente de escaneo
└── ...

database/            # Capa de datos
├── index.ts         # Inicialización de SQLite
├── queries.ts       # Consultas SQL
└── models/          # Modelos de datos

constants/           # Configuración y estilos
├── Colors.ts        # Paleta de colores
├── Fonts.ts         # Configuración de fuentes
└── Sounds.ts        # Recursos de audio

utils/               # Utilidades
├── auth.ts          # Funciones de autenticación
└── database.ts      # Utilidades de base de datos
```

## 🚀 Configuración y Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Expo CLI
- Dispositivo iOS/Android o emulador

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd erp-system
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
```

3. **Iniciar el servidor de desarrollo**
```bash
npm start
# o
expo start
```

4. **Ejecutar en dispositivo/emulador**
```bash
# iOS
npm run ios

# Android  
npm run android

# Web
npm run web
```

## 📱 Funcionalidades Principales

### 🔐 Autenticación
- Registro de usuarios
- Login seguro
- Recuperación de contraseña
- Almacenamiento seguro de tokens

### 🏠 Dashboard
- Vista general del negocio
- Estadísticas rápidas
- Acceso directo a módulos principales

### 📊 Gestión de Inventario
- Lista completa de productos
- Detalles de cada item
- Control de stock
- Búsqueda y filtrado

### 📷 Escáner de Barras
- Activación de cámara
- Detección automática de códigos
- Feedback visual y sonoro
- Integración con ventas

### 💰 Ventas con FIFO
- Creación de pedidos
- Escaneo para agregar productos
- Cálculo automático usando método FIFO
- Gestión de múltiples ventas

### 👤 Perfil de Usuario
- Información personal
- Configuración de la app
- Historial de actividad

## 🔧 Configuración de Base de Datos

La aplicación utiliza SQLite local con las siguientes tablas principales:

- **users** - Información de usuarios
- **inventory_items** - Productos y existencias
- **sales** - Pedidos de venta
- **sale_items** - Items en cada venta
- **purchases** - Órdenes de compra

## 📦 Build y Despliegue

### Build para Producción
```bash
# iOS
expo build:ios

# Android
expo build:android
```

### Publicación en App Stores
```bash
# Submit a App Store
expo submit --platform ios

# Submit a Google Play
expo submit --platform android
```

## 🤝 Contribución

1. Fork del proyecto
2. Crear feature branch (`git checkout -b feature/amazing-feature`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push a la branch (`git push origin feature/amazing-feature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo licencia MIT - ver archivo LICENSE para detalles.

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto:
- Crear issue en el repositorio
- Contactar al equipo de desarrollo

---

**ERP-System** - La solución móvil completa para la gestión de tu negocio.
