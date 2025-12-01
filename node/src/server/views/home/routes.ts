import type { AddRoutesFn } from "@/server/types/add-route";
import { sectionCookieEditor_addRoutes } from "./section-cookie-editor/api";

export const homePage_addRoutes: AddRoutesFn = ({ app, logger }) => {
  app.get('/', (req, res) => {
    res.render('home/page', { title: 'Home' });
  });

  sectionCookieEditor_addRoutes({ app, logger });
};