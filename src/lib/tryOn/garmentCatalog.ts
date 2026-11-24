export type CatalogGender = "men" | "women";

export interface CatalogGarment {
  id: string;
  gender: CatalogGender;
  title: string;
  category: string;
  imageUrl: string;
  prompt: string;
  sourceUrl: string;
  attribution: string;
  license: string;
  licenseUrl: string;
}

export const GARMENT_CATALOG: CatalogGarment[] = [
  {
    id: "mens-classic-formal-suit",
    gender: "men",
    title: "Klassik qora kostyum",
    category: "Kostyum",
    imageUrl: "/garments/catalog/mens-formal-suit.jpg",
    prompt: "A tailored black formal suit with a black shirt and bow tie.",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Kris_Smith_(6837612914).jpg",
    attribution: "Eva Rinaldi",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
  },
  {
    id: "mens-patterned-lookbook-suit",
    gender: "men",
    title: "Zamonaviy naqshli kostyum",
    category: "Zamonaviy uslub",
    imageUrl: "/garments/catalog/mens-patterned-suit.jpg",
    prompt: "A colorful tailored men's suit with bold blue and red patterned fabric.",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Men%27s_look_SS_15_Lookbook.jpg",
    attribution: "Eguanakla",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  {
    id: "mens-uzbek-chapan",
    gender: "men",
    title: "O‘zbek choponi",
    category: "Milliy libos",
    imageUrl: "/garments/catalog/mens-chapan.png",
    prompt: "A traditional Uzbek chapan robe with a striped woven pattern and embroidered details.",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Chapan_kiygan_erkak.png",
    attribution: "AIDEPCUL",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
  },
  {
    id: "womens-namangan-atlas",
    gender: "women",
    title: "Namangan atlas ko‘ylagi",
    category: "Atlas va adras",
    imageUrl: "/garments/catalog/womens-atlas-namangan.png",
    prompt: "A long, loose blue Uzbek atlas dress with an iroqi-embroidered skullcap.",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Ayollar_milliy_libosi_13.png",
    attribution: "AIDEPCUL",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
  },
  {
    id: "womens-red-evening-gown",
    gender: "women",
    title: "Qizil oqshom libosi",
    category: "Kechki libos",
    imageUrl: "/garments/catalog/womens-formal-red-gown.jpg",
    prompt: "A floor-length, elegant red evening gown with a one-shoulder neckline.",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Lauren_Lee_Smith_wearing_Ines_Di_Santo_-_Heart_and_Stroke_Foundation_-_The_Heart_Truth_celebrity_fashion_show_-_Red_Dress_-_Red_Gown_-_Thursday_February_8,_2012_-_Creative_Commons_(6821773484).jpg",
    attribution: "Jason Hargrove",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "womens-black-classic-dress",
    gender: "women",
    title: "Qora klassik ko‘ylak",
    category: "Klassik libos",
    imageUrl: "/garments/catalog/womens-black-dress.jpg",
    prompt: "A fitted black off-the-shoulder cocktail dress with a clean, classic silhouette.",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Wolford_Fatal_dress_in_black_with_long_evening_gloves_worn_with_Kunert_Beauty_7_tights_in_the_colour_candy.jpg",
    attribution: "Tobias ToMar Maier",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
  },
  {
    id: "womens-runway-red-gown",
    gender: "women",
    title: "Podiumdagi qizil libos",
    category: "Moda kolleksiyasi",
    imageUrl: "/garments/catalog/womens-runway-2025.jpg",
    prompt: "A dramatic red runway gown with a fitted bodice and layered flowing skirt.",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Sosnowiecki_Fashion_Bridge_-_23.05.2025.jpg",
    attribution: "Rafał Siciński",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
  },
];
