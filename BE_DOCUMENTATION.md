# MAKING A BACKEND USING NODEJS + EXPRESSJS

1. install node package
   ```
   npm init -y
   ```
2. install packages, express and nodemon

   ```
    npm install express
    npm install --save-dev nodemon

   // Typescript
    npm install typescript ts-node-dev --save-dev.
    npm install @types/express @types/node --save-dev
    npx tsc --init
   ```

3. create a file index.ts inside src folder

4. the suggested folder structure:
   my-backend/
   ├─ src/
   │ ├─ index.ts
   │ ├─ routes/
   │ │ └─ users.ts
   │ └─ controllers/
   │ └─ userController.ts
   ├─ package.json
   └─ tsconfig.json

5. then inside the index.ts, add the basic code for express server in typescript

```
    import express, { Request, Response } from 'express';

    const app = express();
    const PORT = process.env.PORT || 3000;

    // Middleware
    app.use(express.json());

    // Test route
    app.get('/', (req: Request, res: Response) => {
    res.send('Hello World from TypeScript + Express!');
    });

    // Start server
    app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    });
```

- app -> is the main express server.
- app.use -> is use for express to use json()
- app.get -> is use for getting the response and request to server.

  - request -> from client
  - response -> server to client

    ```res.send() // send a response

    ```

- app.listen -> the server listen to PORT

  ```app.listest(POST, ()=> {[function]})

  ```

## CREATING CONTROLLER AND ROUTES

1. import Request and Response from express

   ```
   import {Request, Response} from 'express'
   ```

2. make a Get function, where you can fetch or get data from database

   ```
   export const getUsers = (req: Request, res: Response) => {
       res.json([
           {id: 1, name: 'Alice'},
           {id: 2, name: 'Bob'}
       ])
   }
   ```

   - res.json -> is where the data will pass using json format

3. After creating controller you need a routes to call the controller, first import Router from express, then import the getUsers from userController.

```
import {Router} from 'express'
import {getUsers} from 'controller/userController directory'

```

4. setup the router

```
const router = Router();
```

5. setup the get route

```
router.get('/', getusers);
```

6. export the router

```
export default router
```

7. Then in index.ts, call the users route, import from routes then call it.

```
app.use('/users', userRoutes)
```

## SETUP THE PACKAGE JSON

1. Enter the code below, no need to memorize becuase its the common transpiler of node js in typescript.

```
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}
```

## DATABASE (ORM PRISMA + POSTGRESQL)

1. Install PostgrelSQL
   ```
    brew install postgresql
    brew services start postgresql
   ```
2. Install Primsa in backend

```
    cd backend
    npm install prisma --save-dev
    npm install @prisma/client

```

3. run npx prisma init, to initialize the prisma to your backend
   - in prisma/schema.prisma -> create a model for each field.
   - go to .env then open supabase in browser
     - DATABASE_URL -> session pooler
     - DIRECT_URL -> transanction pooler
   - run 'npx prisma generate'
   - run 'npx prisma db push'
