// js/data.js — Datos del curso (módulo ESM)

export const COURSE = {
  id: "dev-fullstack",
  title: "Desarrollo Web Full Stack",
  phases: [
    {
      id: "phase-1",
      label: "Fundamentos",
      topics: [
        {
          id: "terminal",
          label: "Terminal",
          icon: "terminal",
          color: "indigo",
          video: {
            youtubeId: "nZ5-SXi3J5Q",
            title: "Terminal & CLI — Curso Completo",
            duration: "4h 12min"
          },
          highlights: [
            { time: 180,  label: "Comandos básicos de navegación" },
            { time: 720,  label: "Gestión de archivos y directorios" },
            { time: 1440, label: "Variables de entorno" },
            { time: 2100, label: "Scripts bash" },
            { time: 3200, label: "Permisos y usuarios" }
          ],
          chapters: [
            {
              id: "ch-terminal-1",
              title: "Introducción a la terminal",
              youtubeId: "nZ5-SXi3J5Q",
              startTime: 0,
              highlights: [0, 1]
            },
            {
              id: "ch-terminal-2",
              title: "Scripting avanzado",
              youtubeId: "nZ5-SXi3J5Q",
              startTime: 2100,
              highlights: [3, 4]
            }
          ]
        },
        {
          id: "git",
          label: "Git",
          icon: "git",
          color: "pink",
          video: {
            youtubeId: "3GymExBkKjE",
            title: "Git & GitHub — De cero a experto",
            duration: "5h 03min"
          },
          highlights: [
            { time: 300,  label: "Inicializar repositorio" },
            { time: 900,  label: "Commits y staging area" },
            { time: 2400, label: "Ramas y merge" },
            { time: 4200, label: "GitHub y remotes" },
            { time: 5800, label: "Git flow y Pull Requests" }
          ],
          chapters: [
            {
              id: "ch-git-1",
              title: "Control de versiones básico",
              youtubeId: "3GymExBkKjE",
              startTime: 0,
              highlights: [0, 1]
            },
            {
              id: "ch-git-2",
              title: "Trabajo en equipo",
              youtubeId: "3GymExBkKjE",
              startTime: 2400,
              highlights: [2, 3, 4]
            }
          ]
        },
        {
          id: "html",
          label: "HTML",
          icon: "html",
          color: "indigo",
          video: {
            youtubeId: "kN1XP-Bef7w",
            title: "HTML Completo — Desde cero",
            duration: "3h 48min"
          },
          highlights: [
            { time: 120,  label: "Estructura básica del documento" },
            { time: 600,  label: "Etiquetas semánticas" },
            { time: 1800, label: "Formularios y accesibilidad" },
            { time: 2900, label: "SEO y metaetiquetas" }
          ]
        },
        {
          id: "css",
          label: "CSS",
          icon: "css",
          color: "pink",
          video: {
            youtubeId: "wZniZEbPAzk",
            title: "CSS — Diseño Web Moderno",
            duration: "6h 21min"
          },
          highlights: [
            { time: 240,  label: "Selectores y especificidad" },
            { time: 1200, label: "Flexbox" },
            { time: 2400, label: "CSS Grid" },
            { time: 4800, label: "Animaciones y transiciones" },
            { time: 7200, label: "Variables CSS y temas" }
          ],
          chapters: [
            {
              id: "ch-css-1",
              title: "Layout con Flexbox y Grid",
              youtubeId: "wZniZEbPAzk",
              startTime: 1200,
              highlights: [1, 2]
            }
          ]
        }
      ]
    },
    {
      id: "phase-2",
      label: "JavaScript",
      topics: [
        {
          id: "js-basics",
          label: "JS Base",
          icon: "js",
          color: "indigo",
          video: {
            youtubeId: "Hl-zzrqQoSE",
            title: "JavaScript — Fundamentos",
            duration: "4h 55min"
          },
          highlights: [
            { time: 300,  label: "Variables y tipos de datos" },
            { time: 900,  label: "Funciones y scope" },
            { time: 2100, label: "Arrays y objetos" },
            { time: 3600, label: "Clases y POO" }
          ]
        },
        {
          id: "js-dom",
          label: "DOM",
          icon: "dom",
          color: "pink",
          video: {
            youtubeId: "0iy0S4yjXts",
            title: "Manipulación del DOM",
            duration: "3h 10min"
          },
          highlights: [
            { time: 200,  label: "Selección de elementos" },
            { time: 800,  label: "Eventos" },
            { time: 1500, label: "Crear y modificar elementos" },
            { time: 2400, label: "Web Components" }
          ]
        },
        {
          id: "js-async",
          label: "Async",
          icon: "async",
          color: "indigo",
          video: {
            youtubeId: "hrt7G4IVXmw",
            title: "JS Asíncrono — Promises, Async/Await",
            duration: "2h 44min"
          },
          highlights: [
            { time: 300,  label: "Callbacks" },
            { time: 900,  label: "Promises" },
            { time: 1800, label: "Async / Await" },
            { time: 2400, label: "Fetch API y REST" }
          ]
        },
        {
          id: "js-modules",
          label: "Módulos",
          icon: "modules",
          color: "pink",
          video: {
            youtubeId: "cRHQNNkYi1A",
            title: "Módulos ESM — Import / Export",
            duration: "1h 58min"
          },
          highlights: [
            { time: 120,  label: "Import y Export nombrados" },
            { time: 540,  label: "Import dinámico" },
            { time: 900,  label: "Import Maps" },
            { time: 1400, label: "Estructura de carpetas" }
          ]
        }
      ]
    },
    {
      id: "phase-3",
      label: "Avanzado",
      topics: [
        {
          id: "typescript",
          label: "TypeScript",
          icon: "ts",
          color: "indigo",
          video: {
            youtubeId: "fUgxxhI_bvc",
            title: "TypeScript — Tipado Estático",
            duration: "4h 30min"
          },
          highlights: [
            { time: 300,  label: "Tipos básicos" },
            { time: 1200, label: "Interfaces y tipos" },
            { time: 2400, label: "Generics" },
            { time: 3600, label: "Decoradores" }
          ]
        },
        {
          id: "apis",
          label: "APIs",
          icon: "api",
          color: "pink",
          video: {
            youtubeId: "7YcW25PHnAA",
            title: "REST APIs y Fetch",
            duration: "3h 15min"
          },
          highlights: [
            { time: 200,  label: "HTTP y métodos REST" },
            { time: 900,  label: "Fetch y axios" },
            { time: 2000, label: "Autenticación JWT" }
          ]
        },
        {
          id: "nodejs",
          label: "Node.js",
          icon: "node",
          color: "indigo",
          video: {
            youtubeId: "yB4n_K7dZV8",
            title: "Node.js — Backend con JavaScript",
            duration: "5h 50min"
          },
          highlights: [
            { time: 300,  label: "Event loop y runtime" },
            { time: 1200, label: "Express.js" },
            { time: 3000, label: "Base de datos" },
            { time: 5000, label: "Deploy en producción" }
          ]
        },
        {
          id: "testing",
          label: "Testing",
          icon: "test",
          color: "pink",
          video: {
            youtubeId: "FgnxcUQ5vho",
            title: "Testing — Vitest y Testing Library",
            duration: "2h 30min"
          },
          highlights: [
            { time: 300,  label: "Unit testing básico" },
            { time: 900,  label: "Mocks y stubs" },
            { time: 1800, label: "Testing de componentes" }
          ]
        }
      ]
    }
  ]
};
