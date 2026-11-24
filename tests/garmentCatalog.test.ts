import { describe, expect, it } from "vitest";
import { GARMENT_CATALOG } from "../src/lib/tryOn/garmentCatalog";
import { normalizeDecartImage } from "../src/components/DecartAiTryOn";

describe("Decart garment catalog", () => {
  it("provides realistic, licensed reference photos for both customer-selected catalogs", () => {
    const men = GARMENT_CATALOG.filter((garment) => garment.gender === "men");
    const women = GARMENT_CATALOG.filter((garment) => garment.gender === "women");

    expect(men.length).toBeGreaterThanOrEqual(3);
    expect(women.length).toBeGreaterThanOrEqual(3);
    for (const garment of GARMENT_CATALOG) {
      expect(garment.imageUrl).toMatch(/^\/garments\/catalog\/.+\.(jpg|png)$/);
      expect(garment.sourceUrl).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
      expect(garment.attribution).not.toBe("");
      expect(garment.license).toMatch(/^CC BY/);
      expect(garment.licenseUrl).toMatch(/^https:\/\/creativecommons\.org\/licenses\//);
    }
  });

  it("converts local catalog paths to absolute URLs for the documented SDK image input", () => {
    expect(normalizeDecartImage("/garments/catalog/a.jpg", "https://shop.example")).toBe(
      "https://shop.example/garments/catalog/a.jpg"
    );
  });

  it("preserves supported absolute and data URLs and rejects unsupported schemes", () => {
    expect(
      normalizeDecartImage("https://images.example/garment.jpg", "https://shop.example")
    ).toBe("https://images.example/garment.jpg");
    expect(normalizeDecartImage("data:image/png;base64,abc", "https://shop.example")).toBe(
      "data:image/png;base64,abc"
    );
    expect(() => normalizeDecartImage("ftp://images.example/garment.jpg", "https://shop.example"))
      .toThrow("URL yaroqsiz");
  });
});
