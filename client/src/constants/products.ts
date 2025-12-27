export interface Product {
  id: string;
  title: string;
  author: string;
  type: "Manga" | "Novel" | "Manhwa";
  status: "Ongoing" | "Completed";
  rating: number;
  description: string;
  cover: string;
  latestChapter: number;
  tags: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Solo Leveling",
    author: "Chugong",
    type: "Manhwa",
    status: "Completed",
    rating: 4.9,
    description:
      "In a world where hunters — humans who possess magical abilities — must battle deadly monsters to protect the human race from certain annihilation.",
    cover: "https://picsum.photos/seed/solo/400/600",
    latestChapter: 179,
    tags: ["Action", "Fantasy", "System"],
  },
  {
    id: "2",
    title: "Omniscient Reader's Viewpoint",
    author: "Sing Shong",
    type: "Novel",
    status: "Ongoing",
    rating: 4.8,
    description:
      "Kim Dokja does not consider himself the protagonist of his own life. Befitting the name his parents gave him, he is a solitary person whose only hobby is reading web novels.",
    cover: "https://picsum.photos/seed/orv/400/600",
    latestChapter: 551,
    tags: ["Adventure", "Apocalypse", "Psychological"],
  },
  {
    id: "3",
    title: "One Piece",
    author: "Eiichiro Oda",
    type: "Manga",
    status: "Ongoing",
    rating: 5.0,
    description:
      "Gol D. Roger was known as the 'Pirate King', the strongest and most infamous being to have sailed the Grand Line.",
    cover: "https://picsum.photos/seed/op/400/600",
    latestChapter: 1100,
    tags: ["Adventure", "Comedy", "Action"],
  },
  {
    id: "4",
    title: "Frieren: Beyond Journey's End",
    author: "Kanehito Yamada",
    type: "Manga",
    status: "Ongoing",
    rating: 4.9,
    description:
      "The demon king has been defeated, and the victorious hero party returns home before disbanding.",
    cover: "https://picsum.photos/seed/frieren/400/600",
    latestChapter: 120,
    tags: ["Fantasy", "Slice of Life", "Drama"],
  },
  {
    id: "5",
    title: "The Beginning After The End",
    author: "TurtleMe",
    type: "Novel",
    status: "Ongoing",
    rating: 4.7,
    description:
      "King Grey has unrivaled strength, wealth, and prestige in a world governed by martial ability.",
    cover: "https://picsum.photos/seed/tbate/400/600",
    latestChapter: 450,
    tags: ["Isekai", "Magic", "Reincarnation"],
  },
];

export const getProductById = (id: string): Product | undefined => {
  return PRODUCTS.find((product) => product.id === id);
};
