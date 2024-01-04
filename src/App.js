import "./style.css";
import supabase from "./supabase";
import { useEffect, useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const CATEGORIES = [
  { name: "MA1521", color: "#92925f" },
  { name: "MA1522", color: "#92925f" },
  { name: "CS1231S", color: "#92925f" },
  { name: "GESS1028", color: "#92925f" },
  { name: "CS1101S", color: "#92925f" },
  { name: "CS2030", color: "#92925f" },
  { name: "CS2040", color: "#92925f" },
];

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");

  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // TODO: 实现登录逻辑
    setIsLoggedIn(true); // 暂时假设登录总是成功的
  };

  const handleSignup = () => {
    // TODO: 实现注册逻辑
  };

  useEffect(
    function () {
      async function getFacts() {
        setIsLoading(true);

        let query = supabase.from("facts").select("*");

        if (currentCategory !== "all")
          query = query.eq("category", currentCategory);

        const { data: facts, error } = await query
          .order("voteInteresting", { ascending: false })
          .limit(1000);
        if (!error) setFacts(facts);
        else alert("there is a problem");
        setIsLoading(false);
      }
      getFacts();
    },
    [currentCategory]
  );

  return (
    <>
      <Header
        showForm={showForm}
        setShowForm={setShowForm}
        setShowLoginForm={setShowLoginForm}
        setShowSignupForm={setShowSignupForm}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />
      {showLoginForm && (
        <LoginForm setShowLoginForm={setShowLoginForm} onLogin={handleLogin} />
      )}
      {showSignupForm && (
        <SignupForm
          setShowSignupForm={setShowSignupForm}
          onSignup={handleSignup}
        />
      )}
      {/* {isLoggedIn && <div>registered successfully</div>} */}
      {showForm ? <NewFactForm setFacts={setFacts} /> : null}
      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {isLoading ? (
          <Loader />
        ) : (
          <FactList facts={facts} setFacts={setFacts} />
        )}
      </main>
    </>
  );
}

function Loader() {
  return <p className="message">Loading...!!</p>;
}
function Header({
  setShowForm,
  setShowLoginForm,
  setShowSignupForm,
  isLoggedIn,
  setIsLoggedIn,
}) {
  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" height="68" width="68" alt="today i learned logo" />
        <h1>MY Study JOURNAL</h1>
      </div>
      {isLoggedIn ? (
        <button
          className="sign-in"
          onClick={() => {
            setIsLoggedIn(false);
            setShowForm(false);
          }}
        >
          Log out
        </button>
      ) : (
        <button
          className="sign-in"
          onClick={() => {
            setShowLoginForm(true);
            setShowSignupForm(false);
          }}
        >
          Log in
        </button>
      )}
      <button
        className="sign-in"
        onClick={() => {
          {
            setShowLoginForm(false);
            setShowSignupForm(true);
          }
        }}
      >
        Sign up
      </button>
      {isLoggedIn && (
        <button
          className="sign-in"
          onClick={() => {
            setShowForm((show) => !show);
            setShowLoginForm(false);
            setShowSignupForm(false);
          }}
        >
          Share fact
        </button>
      )}
    </header>
  );
}

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

function NewFactForm({ setFacts }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("http://example.com");
  const [category, setCategory] = useState("");
  const [isUpLoading, setIsUpLoading] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    if (text && isValidHttpUrl(source) && category && text.length <= 200) {
      setIsUpLoading(true);
      const { data: newFact, error } = await supabase
        .from("facts")
        .insert([{ text, source, category }])
        .select();
      setIsUpLoading(false);
      if (!error) setFacts((facts) => [newFact[0], ...facts]);
      setText("");
      setSource("");
      setCategory("");
    }
  }
  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        className="content-input"
        type="text"
        placeholder="content here"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <span>{200 - text.length}</span>
      <input
        type="text"
        placeholder="content here"
        value={source}
        onChange={(e) => setSource(e.target.value)}
        disabled={isUpLoading}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option>"CHOOSE A CATEGORY"</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large" disabled={isUpLoading}>
        post
      </button>
    </form>
  );
}
function CategoryFilter({ setCurrentCategory }) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className="btn btn-all-category"
            onClick={() => setCurrentCategory("all")}
          >
            All
          </button>
        </li>
        {CATEGORIES.map((category) => (
          <li key={category.name} className="category">
            <button
              className="btn btn-category"
              style={{ backgroundColor: category.color }}
              onClick={() => setCurrentCategory(category.name)}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
function FactList({ facts, setFacts }) {
  if (facts.length == 0) {
    return <p className="message">Create the first fact!!!!</p>;
  }
  return (
    <section>
      <ul className="fact-list">
        {facts.map((fact) => (
          <Fact fact={fact} key={fact.id} setFacts={setFacts} />
        ))}
      </ul>
      <p>there are {facts.length} facts in the list</p>
    </section>
  );
}
function Fact({ fact, setFacts }) {
  const [isUpdating, setIsUpDating] = useState(false);
  const isDisputed =
    fact.voteInteresting + fact.voteMindblowing < fact.votesFalse;
  async function handleVote(columnName) {
    setIsUpDating(true);
    const { data: updateFact, error } = await supabase
      .from("facts")
      .update({ [columnName]: fact[columnName] + 1 })
      .eq("id", fact.id)
      .select();
    setIsUpDating(false);
    if (!error)
      setFacts((facts) =>
        facts.map((f) => (f.id === fact.id ? updateFact[0] : f))
      );
  }
  return (
    <li key={fact.id} class="fact">
      <p>
        {isDisputed ? (
          <span className="disputed">[⛔️ it is Disputed]</span>
        ) : null}
        {fact.text}
        <a class="source" href={fact.source} target="_blank">
          source
        </a>
      </p>
      <span
        class="tag"
        style={{
          backgroundColor: CATEGORIES.find((cat) => cat.name == fact.category)
            .color,
        }}
      >
        {" "}
        {fact.category}{" "}
      </span>
      <div class="vote_button">
        <button
          onClick={() => handleVote("voteInteresting")}
          disabled={isUpdating}
        >
          👍<strong>{fact.voteInteresting}</strong>
        </button>
        <button
          onClick={() => handleVote("voteMindblowing")}
          disabled={isUpdating}
        >
          🤯 <strong>{fact.voteMindblowing}</strong>
        </button>
        <button onClick={() => handleVote("votesFalse")} disabled={isUpdating}>
          ⛔️<strong>{fact.votesFalse}</strong>
        </button>

        {/* <button className="sci-fi-button">Sci-Fi Button</button> */}
      </div>
    </li>
  );
}

export default App;
