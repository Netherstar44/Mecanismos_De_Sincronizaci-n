# MECANISMOS DE SINCRONIZACIÓN EN SISTEMAS OPERATIVOS — Workstation & Laboratorio 3D

Plataforma educativa, técnica e interactiva en 3D sobre **Mecanismos de Sincronización en Sistemas Operativos**. Construida con **React 19**, **Vite 7**, **TypeScript**, **Tailwind CSS v4**, y **Three.js** (`@react-three/fiber`, `@react-three/drei`, `lucide-react`, `framer-motion`).

Repositorio Oficial: [https://github.com/Netherstar44/Mecanismos_De_Sincronizaci-n](https://github.com/Netherstar44/Mecanismos_De_Sincronizaci-n)

---

## 👥 Desarrolladores & Arquitectos del Sistema
- **Jose Correa** — Ingeniería de Sistemas & Arquitectura de Software
- **Carlos Rincon** — Ingeniería de Sistemas & Arquitectura de Software
- **Sebastian Charry** — Ingeniería de Sistemas & Arquitectura de Software

---

## 🖥️ Modos de Interacción y Arquitectura

### 1. Cuarto de Ingeniería 3D (Room Workstation)
- Habitación tridimensional inmersiva con escritorio de desarrollo, torre PC gamer con ventiladores RGB, periféricos iluminados y monitores encendidos.
- Mapa holográfico en la pared con accesos directos al Easter Egg de planificación.
- Transición dinámica mediante clic en pantalla para ingresar al entorno de escritorio **SyncOS**.

### 2. SyncOS — Virtual Desktop Operating System
- Sistema Operativo de escritorio interactivo con gestor de ventanas flotantes, minimización, maximización y orden de capas.
- Barra de tareas inferior con menú de inicio **KERNEL**, reloj digital, telemetría de CPU y memoria en tiempo real.
- **Terminal Shell CLI (`/bin/bash`)**:
  - `tsl --test`: Ejecuta instrucción atómica TestAndSet sobre candado en memoria.
  - `tsl --unlock`: Libera el recurso atómico.
  - `sem --wait`: Primitiva `wait(S)` (decrementa contador, pone en sleep si < 0).
  - `sem --signal`: Primitiva `signal(S)` (despierta hilos dormidos).
  - `buffer --produce` / `buffer --consume`: Simula encolado/desencolado en búfer N=5.
  - `easteregg`: Abre el mapa táctico de algoritmos de planificación.
  - `authors`: Consulta la lista oficial de autores.
  - `biblio`: Lista las 7 fuentes académicas en formato APA 7ma Edición.
  - `status`: Muestra el estado del bus de datos y semáforos del sistema.

### 3. Simuladores Didácticos 3D Interactivos
- **El Baño Digital (Test-and-Set Lock)**: Analogía de pestillo atómico en hardware con simulación de Spinlock (espera activa vibratoria).
- **Estacionamiento Contador de Dijkstra (Semáforos)**: Barrera levadiza interactiva, contador dinámico, cola de suspensión de vehículos y despacho de procesos.
- **Productor-Consumidor con Búfer Acotado (N=5)**: Coordinación con 3 semáforos concurrentes (`mutex = 1`, `empty = 5`, `full = 0`).
- **Arquitectura DPRAM & Bus Atómico (Hardware)**: Multiprocesador Core 0 y Core 1 compitiendo por la línea de bus con señal `LOCK#`.
- **Condición de Carrera vs. Exclusión Mutua**: Comparador en vivo de corrupción de memoria vs. atomicidad estricta.
- **Grafo de Asignación de Recursos (RAG) & Deadlock**: Demostración visual de espera circular y bloqueo total de hilos.

### 4. Easter Egg: Mapa Táctico de Algoritmos de Planificación
Representación urbana cotidiana de los 4 algoritmos principales de planificación de CPU:
- **La Fila del Banco (FCFS)**: Efecto convoy por clientes lentos.
- **Caja Rápida del Supermercado (SJF)**: Minimización matemática del tiempo de espera medio.
- **El Carrusel del Parque (Round Robin)**: Quantum $q=2s$ equitativo para turnos compartidos.
- **Triage de Urgencias Médicas (Prioridad Apropiativa)**: Expulsión por código rojo hospitalario.
- Diagrama de Gantt generado en vivo y métricas de ejecución.

### 5. Sandbox Técnico 3D (`AdvancedSyncLab3D`)
- Arquitectura de Doble Plano en Silicio vs. Kernel:
  - **Plano Inferior**: Silicio, líneas de bus de memoria compartida, señal física `LOCK#` y 4 núcleos.
  - **Plano Superior**: Microkernel, planificador de hilos, colas de suspensión (`sleep queue`).
- Telemetría en tiempo real: medición de ciclos de CPU desperdiciados en Spinlock vs. ciclos ahorrados con suspensión (`sleep`).

---

## 🚀 Despliegue en Cloudflare Pages

El repositorio incluye automatización CI/CD lista para conexión continua entre GitHub y Cloudflare Pages:

- **Workflow GitHub Actions**: `.github/workflows/deploy-cloudflare.yml`
- **Versión de Node**: `.node-version` (22.18.0)
- **Reglas de Enrutamiento SPA**: `public/_redirects` (`/* /index.html 200`)
- **Cabeceras de Caché y Seguridad**: `public/_headers`

### Parámetros de Cloudflare Pages Build:
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Node.js Version**: `22`

---

## 🛠️ Instalación y Desarrollo Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Comprobación estricta de tipos TypeScript
npx tsc --noEmit

# 4. Compilar para producción
npm run build

# 5. Previsualizar la build de producción
npm run preview
```

---

## 📚 Referencias Bibliográficas (Formato APA 7ma Edición)

1. **BYJU'S CS.** (2023). *Semaphores in Operating System*. BYJU'S GATE Notes. [https://byjus.com/gate/semaphores-in-operating-system-notes/](https://byjus.com/gate/semaphores-in-operating-system-notes/)
2. **Dijkstra, E. W.** (1965). *Cooperating sequential processes* (Technical Report EWD-123). Technological University Eindhoven.
3. **GeeksforGeeks.** (2025, July 23). *Hardware Synchronization Algorithms: Unlock and Lock, Test and Set, Swap*. GeeksforGeeks CS Corner. [https://www.geeksforgeeks.org/operating-systems/hardware-synchronization-algorithms-unlock-and-lock-test-and-set-swap/](https://www.geeksforgeeks.org/operating-systems/hardware-synchronization-algorithms-unlock-and-lock-test-and-set-swap/)
4. **Rinard, M. C.** (1998). *Operating Systems Lecture Notes: Lecture 5 - Implementing Synchronization Operations*. MIT Laboratory for Computer Science (CSAIL). [https://people.csail.mit.edu/rinard/teaching/osnotes/h5.html](https://people.csail.mit.edu/rinard/teaching/osnotes/h5.html)
5. **Silberschatz, A., Galvin, P. B., & Gagne, G.** (2018). *Operating System Concepts* (10th ed.). John Wiley & Sons.
6. **TutorialsPoint.** (2026, March 17). *Semaphores in Operating System*. TutorialsPoint Computer Science Articles. [https://www.tutorialspoint.com/article/semaphores-in-operating-system](https://www.tutorialspoint.com/article/semaphores-in-operating-system)
7. **Wikipedia.** (2026, September 8). *Test-and-set*. Wikimedia Foundation. [https://en.wikipedia.org/wiki/Test-and-set](https://en.wikipedia.org/wiki/Test-and-set)
