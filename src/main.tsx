import { BrowserRouter as Router } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App.tsx";
import NavigationSetter from "./router/NavigationSetter";
import "./styles/global.scss";

createRoot(document.getElementById("root")!).render(
    <Router>
        <Provider store={store}>
            <NavigationSetter />
            <App />
        </Provider>
    </Router>
);
