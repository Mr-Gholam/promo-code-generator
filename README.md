
## Environment valuables

```toml
PORT = "Write your port here"
jwtSecretKey = "Write your secret key here"
databaseUrl = "Write your mongodb url here"
  
```

## Installation


```bash
  npm install 
```

## Development

```bash
  npm  run dev 
```

## Test 

```bash
  npm run test
```
## Authorization

```http
  POST /create-token
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. Email address |

You get your unique token in response. You need to set it in your header for the rest of the requests as you can see in example blew. 

```http
  Authorization : "Bearer your token"
```


## API Reference



#### Create a referral link 
```http
  POST /create-link
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userId` | `string` | **Required**. User Id |


#### Get a referral link 

```http
  POST /get-link
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userId`      | `string` | **Required**. User Id |



#### Get a promo code

```http
  POST /create-promo
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userId`      | `string` | **Required**. User Id |



#### Check a promo code

```http
  POST /check-promo
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `promo`      | `string` | **Required**. Promo Code |