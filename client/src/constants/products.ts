export interface Product {
  id: string;
  title: string;
  author: string;
  price: number;
  category: string;
  description: string;
  isbn: string;
  pages: number;
  published: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 299,
    category: "Classic Literature",
    description:
      "A classic American novel set in the Jazz Age that explores themes of decadence, idealism, resistance to change, and excess. It tells the story of the mysterious millionaire Jay Gatsby and his obsession with the beautiful former debutante Daisy Buchanan.",
    isbn: "978-0-7432-7356-5",
    pages: 180,
    published: "1925",
  },
  {
    id: "2",
    title: "1984",
    author: "George Orwell",
    price: 349,
    category: "Science Fiction",
    description:
      "A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism. The story takes place in an imagined future in the year 1984 when much of the world has fallen victim to perpetual war, omnipresent government surveillance, and propaganda.",
    isbn: "978-0-452-28423-4",
    pages: 328,
    published: "1949",
  },
  {
    id: "3",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 279,
    category: "Classic Literature",
    description:
      "A powerful story of racial injustice and childhood innocence in the American South during the 1930s. Through the eyes of Scout Finch, we witness her father Atticus defending a black man falsely accused of a terrible crime.",
    isbn: "978-0-06-112008-4",
    pages: 324,
    published: "1960",
  },
  {
    id: "4",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    price: 259,
    category: "Romance",
    description:
      "A romantic novel of manners that follows the character development of Elizabeth Bennet, the protagonist of the book, who learns about the repercussions of hasty judgments and comes to appreciate the difference between superficial goodness and actual goodness.",
    isbn: "978-0-14-143951-8",
    pages: 432,
    published: "1813",
  },
  {
    id: "5",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    price: 399,
    category: "Fantasy",
    description:
      "A children's fantasy novel about a hobbit named Bilbo Baggins who goes on an unexpected adventure with a group of dwarves and the wizard Gandalf to reclaim their mountain home from Smaug the dragon.",
    isbn: "978-0-547-92822-7",
    pages: 366,
    published: "1937",
  },
  {
    id: "6",
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    price: 449,
    category: "Fantasy",
    description:
      "The first novel in the Harry Potter series follows the life of a young wizard, Harry Potter, and his friends as they attend Hogwarts School of Witchcraft and Wizardry.",
    isbn: "978-0-439-70818-8",
    pages: 223,
    published: "1997",
  },
];

export const getProductById = (id: string): Product | undefined => {
  return PRODUCTS.find((product) => product.id === id);
};
