import firebase from "firebase";

export default function ({ isServer, redirect, route, store }) {
  const isAuthenticated = store => {
    return store && store.state && store.state.user;
  };

  if (
    !isAuthenticated(store) &&
    (route.name === "chat" || route.name === "account")
  ) {
    redirect("/account/login");
  }
  // the server can never be authed for a single account
  if (isServer && !firebase.apps.length) {
    redirect("/account/login");
  }
}
