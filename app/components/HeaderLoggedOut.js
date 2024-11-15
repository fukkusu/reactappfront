import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
import DispatchContext from "../DispatchContext";
import { useImmerReducer } from "use-immer";
import { CSSTransition } from "react-transition-group";

function HeaderLoggedOut(props) {
  const appDispatch = useContext(DispatchContext);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const initialState = {
    username: {
      value: "",
      message: "",
      isBlank: true,
      isToFill: false
    },
    password: {
      value: "",
      message: "",
      isBlank: true,
      isToFill: false
    },
    submitCount: 0
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "usernameEntered":
        draft.username.value = action.value;
        if (draft.username.value) {
          draft.username.isBlank = false;
          draft.username.isToFill = false;
        }
        if (!draft.username.value) {
          draft.username.isBlank = true;
        }
        return;
      case "passwordEntered":
        draft.password.value = action.value;
        if (draft.password.value) {
          draft.password.isBlank = false;
          draft.password.isToFill = false;
        }
        if (!draft.password.value) {
          draft.password.isBlank = true;
        }
        return;
      case "submitForm":
        if (!draft.username.isBlank && !draft.password.isBlank) {
          draft.submitCount++;
        }
        if (draft.username.isBlank) {
          draft.username.isToFill = true;
          draft.username.message = "Username, please.";
        }
        if (draft.password.isBlank) {
          draft.password.isToFill = true;
          draft.password.message = "Password, please.";
        }
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    if (state.submitCount) {
      const ourRequest = Axios.CancelToken.source();
      async function fetchResults() {
        try {
          const response = await Axios.post("/login", { username: state.username.value, password: state.password.value }, { cancelToken: ourRequest.token });
          if (response.data) {
            appDispatch({ type: "login", data: response.data });
            appDispatch({ type: "flashMessage", value: "You have successfully logged in!" });
          } else {
            appDispatch({ type: "flashMessage", value: "Incorrect username / password." });
          }
        } catch (e) {
          console.log("There was a problem or the request was cancelled.");
        }
      }
      fetchResults();
      return () => ourRequest.cancel();
    }
  }, [state.submitCount]);

  function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: "usernameEntered", value: state.username.value });
    dispatch({ type: "passwordEntered", value: state.password.value });
    dispatch({ type: "submitForm" });
  }

  return (
    <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input onChange={e => dispatch({ type: "usernameEntered", value: e.target.value })} name="username" className={"form-control form-control-sm input-dark " + (state.username.isToFill ? "is-invalid" : "")} type="text" placeholder="Username" autoComplete="off" />

          <CSSTransition in={state.username.isToFill} timeout={330} classNames="liveValidateMessage" unmountOnExit>
            <div
              style={{
                top: "30px",
                bottom: "-48px",
                paddingBottom: "6px"
              }}
              className="alert alert-danger small liveValidateMessage"
            >
              {state.username.message}
            </div>
          </CSSTransition>
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input onChange={e => dispatch({ type: "passwordEntered", value: e.target.value })} name="password" className="form-control form-control-sm input-dark" type="password" placeholder="Password" />

          <CSSTransition in={state.password.isToFill} timeout={330} classNames="liveValidateMessage" unmountOnExit>
            <div
              style={{
                top: "30px",
                bottom: "-48px",
                paddingBottom: "6px"
              }}
              className="alert alert-danger small liveValidateMessage"
            >
              {state.password.message}
            </div>
          </CSSTransition>
        </div>
        <div className="col-md-auto">
          <button className="btn btn-success btn-sm">Sign In</button>
        </div>
      </div>
    </form>
  );
}

export default HeaderLoggedOut;
