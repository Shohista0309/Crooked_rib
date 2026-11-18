import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with verified initial baseline and clearly-labeled demo records...");

  // Password for demo accounts: "CrookedRib2026!"
  const passwordHash = await bcrypt.hash("CrookedRib2026!", 10);

  // 1. Admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@crookedrib.uz" },
    update: {},
    create: {
      name: "Malika Karimova (Administrator)",
      email: "admin@crookedrib.uz",
      passwordHash,
      role: "ADMIN",
      phone: "+998901234567",
      isVerified: true,
    },
  });

  // 2. Creator: Dilnoza Rahimova (Tashkent Tailor)
  const creator1 = await prisma.user.upsert({
    where: { email: "dilnoza.tailor@crookedrib.uz" },
    update: {},
    create: {
      name: "Dilnoza Rahimova",
      email: "dilnoza.tailor@crookedrib.uz",
      passwordHash,
      role: "CREATOR",
      phone: "+998935551234",
      isVerified: true,
      creatorProfile: {
        create: {
          workshopName: "Dilnoza Atelier & Couture",
          region: "Toshkent shahri",
          city: "Chilonzor tumani",
          specialties: "Kelin liboslari, zamonaviy adras kostyumlar, milliy va yevropacha kechki liboslar",
          experienceYears: 12,
          startingPrice: 350000,
          currency: "UZS",
          bio: "12 yillik tajribaga ega mohir tikuvchi va modeler. Milliy matolarimizni zamonaviy bichim bilan uyg'unlashtirish bo'yicha ixtisoslashganman.",
          isAvailable: true,
          portfolios: {
            create: [
              {
                title: "Shohona Atlas Kechki Libosi",
                category: "Kechki libos",
                imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80",
                description: "Sof Marg'ilon ipak atlasi va qo'l mehnati bilan ishlangan nozik kashtalar uyg'unligi.",
              },
              {
                title: "Zamonaviy Adras Kostyum-Shim",
                category: "Ishbilarmonlik uslubi",
                imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
                description: "Ofis va rasmiy tadbirlar uchun qulay, nafis bichimli paxta-adras kostyumi.",
              },
            ],
          },
        },
      },
    },
  });

  // 3. Creator: Gulchehra Yusupova (Samarkand Home-based Tailor)
  const creator2 = await prisma.user.upsert({
    where: { email: "gulchehra.tailor@crookedrib.uz" },
    update: {},
    create: {
      name: "Gulchehra Yusupova",
      email: "gulchehra.tailor@crookedrib.uz",
      passwordHash,
      role: "CREATOR",
      phone: "+998946667890",
      isVerified: true,
      creatorProfile: {
        create: {
          workshopName: "Gulchehra Milliy Liboslari",
          region: "Samarqand viloyati",
          city: "Samarqand shahri",
          specialties: "Zardo'zlik, zarchopon, kelin sarpolari, an'anaviy choponlar",
          experienceYears: 8,
          startingPrice: 280000,
          currency: "UZS",
          bio: "Uyda tikuvchilik bilan shug'ullanaman. Samarqand va Buxoro zardo'zlik an'analarini saqlab, qulay va chiroyli liboslar tikaman.",
          isAvailable: true,
          portfolios: {
            create: [
              {
                title: "Nafis Baxmal Nimcha va Ko'ylak",
                category: "Milliy libos",
                imageUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
                description: "To'q qizil baxmal va tilla ipli zardo'zi naqshlar.",
              },
            ],
          },
        },
      },
    },
  });

  // 4. Seller: Shaxnoza To'rayeva (Margilan Silk & Fabric House)
  const seller1 = await prisma.user.upsert({
    where: { email: "shaxnoza.fabrics@crookedrib.uz" },
    update: {},
    create: {
      name: "Shaxnoza To'rayeva",
      email: "shaxnoza.fabrics@crookedrib.uz",
      passwordHash,
      role: "SELLER",
      phone: "+998917772345",
      isVerified: true,
      sellerProfile: {
        create: {
          shopName: "Marg'ilon Ipak Uyi (Margilan Silks)",
          region: "Farg'ona viloyati",
          city: "Marg'ilon shahri",
          address: "Ipakchilar ko'chasi, 45-uy",
          phone: "+998917772345",
          description: "Tabiiy ipak xon-atlas, shoyi, adras va tabiiy bo'yoqlar bilan tayyorlangan matolar to'g'ridan-to'g'ri ishlab chiqaruvchidan.",
          products: {
            create: [
              {
                name: "Tabiiy Sof Marg'ilon Xon-Atlasi",
                category: "FABRIC",
                material: "100% Tabiiy Ipak",
                color: "Ko'p rangli / Qizil-sariq-qora",
                price: 120000,
                currency: "UZS",
                quantity: 85,
                unit: "metr",
                region: "Farg'ona viloyati",
                city: "Marg'ilon",
                imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
                description: "Yuqori sifatli qo'lda to'qilgan 8-poyali ipak xon-atlasi. Kechki va milliy liboslar uchun ideal.",
                isAvailable: true,
                isPublished: true,
              },
              {
                name: "Klassik Paxta-Ipak Adras",
                category: "FABRIC",
                material: "50% Ipak, 50% Paxta",
                color: "Burgundy va Krem",
                price: 85000,
                currency: "UZS",
                quantity: 120,
                unit: "metr",
                region: "Farg'ona viloyati",
                city: "Marg'ilon",
                imageUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80",
                description: "Nafis adras matosi, yozgi va bahorgi kostyumlar, nimchalar hamda ko'ylaklar uchun juda qulay.",
                isAvailable: true,
                isPublished: true,
              },
              {
                name: "Tilla Rangli Metal Tugmalar To'plami (10 dona)",
                category: "BUTTONS",
                material: "Zanglamas metall",
                color: "Tilla / Oltin",
                price: 35000,
                currency: "UZS",
                quantity: 200,
                unit: "dona",
                region: "Toshkent shahri",
                city: "Toshkent",
                imageUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80",
                description: "Kostyum va jaketlar uchun mustahkam, antiqa naqshli metall tugmalar to'plami.",
                isAvailable: true,
                isPublished: true,
              },
              {
                name: "Yashirin Mustahkam Molniya (50 sm)",
                category: "ZIPPERS",
                material: "Sintetik / Metall tishli",
                color: "To'q qizil (Burgundy)",
                price: 15000,
                currency: "UZS",
                quantity: 350,
                unit: "dona",
                region: "Toshkent shahri",
                city: "Toshkent",
                imageUrl: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
                description: "Kechki liboslar va yubkalar uchun ko'rinmas yashirin zamok.",
                isAvailable: true,
                isPublished: true,
              },
            ],
          },
        },
      },
    },
  });

  // 5. Customer: Laylo Aliyeva
  const customer1 = await prisma.user.upsert({
    where: { email: "laylo.customer@crookedrib.uz" },
    update: {},
    create: {
      name: "Laylo Aliyeva",
      email: "laylo.customer@crookedrib.uz",
      passwordHash,
      role: "CUSTOMER",
      phone: "+998909998877",
      isVerified: true,
      customerProfile: {
        create: {
          city: "Toshkent",
          region: "Toshkent shahri",
          preferredStyles: "Zamonaviy klassika, milliy elementlar bilan zamonaviy liboslar",
          bio: "Maxsus tadbirlar va kundalik kiyish uchun o'ziga xos liboslar buyurtma qilishni yaxshi ko'raman.",
        },
      },
    },
  });

  // 6. Create a real sample Design for Customer
  const design1 = await prisma.design.create({
    data: {
      userId: customer1.id,
      title: "Zamonaviy Adras Trench & Kechki Kostyum",
      category: "SUIT",
      genderCategory: "WOMEN",
      style: "MODERN",
      season: "AUTUMN",
      colors: "Burgundy, Cream, Oltin rang",
      occasion: "Rasmiy tadbir va ko'rgazmalar",
      budget: 800000,
      fabricPreferences: "Ipak-paxta adras va paxta astar",
      conceptDescription: "Uzun bichimli, beli kamar bilan bog'lanadigan nozik adras trench-jaket va to'g'ri bichimli qora shim. Yoqa va yeng manjetlarida nozik qirqimlar.",
      recommendedFabrics: "Klassik Paxta-Ipak Adras, Paxta astar",
      recommendedAccessories: "Tilla rangli metall tugmalar (6 dona), yashirin furnitura",
      technicalNotes: "Yelka qismi yengil paxta yostiqchasi bilan ko'tariladi, adras gullari choklarda simmetrik ulanishi lozim.",
      aiGenerated: false,
    },
  });

  // 7. Create an actual Order connecting Customer, Creator, and Design
  const order1 = await prisma.order.create({
    data: {
      orderNumber: "CR-2026-001",
      customerId: customer1.id,
      creatorId: creator1.id,
      designId: design1.id,
      status: "QUOTATION_SENT",
      customerNotes: "Bo'yim 170 sm, nozik va qulay bo'lishi kerak. 25-noyabrgacha tayyor bo'lsa yaxshi bo'lardi.",
      measurements: "Bo'y: 170 sm, Ko'krak: 90 sm, Bel: 70 sm, Son: 98 sm, Yeng uzunligi: 60 sm",
      deliveryAddress: "Toshkent shahri, Yakkasaroy tumani, Bobur ko'chasi 12-uy",
      totalPrice: 650000,
      estimatedDays: 7,
      quotations: {
        create: {
          creatorId: creator1.id,
          offeredPrice: 650000,
          currency: "UZS",
          estimatedDays: 7,
          notes: "Adras mato bilan ishlash tajribamiz katta. Bichimni sizning o'lchamingizga moslab chiqamiz, 7 ish kunida tayyor bo'ladi.",
          status: "PENDING",
        },
      },
      statusHistory: {
        createMany: {
          data: [
            {
              status: "REQUEST_SUBMITTED",
              note: "Mijoz tomonidan buyurtma so'rovi yuborildi",
              updatedById: customer1.id,
            },
            {
              status: "UNDER_REVIEW",
              note: "Tikuvchi buyurtma tafsilotlarini o'rganmoqda",
              updatedById: creator1.id,
            },
            {
              status: "QUOTATION_SENT",
              note: "Tikuvchi narx va muddat taklifini yubordi (650 000 so'm, 7 kun)",
              updatedById: creator1.id,
            },
          ],
        },
      },
    },
  });

  // 8. Messages between customer and creator
  await prisma.message.createMany({
    data: [
      {
        senderId: customer1.id,
        receiverId: creator1.id,
        orderId: order1.id,
        content: "Assalomu alaykum, Dilnoza opa! Mening buyurtma so'rovimni ko'rib chiqa olasizmi?",
      },
      {
        senderId: creator1.id,
        receiverId: customer1.id,
        orderId: order1.id,
        content: "Vaalaykum assalom, Laylo xonim! Ha, ajoyib dizayn tanlabsiz. Narx va muddat taklifini yubordim, ko'rib chiqsangiz boshlaymiz.",
      },
    ],
  });

  // 9. Initial notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: customer1.id,
        title: "Yangi narx taklifi",
        message: "Tikuvchi Dilnoza Rahimova CR-2026-001 buyurtmangiz uchun taklif yubordi.",
        type: "QUOTATION_RECEIVED",
        link: `/dashboard/customer/orders/${order1.id}`,
      },
      {
        userId: creator1.id,
        title: "Yangi buyurtma so'rovi",
        message: "Laylo Aliyeva sizga yangi kiyim tikish so'rovini yubordi.",
        type: "ORDER_REQUEST",
        link: `/dashboard/creator/orders/${order1.id}`,
      },
    ],
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
