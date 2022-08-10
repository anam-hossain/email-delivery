# Email Delivery Gateway

A simple gateway to deliver emails.

## Features
- Multiple email providers to deliver emails in confidence. if one fails, email will be delivered using alternate provider.
- By default, email will be `queued` to deliver in background for better user experience
- A `cron` is running to monitor the email providers health for optimum performance
- A fail-safe mechanism is in place to deliver emails using an alternate provider if something goes wrong
- Unit and e2e tested

## Requirements

- [NEST CLI](https://docs.nestjs.com/cli/overview) (v9.0.0 - Optional - Required for dev environment)
- Node v16+ (v16.14.2)
- NPM 8+ (v8.5.0)
- TypeScript (v4.7.4 - optional)
- Redis (For queue and cache). A docker-compose file is provided to run it.
- Docker and Docker Compose

## Dev environment setup

1. Install `nest cli`
```bash
npm install -g @nestjs/cli
```
2. Create `.env` file in the repo directory
```bash
cp .env.dist .env
```

For sending email locally, please update the following `.env`.

```bash
SENDGRID_API_KEY=
MAILJET_API_KEY=
```

3. Install dependencies
```bash
npm install
```

4. Bring up the `Redis` cluster

```bash
docker-compose up -d
```

5. Finally, run the dev server

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Api reference

### Send email api

By default, all emails will be queued and process in the background.

```bash
curl --location --request POST 'http://localhost:3000/email/send' \
--header 'Content-Type: application/json' \
--data-raw '{
  "to": [
    {
      "email": "foo@bar.com",
      "name": "Foo"
    },
    {
      "email": "foobar@bar.com",
      "name": "Foo bar"
    }
  ],
  "cc": [
    {
      "email": "bar@baz.com",
      "name": "Bar"
    }
  ],
  "bcc": [
    {
      "email": "baz@foo.com",
      "name": "Baz"
    }
  ],
  "subject": "Email service",
  "from": {
    "email": "foo@bar.com",
    "name": "Foo"
  },
  "content": "Testing Email Service"
}'
```

### Send email directly
To avoid queueing the email, pass `queue=false` in the request body.

```bash
curl --location --request POST 'http://localhost:3000/email/send' \
--header 'Content-Type: application/json' \
--data-raw '{
  "to": [
    {
      "email": "foo@bar.com"
    }
  ],
  "subject": "Email service",
  "from": {
    "email": "foo@bar.com"
  },
  "content": "Testing Email Service",
  "queue": false
}'
```

### Health check

```bash
http://localhost:3000/email/healthcheck
```

### Postman collection

[https://www.getpostman.com/collections/8e8ff67fa843ba43cdac](https://www.getpostman.com/collections/8e8ff67fa843ba43cdac)

## Constraints

### Validation

- Due to time constraint, api does not verify the senders are unique.
For example, `to`, `cc` and `bcc` can have duplicate emails.
- Total number of recipients (to, cc, bcc) are not being limited. SendGrid allows up to 1000 whereas Mailjet allows only 50.

### Logging

Logging functionality not being implemented. The app utilising `console.log()` instead.

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```
## Demo

```
POST https://devtask.xyz/email/send
GET https://devtask.xyz/email/healthcheck
```
