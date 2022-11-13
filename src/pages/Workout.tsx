import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { Workout } from "../interfaces/Workout";
import { useMutation, useQuery } from "@tanstack/react-query";

const WorkoutPage: React.FC = () => {
  const [hasFetched, setHasFetched] = useState(false);

  const workout = useQuery({
    queryKey: ["workout"],
    queryFn: async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const id = queryParams.get("id") || "";
      const collectionRef = collection(db, "workouts");
      const docRef = doc(collectionRef, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data()) {
        console.log("Document data:", docSnap.data());

        // get the data from the document
        const subCollectionRef = collection(docRef, "exercises");
        const subCollectionSnaps = await getDocs(subCollectionRef);

        const exercises = subCollectionSnaps.docs.map((doc) => {
          return {
            name: doc.data().name,
          };
        });

        return {
          id: docSnap.id,
          name: docSnap.data().name,
          date: new Date(docSnap.data().date.seconds * 1000),
          uid: docSnap.data().uid,
          exercises: exercises,
        };
      }

      throw new Error("workout not found");
    },
    enabled: false,
  });

  useEffect(() => {
    if (!hasFetched) {
      workout.refetch();
      setHasFetched(true);
    }
  }, []);

  if (!workout.data) return <div>loading...</div>;

  console.log(workout.data);

  return (
    <div className="w-full h-screen bg-gray-900 text-white p-4">
      <WorkoutContainer workout={workout.data} />
    </div>
  );
};

const WorkoutContainer: React.FC<{ workout: Workout }> = ({ workout }) => {
  const createExercise = useMutation({
    mutationKey: ["createExercise"],
    mutationFn: async ({
      workoutId,
      name,
    }: {
      workoutId: string;
      name: string;
    }) => {
      const collectionRef = collection(db, "workouts");
      const docRef = doc(collectionRef, workoutId);
      const subCollectionRef = collection(docRef, "exercises");
      const res = await addDoc(subCollectionRef, {
        name,
      });

      console.log(res);
    },
  });

  const [name, setName] = useState("");

  return (
    <div className="rounded-md bg-gray-700">
      <h3 className="text-xl font-bold p-3">
        Workout: {workout.date.toLocaleDateString()}
      </h3>
      <div className="px-8">
        <div className="bg-gray-800 rounded-md px-2">
          <h4 className="text-lg underline">Exercise Creator</h4>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createExercise.mutate({ workoutId: workout.id, name });
            }}
            className="p-3"
          >
            <label htmlFor="name" className="block text-light ml-2">
              exercise name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-2 py-1 rounded-md text-black w-[400px] mb-3"
            />
            <button className="py-2 px-4 text-md font-bold bg-blue-600 rounded block hover:bg-blue-700">
              create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPage;
