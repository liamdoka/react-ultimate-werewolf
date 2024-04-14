import Chatbox from "./components/chatbox/chatbox";

function App() {
  return (
    <div className="m-0 flex min-h-full min-w-full flex-col items-center justify-center bg-slate-800 p-0 text-slate-50">
      <main className="m-auto flex h-screen w-full max-w-screen-lg flex-col items-center justify-evenly">
        <p className="text-3xl font-bold underline">here is some text</p>
        <Chatbox />
      </main>
    </div>
  );
}

export default App;
