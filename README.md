# Nutech-test

| NAMA | ALAMAT |
|---------------|---------------|
| Muhammad Rifqi Fadhilah | Rawamangun, Jakarta Timur|

## Deploy
Pada kesempatan kali ini saya melakukan deploy backend menggunakan render, dengan endpoint sebagai berikut:

https://nutech-test.onrender.com

## Design Database (DDL)

### Table User
```
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  password VARCHAR(255) NOT NULL,
  balance INTEGER NOT NULL DEFAULT 0,
  profile_image VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table Services

```
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  service_code VARCHAR(50) UNIQUE NOT NULL,
  service_name VARCHAR(100) NOT NULL,
  service_icon VARCHAR(255) NOT NULL,
  service_tariff INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table Banners

```
CREATE TABLE banners (
  id SERIAL PRIMARY KEY,
  banner_name VARCHAR(100) NOT NULL,
  banner_image VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table Transactions
```
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  service_id INTEGER,
  invoice_number VARCHAR(100) UNIQUE NOT NULL,
  transaction_type VARCHAR(50) NOT NULL,
  total_amount INTEGER NOT NULL,
  description VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT fk_user
    FOREIGN KEY(user_id) 
    REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_service
    FOREIGN KEY(service_id) 
    REFERENCES services(id)
    ON DELETE SET NULL 
);
```
