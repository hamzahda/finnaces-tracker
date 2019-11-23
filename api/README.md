
## Scripts
The Backend runs on port 8080 and here is the available scripts </br>
- `npm run build` </br>
* `npm run test` </br>
- `npm run server`</br>


## Transaction Routes

- Get all Transactions :<br/>
GET localhost/api/transaction/ 
- Create a Transaction : <br/>
POST localhost/api/transaction/ 
- Get a Transation <br/>
GET localhost/api/transaction/transactionId 
- Delete a Transaction <br/>
DELETE localhost/api/transaction/transactionId 
- Update a Transtion <br/> 
UPDATE localhost/api/transaction/transactionId 

## User Routes

- Get all Users : <br/>
GET localhost/api/user/ 
- Create a User : <br/>
POST localhost/api/user/ 
- Login <br/> 
GET localhost/api/transaction/token 

## Tag Routes

- Get all Transactions : <br/>
GET localhost/api/tag/ 
- Create a Transaction : <br/>
POST localhost/api/tag/ 
- Get a Transation <br/>
GET localhost/api/tag/tagId 
- Delete a Transaction <br/>
DELETE localhost/api/tag/tagId 
- Update a Transtion <br/>
UPDATE localhost/api/tag/tagId 

## Transaction-Tag Routes

- Delete a Transaction <br/> 
DELETE localhost/api/transation/transactionId/tag/tagId 
- Update a Transtion <br/>
UPDATE localhost/api/transation/transactionId/tag/tagId

