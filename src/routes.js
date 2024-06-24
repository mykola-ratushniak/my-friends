import {Friends} from "./pages/Friends";
import {Auth} from "./pages/Auth";
import {NotFound} from "./pages/NotFound";
import {FRIENDS_ROUTE, LOGIN_ROUTE, NOTFOUND_ROUTE, SIGNUP_ROUTE} from "./utils/consts";

export const publicRoutes = [
    {
        path: FRIENDS_ROUTE,
        component: Friends,
    },
    {
        path: LOGIN_ROUTE,
        component: Auth,
    },
    {
        path: SIGNUP_ROUTE,
        component: Auth,
    },
    {
        path: NOTFOUND_ROUTE,
        component: NotFound,
    },
]
