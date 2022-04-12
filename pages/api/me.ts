import { validateRoute } from "../../lib/auth";

// re-wrap
export default validateRoute((req, res, user) => {
  res.json(user);
});
