export default function LoginForm({ setShowLoginForm, onLogin }) {
  return (
    <div>
      <input className="sign-input" type="text" placeholder="Name" />
      <input className="sign-input" type="password" placeholder="Password" />
      <button
        className="sign-input"
        onClick={() => {
          onLogin({
            /* 用户凭据 */
          });
          setShowLoginForm(false);
        }}
      >
        Login
      </button>
    </div>
  );
}
