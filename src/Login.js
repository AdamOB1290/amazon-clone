import React, { useState } from "react";
import "./Login.css";
import { Link, useHistory } from "react-router-dom";
import { auth } from "./firebase";

function Login() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .then((auth) => {
        history.push("/");
      })
      .catch((error) => alert(error.message));
  };

  const register = (e) => {
    e.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((auth) => {
        // it successfully created a new user with email and password
        if (auth) {
          history.push("/");
        }
      })
      .catch((error) => alert(error.message));
  };

  return (
    <div className="login">
      <Link to="/">
        <img
          className="login__logo"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png"
        />
      </Link>

      <div className="login__container">
        <h1 className="text-gray-700 text-2xl font-bold mb-5">Sign-in</h1>

        <form>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              for="email"
            >
              E-mail
            </label>
            <input
              className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
              id="email"
              type="text"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              for="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            onClick={signIn}
            className="login__signInButton focus:outline-none"
          >
            Sign In
          </button>
        </form>

        <p>
          By signing-in you agree to the fake amazon's{" "}
          <a href="#">Conditions of Use</a> &<a href="#"> Sale</a>. Please see
          our <a href="#"> Privacy Notice</a>., our{" "}
          <a href="#">Cookies Notice</a> and our
          <a href="#"> Interest-Based Ads Notice</a>.
        </p>

        <div className="divider mt-5">
          <h5>New to Amazon?</h5>
        </div>

        <button
          onClick={register}
          className="login__registerButton focus:outline-none"
        >
          Create your Amazon Account
        </button>
      </div>

      <div className="a-section a-spacing-top-extra-large auth-footer">
        <div className="a-divider a-divider-section">
          <div className="a-divider-inner"></div>
        </div>

        <div className="a-section a-spacing-small a-text-center a-size-mini">
          <a
            className="a-link-normal mr-3"
            target="_blank"
            rel="noopener"
            href="#"
          >
            Conditions of Use
          </a>

          <a
            className="a-link-normal mr-3"
            target="_blank"
            rel="noopener"
            href="#"
          >
            Privacy Notice
          </a>
          <a className="a-link-normal" target="_blank" rel="noopener" href="#">
            Help
          </a>
        </div>

        <div className="a-section a-spacing-none a-text-center">
          <span className="a-size-mini a-color-secondary">
            © 1996-2020, Amazon.com, Inc. or its affiliates
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
