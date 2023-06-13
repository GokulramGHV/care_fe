import { cy, describe, it, afterEach } from "local-cypress";
import { v4 as uuidv4 } from "uuid";
import * as users from "../../fixtures/credentials.json";

const genRandomNumber = (length: number) => {
  return parseInt((Math.random() * 10 ** length).toString());
};

describe("Asset Creation", () => {
  users.forEach((user) => {
    it(`Create as ${user.username}`, () => {
      // Login with credentials
      cy.loginByApi(user.username, user.password);
      cy.saveLocalStorage();
      cy.restoreLocalStorage();
      cy.awaitUrl("/");

      cy.get("#facility-details").click({ force: true });
      cy.get("#manage-facility-dropdown").click();
      cy.contains("Location Management").click();
      cy.contains("Add New Location").click();
      cy.get("[name='name']").type(`Test Location ${genRandomNumber(5)}`);
      cy.get("textarea[name='description']").type("Test Description");
      cy.get("button").contains("Add Location").click();
      cy.verifyNotification("Location created successfully");
      cy.get("[data-cy=back-button]").click();
      cy.get("#manage-facility-dropdown").click();
      cy.contains("Create Asset").click();
      cy.get("[name='name']").type("New Test Asset");
      cy.get("#location").type("Test Location{enter}");
      cy.get("#asset-type").click();
      cy.get("[data-cy=asset-type-0]").click();
      cy.get("#asset-class").click();
      cy.get("[data-cy=asset-class-1]").click();
      cy.get("#asset-description").type("Test Description");
      cy.get("[data-cy=is_working-0]").click();
      const qr_id = uuidv4();
      cy.get("#qr_code_id").type(qr_id);
      cy.get("#manufacturer").type("Manufacturer's Name");
      cy.get("#support-name").type("Customer Support's Name");
      cy.get("#support-email").type("email@support.com");
      cy.get("#vendor-name").type("Vendor's Name");
      const serial_no = genRandomNumber(10);
      cy.get("#serial-number").type(serial_no);
      cy.get("#WarrantyAMCExpiry").type("2025-12-25");
      cy.get("#last_serviced_on").type("2021-12-25");
      const phone_number = "9" + genRandomNumber(9);
      cy.get("[name='support_phone']").type(phone_number);
      cy.wait(500);
      cy.get("#notes").type("Test note for asset creation!");
      cy.get("#submit").click({ force: true });
      cy.verifyNotification("Asset created successfully");
    });

    it(`Update as ${user.username}`, () => {
      // Login with credentials
      cy.loginByApi(user.username, user.password);
      cy.saveLocalStorage();
      cy.restoreLocalStorage();
      cy.awaitUrl("/");

      cy.visit("/assets");
      cy.get("[data-cy='asset-0']").click();
      cy.get("#update-asset").click();
      cy.get("#asset-name").type(" Updated");
      cy.get("#submit").click();
      cy.verifyNotification("Asset updated successfully");
    });

    afterEach(() => {
      cy.saveLocalStorage();
    });
  });
});
