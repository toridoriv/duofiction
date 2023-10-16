export type Superhero = {
  id: string;
  name: string;
  biography: Biography;
  appearance: Appearance;
  publisher: string;
};

export type Biography = {
  full_name: string;
  aliases: string[];
};

export type Appearance = {
  gender: string;
  species: string;
  hair_color: string;
  eye_color: string;
};

export const superheroes: Superhero[] = [
  {
    id: "b38c6fd7-3c0f-44a9-93d9-bcd2e08e18cd",
    name: "Iron Man",
    biography: {
      full_name: "Anthony Edward Stark",
      aliases: ["Tony", "Tony Stark"],
    },
    appearance: {
      gender: "Male",
      species: "Human",
      hair_color: "Black",
      eye_color: "Blue",
    },
    publisher: "Marvel",
  },
  {
    id: "e6b8de95-5053-4c41-ab68-32c50246d494",
    name: "Captain America",
    biography: {
      full_name: "Steven Grant Rogers",
      aliases: ["Steve", "Steve Rogers"],
    },
    appearance: {
      gender: "Male",
      species: "Human",
      hair_color: "Blond",
      eye_color: "Blue",
    },
    publisher: "Marvel",
  },
  {
    id: "bcf0faef-9ae0-424d-a3f3-3403174e7d7c",
    name: "Batman",
    biography: {
      full_name: "Bruce Thomas Wayne",
      aliases: [],
    },
    appearance: {
      gender: "Male",
      species: "Human",
      hair_color: "Black",
      eye_color: "Blue",
    },
    publisher: "DC",
  },
];
