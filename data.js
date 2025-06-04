const productsData = {
    categories: [
        {
            name: "Produits Agroalimentaires",
            id: "agroalimentaire",
            subcategories: [
                {
                    name: "Douceur chocolat",
                    id: "douceur-chocolat",
                    products: [
                        {
                            id: "andy-choco",
                            name: "Andy Choco",
                            description: "Chocolat artisanal de qualité supérieure, fabriqué avec des fèves de cacao sélectionnées. Un délice pour les amateurs de chocolat intense.",
                            price: 2500,
                            stock: 50,
                            images: ["images/WhatsApp Image 2025-06-03 à 15.41.01_69dba099.jpg", "images/andy-choco-2.jpg"],
                            varieties: [
                                { name: "Classique", price: 2500 },
                                { name: "Noisettes", price: 3000 },
                                { name: "Fruits secs", price: 3500 }
                            ]
                        },
                        {
                            id: "chocolat-lait",
                            name: "Chocolat au lait",
                            description: "Chocolat crémeux au lait, parfait pour les amateurs de douceur. Sa texture fondante et son goût équilibré en font une gourmandise irrésistible.",
                            price: 2000,
                            stock: 45,
                            images: ["images/WhatsApp Image 2025-06-03 à 15.41.01_2c1ba695.jpg", "images/chocolat-lait-2.jpg"],
                            varieties: [
                                { name: "Classique", price: 2000 },
                                { name: "Caramel", price: 2500 },
                                { name: "Vanille", price: 2500 }
                            ]
                        },
                        {
                            id: "chocolat-blanc",
                            name: "Chocolat blanc",
                            description: "Chocolat blanc onctueux, idéal pour la pâtisserie et la dégustation. Sa douceur lactée s'accorde parfaitement avec de nombreux arômes.",
                            price: 2200,
                            stock: 40,
                            images: ["images/WhatsApp Image 2025-06-03 à 15.41.01_e6d85c7f.jpg", "images/chocolat-blanc-2.jpg"],
                            varieties: [
                                { name: "Classique", price: 2200 },
                                { name: "Framboise", price: 2700 },
                                { name: "Coco", price: 2700 }
                            ]
                        }
                    ]
                },
                {
                    name: "Biscuits artisanaux",
                    id: "biscuits-artisanaux",
                    products: [
                        {
                            id: "biscuit-patate",
                            name: "Biscuits à la patate",
                            description: "Biscuits croustillants à base de patate douce, riches en fibres et en saveur. Une alternative saine et délicieuse aux biscuits traditionnels.",
                            price: 1500,
                            stock: 60,
                            images: ["images/WhatsApp Image 2025-06-03 à 15.41.01_aa4597b4.jpg", "images/biscuit-patate-2.jpg"],
                            varieties: [
                                { name: "Nature", price: 1500 },
                                { name: "Cannelle", price: 1800 },
                                { name: "Gingembre", price: 1800 }
                            ]
                        },
                        {
                            id: "biscuit-manioc",
                            name: "Biscuits au manioc",
                            description: "Biscuits légers et croustillants à base de manioc, sans gluten. Idéals pour les personnes intolérantes ou soucieuses de leur alimentation.",
                            price: 1200,
                            stock: 55,
                            images: ["images/WhatsApp Image 2025-06-03 à 15.41.01_77dc2897.jpg", "images/biscuit-manioc-2.jpg"],
                            varieties: [
                                { name: "Nature", price: 1200 },
                                { name: "Sésame", price: 1500 },
                                { name: "Piment", price: 1500 }
                            ]
                        }
                    ]
                },
                {
                    name: "Jus naturels",
                    id: "jus-naturels",
                    products: [
                        {
                            id: "jus-baobab",
                            name: "Jus de baobab",
                            description: "Jus naturel de baobab, riche en vitamines et minéraux. Une boisson exotique et pleine de bienfaits pour la santé.",
                            price: 2000,
                            stock: 30,
                            images: ["images/WhatsApp Image 2025-06-03 à 15.41.01_4fde304c.jpg", "images/jus-baobab-2.jpg"],
                            varieties: [
                                { name: "Nature", price: 2000 },
                                { name: "Gingembre", price: 2500 },
                                { name: "Menthe", price: 2500 }
                            ]
                        },
                        {
                            id: "bissap",
                            name: "Bissap guinéen",
                            description: "Jus traditionnel de fleurs d'hibiscus, rafraîchissant et délicieux. Parfait pour se désaltérer avec une touche d'exotisme.",
                            price: 1800,
                            stock: 35,
                            images: ["images/WhatsApp Image 2025-06-03 à 15.41.00_77dc2897.jpg", "images/bissap-2.jpg"],
                            varieties: [
                                { name: "Nature", price: 1800 },
                                { name: "Gingembre", price: 2200 },
                                { name: "Menthe", price: 2200 }
                            ]
                        },
                        {
                            id: "vin-blanc",
                            name: "Vin blanc",
                            description: "Vin blanc artisanal, élaboré avec des raisins locaux. Un vin léger et fruité, idéal pour accompagner vos repas.",
                            price: 5000,
                            stock: 25,
                            images: ["images/WhatsApp Image 2025-06-03 à 15.40.50_4fde304c.jpg", "images/vin-blanc-2.jpg"],
                            varieties: [
                                { name: "Sec", price: 5000 },
                                { name: "Demi-sec", price: 5500 },
                                { name: "Moelleux", price: 6000 }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: "Artisanat (Placeholder)",
            id: "artisanat",
            subcategories: []
        }
    ]
}; 