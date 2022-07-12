import Chance from "chance";
const chance = new Chance();

describe("problem", () => {
    const EMAIL = chance.email();
    const USERNAME = chance.word({
        length: chance.integer({ min: 6, max: 17 }),
    });
    const PASS = chance.hash({ length: chance.integer({ min: 9, max: 29 }) });

    const LANG_TESTS = {
        Python: {
            wrong: 'print("Hello world")',
            good: 'print(sum(map(int, input().split(" "))))',
            timeout: "import time; time.sleep(10)",
        },
    };

    before(() => {
        cy.visit("/register");
        cy.register(EMAIL, USERNAME, PASS);
        cy.visit("/login");
        cy.login(EMAIL, PASS);
    });

    it("search", () => {
        cy.visit("/problems");

        // both tasks should be visible
        cy.contains("Test").should("be.visible");
        cy.contains("SEARCH").should("be.visible");

        // search
        cy.get('input[placeholder="Search"]').type("SEARCH");
        cy.contains("Test").should("not.exist");
        cy.contains("SEARCH").should("be.visible");

        // empty search field and check if test is visible again
        cy.get('input[placeholder="Search"]').clear();
        cy.contains("Test").should("be.visible");
    });

    it("sort", () => {
        cy.visit("/problems");
        cy.wait(2000);

        // Sort from smallest
        const idButton = cy.contains("button", "Id");
        idButton.should("be.visible");
        idButton.click();

        // Get first id
        cy.get("tbody")
            .children()
            .first()
            .first()
            .children()
            .first()
            .then(($before) => {
                const before = $before.text();

                // Change order
                cy.contains("button", "Id").click();

                cy.get("tbody")
                    .children()
                    .first()
                    .first()
                    .children()
                    .first()
                    .then(($after) => {
                        const after = $after.text();

                        // expect second to be greater
                        expect(
                            parseInt(after),
                            "Should be inverted"
                        ).to.be.greaterThan(parseInt(before));
                    });
            });
    });

    for (let lang of Object.keys(LANG_TESTS)) {
        const CODE = LANG_TESTS[lang];
        it("submit-" + lang, () => {
            cy.visit("/login");
            cy.login(EMAIL, PASS);
            cy.visit("/problems");

            // click and wait to load
            cy.get('a[type="button"]').first().click();
            cy.location("pathname", { timeout: 60000 }).should(
                "include",
                "/problem/"
            );

            // wait to load
            cy.contains("CI/CD Test", { timeout: 10000 }).should("be.visible");

            // check if it is rendering correctly
            cy.contains("MEMORY LIMIT").should("be.visible");
            cy.contains("TIME LIMIT").should("be.visible");

            cy.get(".__Latex__").first().should("be.visible");

            // ...tabs
            cy.contains("button", "View").should("be.visible");
            cy.contains("button", "Submit").should("be.visible");
            cy.contains("button", "My Submissions").should("be.visible");

            // go to submissions tab
            cy.contains("button", "Submit").click();
            cy.contains("Submit solution").should("be.visible");

            // WRONG CODE
            cy.get("textarea").first().type(CODE.wrong);
            cy.get('input[type="search"]').click();

            // lang option should be visible
            cy.contains(lang).should("be.visible");
            cy.contains(lang).click();

            cy.get('button[type="submit"]').click();

            // GOOD CODE
            cy.get("textarea").first().clear();
            cy.get("textarea").first().type(CODE.good);

            cy.get('button[type="submit"]').click();

            // TIMEOUT CODE
            cy.get("textarea").first().clear();
            cy.get("textarea").first().type(CODE.timeout);

            cy.get('button[type="submit"]').click();

            // go to my submissions
            cy.contains("button", "My Submissions").click();

            // check if there are tested and pending solutions
            cy.contains("span", "TESTED").should("be.visible");
            cy.contains("span", "PENDING").should("be.visible");

            // check if there are good and bad solutions
            cy.contains("span", "0%").should("be.visible");
            cy.contains("span", "100%").should("be.visible");

            // check details
            cy.contains("span", "0%")
                .parent()
                .parent()
                .parent()
                .parent()
                .parent()
                .click();

            // source code
            cy.contains("button", "Show source code").should("be.visible");
            cy.contains("button", "Show source code").click();

            cy.contains("div", CODE.wrong).should("be.visible");
            cy.get('div[role="dialog"] button').first().click();

            cy.contains("span", "WRONG ANSWER").should("be.visible");

            // wait for timeout solution to be checked
            cy.wait(30000);

            cy.contains("button", "Refresh").click();
            cy.contains("span", "PENDING").should("not.exist");
        });
    }
});
