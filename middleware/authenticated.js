import firebase from "firebase";

export default function ({ isServer, redirect, route, store }) {

  const isAuthenticated = store => {
    return store && store.state.auth && store.state.auth.user;
  };


  if (
    !isAuthenticated(store) &&
    (route.name === "chat" || route.name === "profiles")
  ) {
    redirect("/account/login");
  }
  // the server can never be authed for a single account
  if (isServer && !firebase.apps.length) {
    redirect("/account/login");
  }
}
