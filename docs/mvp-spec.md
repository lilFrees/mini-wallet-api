I'd go with a **mini wallet API**: a small money-transfer backend. It takes about 1–2 weeks after the course, uses everything you're learning in NestJS, and covers the banking topics TBC will ask about. You can build it again in Go later as practice, since you'll already know the problem well.

**Features**

- Sign up and log in with JWT
- Each user gets a wallet with a balance; amounts are stored in tiyin as integers, never floats
- Top up (a fake deposit)
- Transfer money to another user by email or phone
- Transaction history with pagination
- Transfers can't overdraw, and sending the same request twice doesn't send money twice

**Tables (4)**

- `users`: id, email, password_hash, name
- `wallets`: id, user_id, balance (BIGINT), currency, version
- `transactions`: id, from_wallet, to_wallet, amount, type (topup/transfer), status, created_at
- `idempotency_keys`: key, user_id, response, created_at

**Endpoints (about 7)**

- `POST /auth/signup`, `POST /auth/login`
- `GET /wallet`: your balance
- `POST /wallet/topup`
- `POST /transfers` with an `Idempotency-Key` header
- `GET /transactions?cursor=`
- `GET /transactions/:id`

**The part that matters: the transfer**
Do it in one database transaction:

1. Lock both wallets with `SELECT ... FOR UPDATE`, always in the same order (for example, lowest id first) so two opposite transfers can't deadlock
2. Check the sender has enough balance
3. Subtract from one wallet, add to the other, and insert the transaction row
4. Commit, or roll back if anything fails

**What "done" looks like**

- `docker compose up` starts the API and Postgres
- Validation with DTOs and `class-validator`
- Tests, including one that fires 50 transfers at once from the same wallet and checks the balance never goes negative and the totals still add up
- A README explaining how you prevent double spending and deadlocks
