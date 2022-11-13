import { useMutation } from "@tanstack/react-query";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useFBAuth } from "@matterhorn-studios/react-fb-auth";

const NavBar: React.FC = () => {
  const { user, googleSignIn } = useFBAuth();

  const signInMutation = useMutation({
    mutationFn: async () => {
      // sign in with google
      await googleSignIn();
    },
  });

  return (
    <nav className="flex w-full items-center justify-between px-8 py-2">
      <h3 className="font-bold text-3xl underline">Weights Tracker</h3>
      <ul className="flex flex-row space-x-4 items-center align-middle">
        <li className="">
          <a href="/">Home</a>
        </li>
        <li>
          <a href="https://console.firebase.google.com">Firebase</a>
        </li>
        <li>
          <a href="https://reactjs.org/">React</a>
        </li>
        {user ? (
          <button
            className="px-4 py-2 hover:bg-red-600 bg-red-500 rounded-md text-white shadow-md"
            onClick={() => signOut(auth)}
          >
            Logout
          </button>
        ) : (
          <button
            className="px-4 py-2 hover:bg-green-600 bg-green-500 rounded-md text-white shadow-md"
            onClick={(e) => {
              e.preventDefault();
              signInMutation.mutate();
            }}
          >
            Login
          </button>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
