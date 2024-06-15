import Login from "../components/login/login";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center gap-8">
      <b className="text-center text-6xl">
        Ultimate<i>Werewolf</i>
      </b>
      <Login />
    </div>
  );
}
