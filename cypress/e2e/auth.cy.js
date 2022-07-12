import Chance from "chance";
const chance = new Chance();

describe("auth test", () => {
    const EMAIL = chance.email();
    const USERNAME = chance.word({
        length: chance.integer({ min: 6, max: 17 }),
    });
    const PASS = chance.hash({ length: chance.integer({ min: 9, max: 29 }) });

    it("register", () => {
        cy.visit("/register");

        cy.register(EMAIL, USERNAME, PASS);
    });

    it("login", () => {
        cy.visit("/login");

        cy.login(EMAIL, PASS);
    });
});
