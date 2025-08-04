// seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('./models/Product'); // Adjust path if needed

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce-products';

const products = [
  {
    title: "Headphone",
    description: "DJ headphones with superior sound quality.",
    price: 89.99,
    imageUrl: "https://thumbs.dreamstime.com/b/fone-de-ouvido-dj-curtindo-dan%C3%A7a-no-fundo-amarelo-azul-com-m%C3%BAsica-clube-fones-em-forma-onda-do-espectro-%C3%A1udio-branco-movendo-se-228174051.jpg?w=400",
    stock: 20,
  },
  {
    title: "Luxury Watch",
    description: "Elegant timepiece with modern craftsmanship.",
    price: 249.99,
    imageUrl: "https://www.breguet.com/sites/default/files/2025-06/hero.png?im=Resize,width=400",
    stock: 15,
  },
  {
    title: "Gold Rings",
    description: "Stunning gold rings for special occasions.",
    price: 129.5,
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRowxTnROlQxhYmVYaQ-SOgkF_0-X7h2JQ_aw&s",
    stock: 30,
  },
  {
    title: "Leather Belts",
    description: "Classic leather belts, perfect for all outfits.",
    price: 39.99,
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwiqopJPU_F4atKd4GSyKF_0A5uiTlLG81Kw&s",
    stock: 25,
  },
  {
    title: "Sneakers",
    description: "Trendy and comfortable sneakers for all-day wear.",
    price: 69.99,
    imageUrl: "https://static.toiimg.com/thumb/msid-112588091,imgsize-849838,width-400,resizemode-4/112588091.jpg",
    stock: 40,
  },
  {
    title: "Bracelets",
    description: "Beautiful bracelets to elevate your style.",
    price: 54.99,
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrUn4q3Ae9B8ViriGHz_YrwrcQnMdg_goPcQ&s",
    stock: 18,
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    await Product.deleteMany(); // optional: clear existing products
    const result = await Product.insertMany(products);

    console.log(`${result.length} products inserted.`);
    mongoose.disconnect();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seedDatabase();
