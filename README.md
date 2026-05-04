# DevPath — Plataforma de Cursos

Plataforma de aprendizaje con árbol de habilidades tipo Street Fighter, webcomponents y módulos ESM.

## Estructura del proyecto

```
course-platform/
├── index.html              ← Entry point, importmap ESM
├── css/
│   └── styles.css          ← Estilos globales dark mode
└── js/
    ├── main.js             ← Entry point JS (módulo ESM)
    ├── data.js             ← Datos del curso
    ├── components/
    │   ├── TopicCube.js    ← WebComponent: cubo de habilidad
    │   ├── TopicViewer.js  ← WebComponent: panel de contenido
    │   └── PomodoroTimer.js← WebComponent: temporizador
    └── modules/
        ├── eventBus.js     ← Bus de eventos (singleton ESM)
        ├── storage.js      ← Persistencia localStorage
        └── icons.js        ← Iconos SVG por tema
```

## Funcionalidades únicas

- 🎯 **Sistema de notas por tema** — textarea persistente en localStorage
- ⏱ **Pomodoro integrado** — en el sidebar con alertas de audio (AudioContext)
- 🔗 **Highlights con timestamp** — cada highlight salta al minuto exacto en YouTube
- 🔍 **Modo focus** — oculta sidebar y expande el área de vídeo
- ✨ **Animación de unlock** — al completar un tema por primera vez
- 🎨 **Bus de eventos ESM** — comunicación desacoplada entre módulos

## Subir a GitHub Pages

### 1. Crear el repo en GitHub

Ir a [github.com/new](https://github.com/new):
- Nombre: `course-platform` (o el que quieras)
- Visibilidad: **Public**
- NO marcar "Initialize with README"

### 2. Inicializar y subir

```bash
# Desde la carpeta course-platform/
git init
git add .
git commit -m "feat: course platform con modulos ESM y webcomponents"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/course-platform.git
git push -u origin main
```

### 3. Activar GitHub Pages

En el repo de GitHub:
- `Settings` → `Pages`
- Source: **Deploy from a branch**
- Branch: **main** → **/ (root)**
- Clic en **Save**

### 4. Tu URL

```
https://TU_USUARIO.github.io/course-platform/
```

Disponible en ~1 minuto. GitHub envía email de confirmación.

### Para subir cambios futuros

```bash
git add .
git commit -m "feat: descripcion del cambio"
git push
```

## Desarrollo local

Como usa módulos ESM, necesitas un servidor local (no abrir index.html directamente):

```bash
# Con Node.js (npx)
npx serve .

# Con Python
python -m http.server 8080

# Con VS Code → extensión "Live Server"
```

Abre en `http://localhost:3000` (o el puerto que indique).
