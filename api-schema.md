# API Specifications

### `GET /loans`

Returns a list of all loans in the system.

#### Filters

* `loanType`: filter by loan type, e.g. `/loans?loanType=CAR`

#### Successful Response Schema

```ts
{
    outcome: 'SUCCESS',
    loans: Array<{
        id: string,
        applicantName: string,
        loanAmount: number, // between 0 and 100000
        loanType: 'CAR' | 'PERSONAL',
        income: number,
        interestRate: number,
        loanTerm: number, //int
        monthlyPayment: number
    }>
}
```

#### Response Schema with failed outcomes

```ts
{
    error: 'INVALID_QUERY_PARAMETER'
}
```

### `GET /loans/:id`

Returns a loan by id.

#### Successful Response Schema

```ts
{
    outcome: 'SUCCESS',
    loan: {
        id: string,
        applicantName: string,
        loanAmount: number,
        loanType: 'CAR' | 'PERSONAL',
        income: number,
        interestRate: number,
        loanTerm: number,
        monthlyPayment: number
    }
}
```

#### Response Schema with failed outcome

```ts
{
    error: 'INVALID_URL_PARAMETER'
}
| {
    outcome: 'LOAN_NOT_FOUND'
}
```

### `POST /loans`

Creates a new loan application

#### Request Schema

```ts
{
    id: string,
    applicantName: string,
    loanAmount: number, 
    loanType: 'CAR' | 'PERSONAL',
    income: number,
    interestRate: number,
    loanTerm: number,
}
```

#### Successful Response Schema

```ts
{
    outcome: 'SUCCESS';
    loans: Array<{
        id: string,
        applicantName: string,
        loanAmount: number, 
        loanType: 'CAR' | 'PERSONAL',
        income: number,
        interestRate: number,
        loanTerm: number,
        monthlyPayment: number
    }>
}
```

#### Response Schema with failed outcome

```ts
{
    error: 'INVALID_REQUEST_PAYLOAD'
}
| {
    outcome: 'LOAN_ALREADY_EXISTED'
}
```

### `UPDATE /loans/:id`

Update a existing loan application by the given id and updated loan payload

#### Request Schema

```ts
{
    applicantName: string,
    loanAmount: number, 
    loanType: 'CAR' | 'PERSONAL',
    income: number,
    interestRate: number,
    loanTerm: number,
}
```

#### Successful Response Schema

```ts
{
    outcome: 'SUCCESS';
    loans: Array<{
        id: string,
        applicantName: string,
        loanAmount: number, 
        loanType: 'CAR' | 'PERSONAL',
        income: number,
        interestRate: number,
        loanTerm: number,
        monthlyPayment: number
    }>
}
```

#### Response Schema with failed outcome

```ts
{
    error: 'INVALID_REQUEST_PAYLOAD'
}
| {
    error: 'INVALID_URL_PARAMETER'
}
| {
    outcome: 'NO_MATCHING_LOAN'
}
```

### `DELETE /loans/:id`

Delete a loan application by id

#### Successful Response Schema

```ts
{
    outcome: 'SUCCESS';
    loans: Array<{
        id: string,
        applicantName: string,
        loanAmount: number, 
        loanType: 'CAR' | 'PERSONAL',
        income: number,
        interestRate: number,
        loanTerm: number,
        monthlyPayment: number
    }>
}
```

#### Response Schema with failed outcome

```ts
{
    error: 'INVALID_URL_PARAMETER'
}
| {
    outcome: 'NO_MATCHING_LOAN'
}
```