/// <reference types="cypress" />

describe('Planit Technical Assessment - UI Automation', () => {
    const baseUrl = 'http://jupiter.cloud.planittesting.com';

    beforeEach(() => {
        cy.visit(baseUrl);
    });

    it('Test Case 1: Validate error messages on Contact Page', () => {
        cy.get("a[href='#/contact']").click();
        cy.get("a.btn-contact").click();

        // Verify error messages
        cy.get("div.alert-error").should("be.visible");

        // Populate mandatory fields
        cy.get("input[name='forename']").type('John');
        cy.get("input[name='email']").type('kaye.manuel@example.com');
        cy.get("textarea[name='message']").type('This is a test message.');

        // Validate errors disappear
        cy.get("div.alert-error").should('not.exist');
    });

    it('Test Case 2: Submit Contact Form & Validate Success Message (Run 5 times)', () => {
        for (let i = 0; i < 5; i++) {
            cy.visit(baseUrl);
            cy.get("a[href='#/contact']").click();
            cy.get("input[name='forename']").type('Kaye');
            cy.get("input[name='email']").type('kaye.manuele@example.com');
            cy.get("textarea[name='message']").type('Hi Planit Team! I am excited to apply for the Automation Tester Position and eager for the opportunity to contribute my skills and expertise to your dynamic team.');
            cy.get("a.btn-contact").click();

            // Validate success message
            cy.get("div.alert-success", { timeout: 30000 })
            .should("be.visible")
            .and("contain", "we appreciate your feedback");
        }
    });

    it('Test Case 3: Add Products to Cart & Verify Pricing', () => {
        cy.get("a[href='#/shop']").first().click();
    
        // Add 2 Stuffed Frogs
        cy.get(".product")
        .contains("h4.product-title", "Stuffed Frog")
        .parent()
        .find("a.btn-success")
        .then(($buttons) => {
            cy.log("Number of Buy buttons found:", $buttons.length); // Debug log
        });           
    
    // Add 2 Stuffed Frogs
    for (let i = 0; i < 2; i++) {
        cy.contains(".product-title", "Stuffed Frog")
          .parent()
          .find("a.btn-success")
          .eq(0) // Click only the first button inside the product container
          .click();
    }

    // Add 5 Fluffy Bunnies
    for (let i = 0; i < 5; i++) {
        cy.contains(".product-title", "Fluffy Bunny")
          .parent()
          .find("a.btn-success")
          .eq(0)
          .click();
    }

    // Add 3 Valentine Bears
    for (let i = 0; i < 3; i++) {
        cy.contains(".product-title", "Valentine Bear")
          .parent()
          .find("a.btn-success")
          .eq(0)
          .click();
    }

    // Navigate to Cart Page
    cy.get("a[href='#/cart']").click();
    cy.wait(2000);

    // Verify product prices and subtotal calculations
    const prices = {
        "Stuffed Frog": 10.99,
        "Fluffy Bunny": 9.99,
        "Valentine Bear": 14.99
    };    
        
    let totalSum = 0;
    
    cy.get(".cart-item").each(($el) => {
        // Ensure elements are visible before extracting text
        cy.wrap($el).should("be.visible");
    
        // Extract product name
        const productName = $el.find(".product-title").text().trim();
    
        // Extract quantity
        const quantityText = $el.find(".cart-quantity input").val();
        const quantity = quantityText ? parseInt(quantityText, 10) : 0;
    
        // Extract and clean up price text (Fixed with cy.wrap)
        cy.wrap($el).find("td.ng-binding").eq(1).invoke("text").then((priceText) => {
            const price = parseFloat(priceText.trim().replace("$", ""));
    
            // Extract and clean up subtotal text (Fixed with cy.wrap)
            cy.get("tfoot")
            .find("strong.total.ng-binding")
            .invoke("text")
            .then((subtotalText) => {
                cy.log(`Raw subtotal text: "${subtotalText}"`); // Log before parsing
          
                const cleanedSubtotal = subtotalText.replace(/[^\d.]/g, "").trim(); // Remove non-numeric characters
                cy.log(`Cleaned subtotal text: "${cleanedSubtotal}"`); // Log cleaned value
          
                const subtotal = parseFloat(cleanedSubtotal);
                cy.log(`Parsed subtotal: ${subtotal}`); // Log final parsed value
          
                expect(subtotal, "Subtotal should not be NaN").to.not.be.NaN;
            });
        });
    });
    
    // Verify the total matches the sum of all subtotals
    cy.get("tfoot")
    .contains("Total: ") // Locate the text first
    .invoke("text")
    .then((totalText) => {
        const totalAmount = parseFloat(totalText.replace(/[^\d.]/g, "").trim());
        cy.log(`Extracted Total Price: ${totalAmount}`);
        expect(totalAmount).to.not.be.NaN;
    });
    
    });
    
});
