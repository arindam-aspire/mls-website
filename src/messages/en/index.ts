import auth from "./auth.json" with { type: "json" };
import common from "./common.json" with { type: "json" };
import home from "./home.json" with { type: "json" };
import notFound from "./notFound.json" with { type: "json" };
import profile from "./profile.json" with { type: "json" };
import savedSearches from "./savedSearches.json" with { type: "json" };
import unauthorized from "./unauthorized.json" with { type: "json" };

const messages = {
  auth,
  common,
  home,
  notFound,
  profile,
  savedSearches,
  unauthorized,
};

export default messages;
