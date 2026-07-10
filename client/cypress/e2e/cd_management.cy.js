describe("Gestion des CD - Parcours complet", () => {
  const cdTitle = "CD Test E2E";
  const cdArtist = "Artiste E2E";
  const cdYear = "2024";

  beforeEach(() => {
    cy.visit("/");
  });

  it("ajoute un CD, l'affiche dans la liste, puis le supprime", () => {
    cy.get('input[name="title"]').type(cdTitle);
    cy.get('input[name="artist"]').type(cdArtist);
    cy.get('input[name="year"]').type(cdYear);
    cy.get("form").submit();

    cy.contains(`${cdTitle} - ${cdArtist} (${cdYear})`, { timeout: 10000 }).should("be.visible");

    cy.contains("li", cdTitle).within(() => {
      cy.get(".delete-btn").click();
    });

    cy.contains(`${cdTitle} - ${cdArtist} (${cdYear})`).should("not.exist");
  });
});