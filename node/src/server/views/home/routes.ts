import type { AddRoutesFn } from "@/server/types/add-route";

export const homePage_addRoutes: AddRoutesFn = ({ app, logger }) => {
  app.get('/', (req, res) => {
    res.render('home/page', { title: 'Home' });
  });
};