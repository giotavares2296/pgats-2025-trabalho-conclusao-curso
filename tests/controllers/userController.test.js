const sinon = require("sinon");
const { expect } = require("chai");
const userController = require("../../rest/controllers/userController");
const userService = require("../../src/services/userService");

describe("Controller - User Login", () => {
  let req, res, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = { body: { email: "teste@email.com", password: "123456" } };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
  });

  afterEach(() => {
    sandbox.restore(); 
  });

  it("deve retornar 200 e o token quando login for válido", () => {
    sandbox.stub(userService, "authenticate").returns({ token: "fake-token" });

    userController.login(req, res);

    expect(res.json.calledWith({ token: "fake-token" })).to.be.true;
    expect(res.status.called).to.be.false;
  });

  it("deve retornar 401 quando login for inválido", () => {
    sandbox.stub(userService, "authenticate").returns(null);

    userController.login(req, res);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ error: "Credenciais inválidas" })).to.be.true;
  });
});
