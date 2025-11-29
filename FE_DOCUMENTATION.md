# USE QUERY

## SETUP

1.  install useQuery
    ```
    npm install @tanstack/react-query
    ```
2.  create a QueryClient
    ```
    export const queryClient = new QueryClient({
    defaultOptions: {
    	queries: {
    		staleTime: 1000 * 60, // 1 minute
    		gcTime: 1000 * 60 * 5, // 5 minutes
    		refetchOnWindowFocus: true,
    	},
    },
    });
    ```
3.  then above the SessionProvider put the QueryClientProvider, provided the client value
    ```
    <SessionProvider>
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    </SessionProvider>
    ```
4.  Create a fetcher utility

    ```
    export async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
        const res = await fetch(url, {
            ...options,
            headers: {
            "Content-Type": "application/json",
            ...(options?.headers || {}),
            },
        });

        if (!res.ok) throw new Error(`Error: ${res.status}`);

        return res.json();
    }

    // option -> "GET", "POST", "PUT", "PATCH", "DELETE"
    ```

## FETCHING DATA

1. make an api that GET tha data from the database,
2. in frontend import the useQuery first and your fetcher utility
3. then create a useQuery calling the data

```
    const { data, isLoading, error } = useQuery<Job[]>({
        queryKey: ["jobs"],
        queryFn: () => fetcher("/api/jobs"),
    });

    // data -> the data from your database
    // isLoading -> process of getting the data from db
    // error -> when fetching is not successful
```

## ADD NEW DATA MUTATION

1. Create api POST for creation of new data.
2. Create a mutation in client side

```
    const createJobMutation = useMutation({
        mutationFn: (newJob: Partial<Job>) =>
            fetcher<Job>("/api/jobs", {
            method: "POST",
            body: JSON.stringify(newJob),
            }),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
        },
    });
```

then in the handleSubmit btn

```
    createJobMutation.mutate({
        title: "Full Stack Dev",
        status: "APPLIED",
    });
```

## UPDATE DATA MUTATION

1. Create an api PUT or PATCH
2. create a mutation in client side

```
    const updateJobMutation = useMutation({
        mutationFn: (job: Job) =>
            fetcher<Job>(`/api/jobs/${job.id}s`, {
            method: "PATCH",
            body: JSON.stringify(job),
            }),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
        },
    });
```

then in the handleUpdateBtn

```
    updateJobMutation.mutate({
        id: "1",
        title: "React Developer",
        status: "INTERVIEWING",
    });

```

## DELETE DATA MUTATION

1. Create an api DELETE
2. setup the mutation in client side

```
    const deleteJobMutation = useMutation({
        mutationFn: (id: string) =>
            fetcher(`/api/jobs/${id}`, {
            method: "DELETE",
            }),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
        },
    });

```

then in the deleteBtn

```
    deleteJobMutation.mutate(id)
```

## USING SUPABASE AUTHENTICATION

### FRONTEND

1. Install the npm packages

```
    npm install @supabase/supabase-js

```

2.  create /lib/supabase.ts and put this code.

```
    import { createClient } from '@supabase/supabase-js';

    export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
```

- dont forget to provide a SUPABASE URL and SUPABASE ANON KEY
- **SUPABASE_URL**-> Project > Settings > Data API -> get the Project URL
- **SUPABASE_ANNON** -> Project > Settings > API Keys -> Legacy anon, service_role API keys -> get anon public

3. In your sign-up form handlesubmit, you can use this code that sends data to supabase and saves it

```
    const { data, error } = await supabase.auth.signUp({
    email: 'john@example.com',
    password: 'password123',
    });
```

- You can also add fields like

  - display name
  - phone

- one the sign-up push through, supabase will send you to verify email address
  note: invalid email address provider cannot register.

4. In your sign-up button you can use this code:

```
    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'john@example.com',
        password: 'password123',
    });
```

- What You Get After Login
  **Supabase stores:**

  1.  access_token (JWT)
  2.  refresh_token
  3.  user session inside the browser automatically

5. To send token to your backend you can use:

```
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    // then send the token to your backend

    fetch("http://localhost:5000/api/jobs", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

```

### BACKEND

6. In backend example nodejs. Install these packages
   ```
    npm install jsonwebtoken jwk-to-pem
   ```

- use supabase jwk to verify your token, the key should be look like this
  https://<PROJECT_REF>.supabase.co/auth/v1/.well-known/jwks.json

7. You can use this code for youyr authMiddleware.ts

   ```
        import { NextFunction, Request, Response } from 'express';
        import jwt from 'jsonwebtoken';
        import jwkToPem from 'jwk-to-pem';


        let JWKS: any = null;

        async function getJWKS() {
        if (!JWKS) {
        const res = await fetch(process.env.SUPABASE_JWKS_URL!);
        JWKS = await res.json();
        }
        return JWKS;
        }

        export const verifySupabaseToken = async (
        req: any,
        res: Response,
        next: NextFunction
        ) => {
        try {
        const header = req.headers.authorization;

        if (!header || !header.startsWith('Bearer '))
        return res.status(401).json({ message: 'No token' });

        const token = header.split(' ')[1];

        const jwks = await getJWKS();

        const jwtHeader = JSON.parse(
        Buffer.from(token.split('.')[0], 'base64').toString()
        );

        const jwk = jwks.keys.find((k: any) => k.kid === jwtHeader.kid);
        const pem = jwkToPem(jwk);

        const decoded = jwt.verify(token, pem) as any;

        req.user = { id: decoded.sub };

        next();
        } catch (err) {
        return res.status(401).json({ message: 'Token invalid' });
        }


        };
   ```

8. then create a route to test

```
    import express from "express";
    mport { verifySupabaseToken } from "./middleware/auth";

    const router = express.Router();

    router.get("/jobs", verifySupabaseToken, async (req, res) => {
    res.json({
        message: "User authenticated!",
        userId: req.user.id,
    });
    });

    export default router;
```
