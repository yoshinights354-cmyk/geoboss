
export type Category = 'Action' | 'Arcade' | 'Puzzle' | 'Sports' | 'Strategy' | 'Racing' | 'Classic' | 'Apps';

export interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  category: Category;
  rating: number;
  featured?: boolean;
}

export interface GamesData {
  games: Game[];
}
