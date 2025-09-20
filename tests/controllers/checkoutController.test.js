const sinon = require("sinon");
const { expect } = require("chai");
const checkoutController = require("../../rest/controllers/checkoutController");
const checkoutService = require("../../src/services/checkoutService");
const userService = require("../../src/services/userService");

describe("Controller - Checkout", () => {
  let req, res, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      headers: { authorization: "Bearer fake-token" },
      body: {
        items: [{ productId: 1, quantity: 2 }],
        freight: 10,
        paymentMethod: "boleto",
      },
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("deve retornar 200 e resultado do checkout quando token válido", () => {
    sandbox.stub(userService, "verifyToken").returns({ id: 1 });
    sandbox.stub(checkoutService, "checkout").returns({
      userId: 1,
      items: req.body.items,
      freight: 10,
      paymentMethod: "boleto",
      total: 210,
    });

    checkoutController.checkout(req, res);

    expect(res.json.calledWithMatch({ valorFinal: 210, userId: 1 })).to.be.true;
  });

  it("deve retornar 401 quando token inválido", () => {
    sandbox.stub(userService, "verifyToken").returns(null);

    checkoutController.checkout(req, res);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ error: "Token inválido" })).to.be.true;
  });

  it("deve retornar 400 quando checkout lançar erro", () => {
    sandbox.stub(userService, "verifyToken").returns({ id: 1 });
    sandbox.stub(checkoutService, "checkout").throws(new Error("Erro no checkout"));

    checkoutController.checkout(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith({ error: "Erro no checkout" })).to.be.true;
  });
});
