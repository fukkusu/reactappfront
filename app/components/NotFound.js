import React from "react";
import Page from "./Page";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <Page title="Not Found">
      <div className="text-center">
        <h2>Hm. Somebody has probably stolen that content.</h2>
        <p className="lead text-muted">
          You can always visit the <Link to="/">homepage</Link> to get a fresh start
        </p>
      </div>
    </Page>
  );
}

export default NotFound;
