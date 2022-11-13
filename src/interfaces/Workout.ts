export interface Workout {
  id: string;
  name: string;
  date: Date;
  uid: string;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
}

export interface Set {
  id: string;
  reps: number;
  weight: number;
  units: "lbs" | "kgs";
}
