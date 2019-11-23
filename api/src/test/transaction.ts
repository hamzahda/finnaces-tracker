import { createConnection } from "typeorm";
/** Package imports */
import chai from "chai";
import chaiHttp from "chai-http";
import { Transaction } from "../entity/Transaction";

/** Chai plugins */
chai.use(chaiHttp);
chai.should();

/** Variables */
const baseUrl: string = `${process.env.API_HOST}:${process.env.API_PORT}`;

/** Tests */
describe("Testing transactions", () => {
  /** Clear transaction table before each test to have a clean start */
  beforeEach(async () => {
    console.log("Cleaning");
    const connection = await createConnection();
    await connection.dropDatabase();
    await connection.synchronize();
    await connection.close();
  });

  /** Test get all transactions */
  it("should GET all transactions (empty array)", async () => {
    const response = await chai.request(baseUrl).get("/api/transaction");
    response.should.have.status(200);
    response.body.should.include.key("data");
    response.body.data.should.be.a("array");
    response.body.data.length.should.be.eql(0);
  });

  /** Test delete transaction */
  it("should DELETE a transaction by id", async () => {
    const testTransaction: Partial<Transaction> = {
      name: "Test",
      value: 1000,
      type: "expense"
    };

    const createResponse = await chai
      .request(baseUrl)
      .post("/api/transaction")
      .send(testTransaction);
    createResponse.should.have.status(200);
    createResponse.body.data.should.include.key("name");
    createResponse.body.data.name.should.be.eql("Test");
    const createdTransaction: Transaction = createResponse.body.data;

    const deleteResponse = await chai
      .request(baseUrl)
      .delete("/api/transaction/" + createdTransaction.id);
    deleteResponse.should.have.status(200);
  });

  /** Test get transaction by id */
  it("should GET a transaction by id", async () => {
    const testTransaction: Partial<Transaction> = {
      name: "Test",
      value: 1000,
      type: "expense"
    };

    const createResponse = await chai
      .request(baseUrl)
      .post("/api/transaction")
      .send(testTransaction);
    createResponse.should.have.status(200);
    const createdTransaction: Transaction = createResponse.body.data;

    const getResponse = await chai
      .request(baseUrl)
      .get("/api/transaction/" + createdTransaction.id);
    getResponse.should.have.status(200);
    getResponse.body.should.include.key("data");
    getResponse.body.data.should.be.a("object");
    getResponse.body.data.should.have.property("name");
    getResponse.body.data.should.have.property("value");
    getResponse.body.data.should.have.property("type");
    getResponse.body.data.should.have.property("id").eql(createdTransaction.id);
  });

  /** Test create transaction */
  it("should not create an invalid transaction", async () => {
    const testTransaction: Partial<Transaction> = {
      name: "Test"
    };

    const createResponse = await chai
      .request(baseUrl)
      .post("/api/transaction")
      .send(testTransaction);
    createResponse.should.have.status(400);
  });

  it("should create a valid transaction", async () => {
    const testTransaction: Partial<Transaction> = {
      name: "Test",
      value: 1000,
      type: "expense"
    };

    const createResponse = await chai
      .request(baseUrl)
      .post("/api/transaction")
      .send(testTransaction);

    createResponse.should.have.status(200);
    createResponse.body.data.should.include.key("name");
    createResponse.body.data.name.should.be.eql(testTransaction.name);
    createResponse.body.data.should.include.key("value");
    createResponse.body.data.value.should.be.eql(testTransaction.value);
    createResponse.body.data.should.include.key("type");
    createResponse.body.data.type.should.be.eql(testTransaction.type);
  });

  /** Test patch transaction */
  it("should update (patch) a transaction by id", async () => {
    const testTransaction: Partial<Transaction> = {
      name: "Test",
      value: 1000,
      type: "expense"
    };

    const createResponse = await chai
      .request(baseUrl)
      .post("/api/transaction")
      .send(testTransaction);
    createResponse.should.have.status(200);
    createResponse.body.data.should.include.key("name");
    createResponse.body.data.name.should.be.eql("Test");
    const createdTransaction: Transaction = createResponse.body.data;

    const updatedTransaction: Partial<Transaction> = {
      name: "Changed Name",
      value: 500,
      type: "income"
    };

    const updateResponse = await chai
      .request(baseUrl)
      .patch("/api/transaction/" + createdTransaction.id)
      .send(updatedTransaction);
    updateResponse.should.have.status(200);
    updateResponse.body.data.should.include.key("name");
    updateResponse.body.data.name.should.be.eql(updatedTransaction.name);
    updateResponse.body.data.should.include.key("value");
    updateResponse.body.data.value.should.be.eql(updatedTransaction.value);
    updateResponse.body.data.should.include.key("type");
    updateResponse.body.data.type.should.be.eql(updatedTransaction.type);
  });
});
