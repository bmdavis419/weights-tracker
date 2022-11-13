import { useFBAuth } from "@matterhorn-studios/react-fb-auth";
import { User } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router";
import NavBar from "../components/NavBar";

const Home: React.FC = () => {
  const { user, loading, error } = useFBAuth();

  if (loading) return <div>loading...</div>;

  if (error) return <div>error...</div>;

  if (user) return <LoggedIn user={user} />;

  return <LoggedOut />;
};

const LoggedIn: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();
  return (
    <>
      <NavBar />
      <div className="w-full flex justify-center">
        <div className="w-1/2 p-4 rounded-md shadow-md border-2 border-gray-300">
          <h1 className="mb-4 text-2xl font-bold">Create Workout</h1>
          <button
            className="px-4 py-2 hover:bg-green-600 bg-green-500 rounded-md text-white shadow-md"
            onClick={async (e) => {
              e.preventDefault();

              // save the workout to the database
              const docRef = await addDoc(collection(db, "workouts"), {
                name: "new workout",
                date: new Date(),
                exercises: [],
                uid: user.uid,
              });

              navigate(`/workout?id=${docRef.id}`);
            }}
          >
            create workout
          </button>
        </div>
      </div>
    </>
  );
};

const LoggedOut: React.FC = () => {
  return <div>logged out</div>;
};

export default Home;
