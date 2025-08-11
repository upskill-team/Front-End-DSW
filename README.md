# Proyecto Frontend - UpSkill Courses Website

## 1. Introducción

Este espacio contiene todo el código fuente de la interfaz de usuario. El objetivo de este documento es establecer un marco de trabajo claro y organizado que nos permita colaborar de manera eficiente, mantener la calidad del código y agilizar el proceso de desarrollo. A medida que avance el proyecto se añadirán secciones para suplir los requisitos solicitados.

---

## 2. Organización y Flujo de Trabajo (Git Workflow)

Para mantener el orden y la estabilidad del código, utilizaremos un flujo de trabajo basado en ramas. Este sistema asegura que la rama principal (`main`) siempre contenga una versión estable y lista para producción, mientras que el desarrollo se realiza de forma aislada y segura.

### Ramas Principales

Existen dos ramas principales:

- `main`: Esta rama es el reflejo fiel del código en **producción**. Nadie debe hacer `push` directamente a esta rama. El código solo llega a `main` a través de Pull Requests desde la rama `develop`, una vez que una versión ha sido probada y está lista para ser lanzada.
- `develop`: Esta es nuestra rama de **integración y desarrollo**. Es la rama principal de trabajo. Todas las nuevas funcionalidades y correcciones se fusionan aquí. Sirve como la base para el trabajo diario y siempre debe contener los últimos cambios aprobados. **Esta es la rama por defecto del repositorio.**

### Flujo de Trabajo Básico

El ciclo de vida de cualquier cambio en el código es el siguiente:

1.  **Sincronizar:** Antes de empezar cualquier tarea, asegúrate de tener la última versión de la rama `develop`.
    ```bash
    git checkout develop
    git pull origin develop
    ```
2.  **Crear Rama de Soporte:** Crea una nueva rama a partir de `develop` siguiendo la nomenclatura especificada más abajo.
3.  **Desarrollar:** Realiza tus cambios, haciendo commits pequeños y descriptivos.
4.  **Publicar (`Push`):** Sube tu rama a GitHub.
    ```bash
    git push -u origin nombre-de-tu-rama
    ```
5.  **Pull Request (PR) Automático:** Al hacer `push`, una GitHub Action creará automáticamente un Pull Request dirigido a `develop`.
6.  **Revisión de Código:** El resto del equipo revisará el código, dejará comentarios y finalmente lo aprobará. Se requiere al menos **una aprobación** para poder continuar. En general, la Pull Request no deberia ser aprobada por la misma persona que la solicito.
7.  **Fusión (`Merge`):** Una vez aprobado, el PR se fusiona en `develop`. Tu trabajo ya es parte de la línea principal de desarrollo.

---

## 3. Nomenclatura de Ramas de Soporte

Para mantener un historial claro y legible, es **obligatorio** nombrar las ramas de soporte utilizando los siguientes prefijos. Esto, además, es necesario para que la automatización de Pull Requests funcione correctamente.

| Prefijo de Rama                     | Propósito                                                                            | Ejemplo                          | ¿Cuándo crearla?                                                                             |
| ----------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------- | -------------------------------------------------------------------------------------------- |
| **`feature/`**                      | Para desarrollar una **nueva funcionalidad** o una nueva sección del proyecto.       | `feature/login-form`             | Al iniciar el desarrollo de una nueva característica que no existe en la aplicación.         |
| **`bugfix/`**                       | Para corregir un **error (bug)** que existe en la rama `develop`.                    | `bugfix/header-alignment-mobile` | Cuando se ha identificado un error en el código existente que necesita ser solucionado.      |
| **`hotfix/`** _(Raro - No auto PR)_ | Para corregir un **error crítico en `main` (producción)**. **Se crea desde `main`.** | `hotfix/critical-payment-error`  | **SOLO** cuando hay un bug urgente en producción que no puede esperar al próximo ciclo.      |
| **`refactor/`** _(Opc.)_            | Para mejorar código existente sin añadir nueva funcionalidad ni corregir un bug.     | `refactor/optimize-api-calls`    | Cuando se va a reestructurar una parte del código para mejorar su rendimiento o legibilidad. |

---

## 4. Guía Rápida de Comandos

```bash
# 1. Asegurarse de estar en develop y tener la última versión
git checkout develop
git pull

# 2. Crear una nueva rama para una nueva funcionalidad
git checkout -b feature/user-profile

# 3. Trabajar y hacer commits
# ... (haces cambios en el código) ...
git add .
git commit -m "feat: Add basic structure for user profile page"

# 4. Subir la rama a GitHub (esto creará el PR automáticamente)
git push -u origin feature/user-profile
```
