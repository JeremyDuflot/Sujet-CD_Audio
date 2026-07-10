describe("Gestion des CD - Tests responsive (multi-viewport)", () => {
  const viewports = [
    { name: "Mobile (iPhone SE)", width: 375, height: 667 },
    { name: "Tablette (iPad)", width: 768, height: 1024 },
    { name: "Desktop", width: 1280, height: 800 },
  ];

  viewports.forEach(({ name, width, height }) => {
    context(`Viewport : ${name} (${width}x${height})`, () => {
      beforeEach(() => {
        cy.viewport(width, height);
        cy.visit("/");
      });

      it("affiche correctement le formulaire d'ajout", () => {
        cy.contains("Ajouter un CD").should("be.visible");
        cy.get('input[name="title"]').should("be.visible");
        cy.get('input[name="artist"]').should("be.visible");
        cy.get('input[name="year"]').should("be.visible");
        cy.get("form button[type='submit']").should("be.visible");
      });

      it("affiche correctement la liste des CD", () => {
        cy.contains("Liste des CD").should("be.visible");
      });

      it("permet d'ajouter un CD sur cette taille d'écran", () => {
        const title = `CD ${name}`;
        cy.get('input[name="title"]').type(title);
        cy.get('input[name="artist"]').type("Artiste Test");
        cy.get('input[name="year"]').type("2024");
        cy.get("form").submit();

        cy.contains(title, { timeout: 10000 }).should("be.visible");

        // Nettoyage : on supprime le CD créé pour ne pas polluer les tests suivants
        cy.contains("li", title).within(() => {
          cy.get(".delete-btn").click();
        });
      });
    });
  });
});