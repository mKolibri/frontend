# frontend
React

# how to install and run APP
npm ci

# development mode
npm run prod

# production mode
npm install -g serve
npm run dev

# project schema
../frontend
├── package.json
├── package-lock.json
├── public
│   └── index.html
├── README.md
└── src
    ├── app.jsx
    ├── components
    │   ├── components.dao.jsx
    │   ├── configs
    │   │   └── config.jsx
    │   ├── login
    │   │   ├── login.dao.jsx
    │   │   ├── login.jsx
    │   │   └── login.module.css
    │   ├── profile
    │   │   ├── addTable
    │   │   │   ├── addTable.dao.jsx
    │   │   │   ├── addTable.jsx
    │   │   │   └── addTable.module.css
    │   │   ├── home
    │   │   │   ├── home.dao.jsx
    │   │   │   ├── home.jsx
    │   │   │   └── home.module.css
    │   │   ├── showTable
    │   │   │   ├── showTable.dao.jsx
    │   │   │   ├── showTable.jsx
    │   │   │   └── showTable.module.css
    │   │   └── tables
    │   │       ├── table.dao.jsx
    │   │       ├── table.module.css
    │   │       └── tables.jsx
    │   ├── registry
    │   │   ├── registry.dao.jsx
    │   │   ├── registry.jsx
    │   │   └── registry.module.css
    │   └── warnings
    │       ├── alert.jsx
    │       ├── alert.module.css
    │       ├── warning.jsx
    │       └── warning.module.css
    └── index.js