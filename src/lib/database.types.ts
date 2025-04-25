export type Role = 'USER' | 'ADMIN';
export type Condition = 'excellent' | 'good' | 'fair' | 'poor';

export type User = {
  id: number;
  email: string;
  password: string;
  role: Role;
};

export type Item = {
  id: number;
  name: string;
  condition: Condition;
  price: number;
  location: string;
  owner: string;
  imageUrl: string;
  description: string;
};

export type Stuff = {
  id: number;
  name: string;
  quantity: number;
  condition: Condition;
  owner: string;
};

export type Database = {
  public: {
    Tables: {
      User: {
        Row: User;
        Insert: Omit<User, 'id'>;
        Update: Partial<User>;
      };
      Item: {
        Row: Item;
        Insert: Omit<Item, 'id'>;
        Update: Partial<Item>;
      };
      Stuff: {
        Row: Stuff;
        Insert: Omit<Stuff, 'id'>;
        Update: Partial<Stuff>;
      };
    };
  };
};
