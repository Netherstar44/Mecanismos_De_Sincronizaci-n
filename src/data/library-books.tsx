import { BathroomLockScene } from "@/components/3d/scenes/bathroom-scene";
import { ParkingCounterScene } from "@/components/3d/scenes/parking-scene";
import { ProducerConsumerScene } from "@/components/3d/scenes/producer-consumer-scene";
import { TSLHardwareScene } from "@/components/3d/scenes/tsl-scene";
import { DeadlockGraphScene } from "@/components/3d/scenes/deadlock-scene";
import { RaceConditionScene } from "@/components/3d/scenes/race-condition-scene";

export interface BookItem {
  id: string;
  title: string;
  shelf: 1 | 2; // 1 = Hardware (TSL), 2 = Software (Semáforos)
  color: string;
  summary: string;
  content: string;
  tags: string[];
  citations: string[];
  imageUrl?: string;
  Scene: React.ComponentType<any>;
}

export const libraryBooks: BookItem[] = [
  // =========================================================================
  // ESTANTE 1: GRUPO 1 — TEST-AND-SET (MECANISMO A NIVEL DE HARDWARE)
  // =========================================================================
  {
    id: "tsl-intro",
    title: "1. Sección Crítica y Concurrencia",
    shelf: 1,
    color: "#0f3a5d", // Deep ocean blue
    summary: "El Problema de la Sección Crítica y las Condiciones de Carrera en memoria compartida.",
    content: `El Problema Fundamental de la Concurrencia [2].\n\nEn sistemas operativos modernos y entornos multiprocesador de memoria compartida, múltiples hilos o procesos acceden concurrentemente a variables o periféricos comunes. Si dos o más procesos leen y escriben sobre la misma posición de memoria sin coordinación previa, se genera una Condición de Carrera (Race Condition), dejando los datos en un estado incoherente o corrupto.\n\nPara resolver esto, se define la 'Sección Crítica' (Critical Section): el bloque de código donde se accede y manipula el recurso compartido. La solución exige garantizar tres condiciones esenciales:\n1. Exclusión Mutua (Mutual Exclusion): Solo un proceso a la vez puede ejecutar su sección crítica.\n2. Progreso (Progress): Si ningún proceso está en su sección crítica y otros desean entrar, solo los procesos que compiten pueden decidir quién entrará, sin demora indefinida.\n3. Espera Acotada (Bounded Waiting): Debe existir un límite al número de veces que otros procesos pueden entrar tras la solicitud de un proceso dado [2], [5].`,
    tags: ["SECCIÓN CRÍTICA", "EXCLUSIÓN MUTUA", "CONDICIÓN DE CARRERA", "MEMORIA COMPARTIDA"],
    citations: ["[2] Silberschatz et al. (2018)", "[5] Wikipedia (2026)"],
    Scene: RaceConditionScene
  },
  {
    id: "tsl-concepto",
    title: "2. Instrucción Test-and-Set (TSL)",
    shelf: 1,
    color: "#854d0e", // Amber bronze
    summary: "Instrucción indivisible a nivel de hardware y CPU para control de candados atómicos.",
    content: `Test-and-Set (TSL - Test and Set Lock) a Nivel de Hardware [4], [5].\n\nTest-and-Set es una instrucción primitiva de CPU diseñada en el conjunto de instrucciones del procesador (x86, IBM System/360, SPARC). Su propósito es escribir un valor booleano (flag) en una posición de memoria y devolver de forma simultánea su valor previo en un único ciclo de instrucción de procesador.\n\nAl realizarse directamente en la circuitería del procesador o memoria de doble puerto (DPRAM), permite que los procesos prueben y modifiquen variables de control compartidas sin posibilidad de ser interrumpidos a la mitad de la operación.\n\nCita Académica:\n"Hardware synchronization algorithms rely on atomic memory words where reading and setting occur in a single uninterrupted clock cycle" [3], [4].`,
    tags: ["HARDWARE TSL", "INSTRUCCIÓN CPU", "DPRAM", "MEMORIA COMPARTIDA"],
    citations: ["[3] Rinard (MIT 1998)", "[4] GeeksforGeeks (2025)", "[5] Wikipedia (2026)"],
    Scene: TSLHardwareScene
  },
  {
    id: "tsl-atomicidad",
    title: "3. Atomicidad y Aislamiento de Bus",
    shelf: 1,
    color: "#1e3a8a", // Cobalt blue
    summary: "Principio de atomicidad indivisible y bloqueo del bus de memoria multiprocesador.",
    content: `La Esencia de la Atomicidad [2], [3].\n\nUna operación es atómica cuando se ejecuta como una unidad indivisible e ininterrumpible. Durante la ejecución de una instrucción Test-and-Set en hardware, ningún otro procesador, hilo o interrupción puede intervenir o ver un estado intermedio de la memoria.\n\nEn arquitecturas multiprocesador, si dos núcleos de CPU intentan ejecutar Test-and-Set simultáneamente sobre la misma dirección de memoria, el hardware del bus de datos activa una señal de bloqueo (LOCK#) o el árbitro de la memoria DPRAM posterga a uno de ellos. Esto garantiza que las operaciones se serialicen estrictamente a nivel físico [2].`,
    tags: ["ATOMICIDAD", "SEÑAL LOCK#", "INDIVISIBLE", "MULTIPROCESAMIENTO"],
    citations: ["[2] Silberschatz et al. (2018)", "[3] Rinard (MIT 1998)"],
    Scene: TSLHardwareScene
  },
  {
    id: "tsl-pseudocodigo",
    title: "4. Algoritmo y Spinlock",
    shelf: 1,
    color: "#78350f", // Dark bronze
    summary: "Lógica formal, función TestAndSet y el bucle de espera activa (Spinlock).",
    content: `Comportamiento Lógico de Test-and-Set [4], [5]:\n\nboolean TestAndSet(boolean *target) {\n    boolean rv = *target; // Almacena el valor previo\n    *target = true;       // Asigna el nuevo valor (bloqueado)\n    return rv;            // Retorna el valor previo\n}\n\nImplementación de Exclusión Mutua:\nSe define una variable booleana compartida 'lock', inicializada en false (libre).\n\n1. Protocolo de Entrada:\n    while (TestAndSet(&lock)) ; // Espera activa (Spinlock)\n\nMientras la cerradura esté ocupada (retorna true), el hilo sigue girando en el bucle.\nCuando retorna false, el hilo adquiere el candado y entra a la Sección Crítica.\n\n2. Protocolo de Salida:\n    lock = false; // Escritura simple para liberar el acceso [5].`,
    tags: ["PSEUDOCÓDIGO", "SPINLOCK", "WHILE LOOP", "LOCK ATÓMICO"],
    citations: ["[4] GeeksforGeeks (2025)", "[5] Wikipedia (2026)"],
    Scene: TSLHardwareScene
  },
  {
    id: "tsl-tradeoffs",
    title: "5. Ventajas y Desventajas de TSL",
    shelf: 1,
    color: "#991b1b", // Dark red
    summary: "Simplicidad y hardware nativo vs Espera Activa, Inanición e Inversión de Prioridades.",
    content: `Evaluación Técnica de Test-and-Set [2], [4]:\n\nVentajas:\n+ Simplicidad y soporte directo en el hardware de los microprocesadores modernos.\n+ Garantiza exclusión mutua estricta en arquitecturas de memoria compartida.\n+ Latencia ultra baja cuando no existe contención por el candado.\n+ Almacenamiento mínimo (solo requiere 1 bit o una variable booleana).\n\nDesventajas Críticas:\n- Espera Activa (Busy Waiting / Spinlock): Los hilos en espera consumen el 100% de ciclos de CPU y saturan el bus de datos en intentos repetidos inútiles.\n- Inanición (Starvation): No respeta una cola FIFO de orden de llegada. Un proceso desafortunado puede quedar esperando indefinidamente.\n- Inversión de Prioridades: Un proceso prioritario puede quedar trabado consumiendo tiempo de CPU mientras un proceso de baja prioridad retiene el candado [2].`,
    tags: ["ESPERA ACTIVA", "INANICIÓN", "INVERSIÓN PRIORIDADES", "DESPERDICIO CPU"],
    citations: ["[2] Silberschatz et al. (2018)", "[4] GeeksforGeeks (2025)"],
    Scene: TSLHardwareScene
  },
  {
    id: "tsl-bano",
    title: "6. Didáctica: El Baño y la Cerradura",
    shelf: 1,
    color: "#065f46", // Dark emerald
    summary: "La analogía interactiva del baño de la cafetería con cerradura digital electrónica.",
    content: `Analogía Didáctica para el Aula: El Baño de la Cafetería [Texto Guía]\n\nImagine el baño individual de una cafetería con una cerradura digital electrónica:\n* La variable 'lock' representa la cerradura (false = libre, true = ocupado).\n* La instrucción 'TestAndSet' es la acción física de girar el pestillo: en un solo movimiento atómico instantáneo, la persona lee si la puerta estaba abierta y simultáneamente le pasa el seguro.\n\n* Cuando el Cliente A (Proceso A) llega y el baño está libre ('lock = false'), ejecuta TestAndSet. La cerradura retorna false (estaba libre) e inmediatamente pasa a true (ahora ocupado). El Cliente A ingresa al baño.\n\n* Si el Cliente B (Proceso B) llega mientras A está adentro, ejecuta TestAndSet. La cerradura retorna true y se mantiene en true. El Cliente B no puede entrar y se queda intentando girar el pomo repetidamente en la puerta (Espera Activa / Spinlock).\n\n* Cuando el Cliente A sale, simplemente abre la puerta desde adentro ('lock = false'). En el siguiente intento, Cliente B detecta false y logra ingresar al baño.`,
    tags: ["ANALOGÍA DIDÁCTICA", "EL BAÑO", "CERRADURA DIGITAL", "SPINLOCK VISUAL"],
    citations: ["[2] Silberschatz et al. (2018)", "[5] Wikipedia (2026)"],
    Scene: BathroomLockScene
  },
  {
    id: "tsl-traza",
    title: "7. Traza de Pizarra: Test-and-Set",
    shelf: 1,
    color: "#047857", // Emerald
    summary: "Traza paso a paso para pizarra universitaria analizando el estado de variables y procesos.",
    content: `Traza de Ejecución Paso a Paso (Para Pizarra) [Texto Guía]:\n\n1. Estado Inicial:\n   - lock = false (Cerradura en verde).\n   - P1 y P2 en espera de solicitar el recurso.\n\n2. Proceso P1 ejecuta: while(TestAndSet(&lock));\n   - TestAndSet lee false. Retorna false.\n   - lock cambia inmediatamente a true.\n   - Como la condición del while es false, P1 rompe el bucle e ingresa a la Sección Crítica.\n\n3. Proceso P2 ejecuta: while(TestAndSet(&lock));\n   - TestAndSet lee true. Retorna true.\n   - lock permanece en true.\n   - La condición del while es true: P2 queda atrapado en el bucle de espera activa.\n\n4. Proceso P1 finaliza su Sección Crítica y ejecuta: lock = false;\n   - La cerradura pasa a false.\n\n5. En la siguiente iteración de P2, TestAndSet(&lock) retorna false.\n   - lock cambia a true. P2 ingresa a la Sección Crítica exitosamente.`,
    tags: ["TRAZA PASO A PASO", "PIZARRA DE CLASE", "EJECUCIÓN FORMAL", "SECUENCIA TSL"],
    citations: ["[2] Silberschatz et al. (2018)", "[4] GeeksforGeeks (2025)"],
    Scene: BathroomLockScene
  },

  // =========================================================================
  // ESTANTE 2: GRUPO 2 — SEMÁFOROS (NIVEL SOFTWARE / SISTEMA OPERATIVO)
  // =========================================================================
  {
    id: "sem-concepto",
    title: "8. Semáforos y Edsger Dijkstra",
    shelf: 2,
    color: "#581c87", // Deep purple
    summary: "Origen histórico en 1965, concepto de variable entera compartida y tipo abstracto.",
    content: `El Legado de Edsger W. Dijkstra (1965) [1], [6].\n\nUn Semáforo es una variable entera compartida y un tipo de dato abstracto introducido históricamente por el matemático y científico de la computación Edsger Dijkstra en su célebre monografía 'Cooperating Sequential Processes' (1965) [1].\n\nSirve como primitiva de sincronización de alto nivel dentro del microkernel del Sistema Operativo para coordinar el acceso concurrente a recursos sin desperdiciar tiempo de procesador en espera activa.\n\nA diferencia del spinlock de Test-and-Set, cuando un proceso solicita un semáforo y no hay recursos disponibles, el Sistema Operativo suspende al proceso (sleep) y lo traslada a una cola de espera, cediendo la CPU a otros procesos útiles [1], [2].`,
    tags: ["EDSGER DIJKSTRA", "AÑO 1965", "TIPO ABSTRACTO", "SIN ESPERA ACTIVA"],
    citations: ["[1] Dijkstra (1965)", "[2] Silberschatz et al. (2018)", "[6] BYJU'S (2023)"],
    Scene: ParkingCounterScene
  },
  {
    id: "sem-tipos",
    title: "9. Semáforos Binarios vs Contadores",
    shelf: 2,
    color: "#3b0764", // Ultra purple
    summary: "Diferencias técnicas entre el semáforo binario (Mutex) y el semáforo contador.",
    content: `Clasificación Fundamental de Semáforos [2], [6]:\n\n1. Semáforo Binario (Binary Semaphore / Mutex Lock):\n- Su valor solo puede ser 0 o 1.\n- Valor inicial típico: 1 (recurso libre).\n- Se utiliza como candado de exclusión mutua directa para una única instancia de un recurso compartido.\n- Si un proceso ejecuta wait(), pasa a 0; otros procesos que lleguen serán bloqueados.\n\n2. Semáforo Contador (Counting Semaphore):\n- Su valor es un entero no negativo (0, 1, 2, ..., N).\n- Su valor inicial representa la cantidad total de instancias idénticas disponibles de un recurso.\n- Se decrementa cuando un proceso solicita una instancia del recurso y se incrementa cuando un proceso libera una instancia al pool [6].`,
    tags: ["SEMÁFORO BINARIO", "SEMÁFORO CONTADOR", "MUTEX", "POOLS DE RECURSOS"],
    citations: ["[2] Silberschatz et al. (2018)", "[6] BYJU'S (2023)"],
    Scene: ParkingCounterScene
  },
  {
    id: "sem-wait-signal",
    title: "10. Primitivas wait() y signal()",
    shelf: 2,
    color: "#431407", // Dark copper
    summary: "Operaciones atómicas P(S) y V(S), colas de suspensión (sleep) y despertar (wakeup).",
    content: `Las Operaciones Atómicas P y V de Dijkstra [1], [7]:\n\n- Operación wait(S) / P(S) (del holandés 'proberen' / probar):\nwait(S) {\n    S.value--;\n    if (S.value < 0) {\n        // Añadir proceso a la cola de espera S.queue\n        // Bloquear y suspender el proceso (sleep)\n    }\n}\n\n- Operación signal(S) / V(S) (del holandés 'verhogen' / incrementar):\nsignal(S) {\n    S.value++;\n    if (S.value <= 0) {\n        // Remover un proceso P de la cola S.queue\n        // Despertar al proceso P (wakeup)\n    }\n}\n\nAmbas operaciones se ejecutan de manera indivisible dentro del microkernel del SO, garantizando que dos procesos no modifiquen el contador S de forma concurrente [2].`,
    tags: ["WAIT P(S)", "SIGNAL V(S)", "SLEEP", "WAKEUP", "KERNEL QUEUE"],
    citations: ["[1] Dijkstra (1965)", "[2] Silberschatz et al. (2018)", "[7] TutorialsPoint (2026)"],
    Scene: ParkingCounterScene
  },
  {
    id: "sem-analisis",
    title: "11. Ventajas vs Riesgo de Deadlocks",
    shelf: 2,
    color: "#7f1d1d", // Dark crimson
    summary: "Ahorro de CPU frente al peligro de interbloqueos, inversión de prioridades y bugs de orden.",
    content: `Ventajas y Desventajas de los Semáforos [2], [6]:\n\nVentajas:\n+ Cero desperdicio de CPU: Los procesos que no pueden acceder se duermen (sleep) y no consumen ciclos de cómputo ni tráfico de bus.\n+ Versatilidad extrema: Permiten exclusión mutua, sincronización de secuencias condicionales y control de pools de múltiples recursos.\n+ Independencia de plataforma: Implementados como primitivas abstractas del microkernel.\n\nDesventajas y Riesgos:\n- Complejidad y Riesgo de Deadlock (Interbloqueo): Si un programador invierte el orden de llamadas a wait() y signal(), o si dos procesos ejecutan wait() cruzados, el sistema puede quedar congelado para siempre.\n- Violación de Exclusión Mutua por omisión de wait() o signal().\n- Pérdida de Modularidad: Las llamadas se dispersan por todo el código fuente, dificultando el mantenimiento [2].`,
    tags: ["VENTAJAS", "DEADLOCK", "INTERBLOQUEO", "RIESGOS KERNEL"],
    citations: ["[2] Silberschatz et al. (2018)", "[6] BYJU'S (2023)"],
    Scene: DeadlockGraphScene
  },
  {
    id: "sem-parking",
    title: "12. Didáctica: El Estacionamiento",
    shelf: 2,
    color: "#1e3a8a", // Blue
    summary: "La analogía didáctica interactiva del estacionamiento para N=3 vehículos y barrera contadora.",
    content: `Analogía Didáctica para el Aula: El Estacionamiento [Texto Guía]\n\nImagine un estacionamiento con capacidad máxima para N = 3 vehículos:\n* Se utiliza un Semáforo Contador inicializado en S = 3 (3 espacios libres).\n* La operación 'wait(S)' representa el ticket de entrada y la barrera de ingreso.\n* La operación 'signal(S)' representa el pago y la barrera de egreso.\n\nTraza de Ejecución en Clase:\n1. Estado inicial: S = 3. Estacionamiento vacío.\n2. Llega Auto 1: Ejecuta wait(S) -> S disminuye a 2. La barrera sube e ingresa (S >= 0).\n3. Llega Auto 2: Ejecuta wait(S) -> S disminuye a 1. Ingresa (S >= 0).\n4. Llega Auto 3: Ejecuta wait(S) -> S disminuye a 0. Ingresa (S >= 0). Estacionamiento LLENO.\n5. Llega Auto 4: Ejecuta wait(S) -> S disminuye a -1. Como S < 0, la barrera no sube. Auto 4 apaga su motor y entra a la cola de espera (Estado Bloqueado / Sleep).\n6. Sale Auto 1: Ejecuta signal(S) -> S sube a 0. Como S <= 0, el sistema despierta al Auto 4 (Wakeup). Auto 4 arranca e ingresa a ocupar el lugar libre.`,
    tags: ["ANALOGÍA DIDÁCTICA", "EL ESTACIONAMIENTO", "CAPACIDAD N=3", "BARRERA CONTADORA"],
    citations: ["[2] Silberschatz et al. (2018)", "[6] BYJU'S (2023)"],
    Scene: ParkingCounterScene
  },
  {
    id: "sem-productor-consumidor",
    title: "13. Caso de Código: Productor-Consumidor",
    shelf: 2,
    color: "#065f46", // Dark green
    summary: "Implementación en código en C del problema con búfer limitado N=5 usando 3 semáforos.",
    content: `Problema Clásico del Productor-Consumidor con Búfer Acotado [1], [7]:\n\n// Definición de recursos compartidos y semáforos\n#define N 5 // Capacidad del búfer circular\nsemaphore mutex = 1; // Semáforo binario para exclusión mutua en el búfer\nsemaphore empty = N; // Semáforo contador para espacios vacíos disponibles\nsemaphore full  = 0; // Semáforo contador para elementos listos para consumir\n\nvoid Productor() {\n    while (1) {\n        int item = producir_item();\n        wait(empty); // Espera si no hay espacios libres (empty <= 0)\n        wait(mutex); // Garantiza acceso exclusivo al búfer\n        \n        insertar_item_en_bufer(item);\n        \n        signal(mutex); // Libera el acceso al búfer\n        signal(full);  // Incrementa la cantidad de elementos disponibles\n    }\n}\n\nvoid Consumidor() {\n    while (1) {\n        wait(full);  // Espera si el búfer está vacío (full <= 0)\n        wait(mutex); // Garantiza acceso exclusivo al búfer\n        \n        int item = remover_item_del_bufer();\n        \n        signal(mutex); // Libera el acceso al búfer\n        signal(empty); // Incrementa la cantidad de espacios libres\n        \n        consumir_item(item);\n    }\n}`,
    tags: ["CÓDIGO EN C", "PRODUCTOR-CONSUMIDOR", "BÚFER N=5", "MUTEX Y CONTADOR"],
    citations: ["[1] Dijkstra (1965)", "[2] Silberschatz et al. (2018)", "[7] TutorialsPoint (2026)"],
    Scene: ProducerConsumerScene
  },
  {
    id: "sem-matriz",
    title: "14. Matriz Comparativa: TSL vs Semáforos",
    shelf: 2,
    color: "#18181b", // Sleek dark zinc
    summary: "Comparativa técnica formal entre mecanismos de Hardware (TSL) y mecanismos de Software (Semáforos).",
    content: `Matriz Comparativa de Mecanismos de Sincronización [Texto Guía]:\n\nCriterio: Nivel de Implementación\n- Test-and-Set: Nivel de Hardware (Instrucción de CPU y bus DPRAM).\n- Semáforos: Nivel de Software / Sistema Operativo (Microkernel).\n\nCriterio: Consumo de Recursos en Espera\n- Test-and-Set: Alto. Espera activa (Spinlock) consumiendo ciclos de procesador.\n- Semáforos: Cero. Suspensión de procesos (Sleep y Wakeup) cediendo la CPU.\n\nCriterio: Capacidad de Recursos\n- Test-and-Set: Solo 1 recurso (candado booleano 0 o 1).\n- Semáforos: Múltiples instancias (semáforos contadores de 0 a N).\n\nCriterio: Cola y Equidad\n- Test-and-Set: No garantiza orden de llegada (riesgo de inanición / Starvation).\n- Semáforos: Cola ordenada FIFO de hilos bloqueados (S.queue).\n\nCriterio: Riesgos Principales\n- Test-and-Set: Inversión de prioridades y saturación del bus.\n- Semáforos: Interbloqueos (Deadlocks) por programación errónea en wait/signal [2].`,
    tags: ["MATRIZ COMPARATIVA", "HARDWARE VS SOFTWARE", "ANÁLISIS COMPARATIVO", "ESPECIFICACIÓN"],
    citations: ["[2] Silberschatz et al. (2018)", "[3] Rinard (MIT 1998)"],
    Scene: TSLHardwareScene
  }
];
