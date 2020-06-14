import React, { FC } from "react";
import { Switch, BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { Layout } from "../components";
import { Predict, Trainig } from "../pages";

export const RoutedApp: FC = () => {
    return (
        <Router>
            <Layout>
                <Switch>
                    <Route path="/training" exact>
                        <Trainig />
                    </Route>
                    <Route path="/predict" exact>
                        <Predict />
                    </Route>
                    <Route path="/" exact>
                        <Redirect to="/predict" />
                    </Route>
                </Switch>
            </Layout>
        </Router>
    );
};
