# ONLINE DATABASE - FRONTEND
    - Used ReactJSX
    - This web site is a tool for database development, management, and administration.
    - Its allows you to create and execute queries, develop and debug stored routines, automate database object management,     analyze table data via an intuitive interface.
    - Web site delivers data and schema comparison and synchronization tools, database reporting tools, backup options with     scheduling, and much more.
    - Building, editing, and running queries get much simpler with the this following functionality:
        - login / logout / register
        - create / delete tables / modify
        - sort table content by filters
        - download table in csv format
    - Data security is guaranteed. Database design tools allow users to create a database diagram, objects  efficiently and     in a user-friendly interface.
    - In addition, it is possible to back up and restore databases to a file.

# GETTING STARTED && INSTALLING
    - clone in your PC this: https://github.com/mKolibri/frontend.git
    - npm ci
        # RUN FOR PRODUCTION MODE
            └── npm run prod
        # RUN FOR DEVELOPMENT MODE
            └── npm run dev


# PREREQUISITES
    - Can used with backend part: https://github.com/mKolibri/backend.git

# BUILT WITH
    - Eslint
    - Bootstrap
    - npm
    - cookies

# VERSIONING
    This web site has only 1 version.

# AUTHORS
    - Mane Antonyan - https://github.com/mKolibri

# PROJECT SCHEMA
    /frontend
        ├── package.json- The list of node dependencies which are needed.
        ├── package-lock.json
        ├── public
        │   └── index.html- Entry point. The first readable module, and follows from it to other modules to compile them.
        ├── README.md
        └── src- Anything that is used when the app is compiled
            ├── app.jsx- File for main component in React which acts as a container for all other components.
            ├── components - All components in app, css files
            │   ├── configs- Configuration files
            │   │   └── config.jsx
            │   ├── table- Table-components
            │   │   ├── addTable- // SddTable-component and css file
            │   │   │   ├── addTable.jsx
            │   │   │   └── addTable.module.css
            │   │   ├── showTable- // ShowTable-component and css file
            │   │   │   ├── showTable.jsx
            │   │   │   └── showTable.module.css
            │   │   ├── addValues- // addValues-component and css file
            │   │   │   ├── addValues.jsx
            │   │   │   └── addValues.module.css
            │   │   ├── tables- // Tables-component and css file
            │   │   │   ├── table.module.css
            │   │   │   └── tables.jsx
            │   │   ├── updateTableInfo- // ipdateTableInfo-component and css file
            │   │   │   ├── updateTableInfo.jsx
            │   │   │   └── updateTableInfo.module.css
            │   │   └── table.dao.jsx- Fetch functions for table-components
            │   ├── user- User-components
            │   │   ├── home- // Home-component and css file
            │   │   │   ├── home.jsx
            │   │   │   └── home.module.css
            │   │   ├── login- // Login-component and css file
            │   │   │   ├── login.jsx
            │   │   │   └── login.module.css
            │   │   ├── registry- // Registration-component and css file
            │   │   │   ├── registry.jsx
            │   │   │   └── registry.module.css
            │   │   └── user.dao.jsx- Fetch functions for user-components
            │   └── warnings- Warnings and error components and css files
            │       ├── alert.jsx
            │       ├── alert.module.css
            │       ├── warning.jsx
            │       └── warning.module.css
            └── index.js- The javascript file corresponding to index.html.

# ACKNOWLEDGMENT
    - special for Instigate mobile.