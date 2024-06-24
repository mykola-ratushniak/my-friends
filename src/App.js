import {AppRouter} from "./components/AppRouter";
import {publicRoutes} from "./routes";

export const App = () => {
    const imports = [AppRouter];

    const template = `
    <div>
        <AppRouter routes={routes} defaultRoute={defaultRoute} />
    </div>`

    const attach = {
        routes: publicRoutes,
        defaultRoute: publicRoutes[1],
    }

    return {imports, template, attach};
}
