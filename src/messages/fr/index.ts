import auth from "./auth.json" with { type: "json" };
import common from "./common.json" with { type: "json" };
import dashboard from "./dashboard.json" with { type: "json" };
import home from "./home.json" with { type: "json" };
import contact from "./contact.json" with { type: "json" };
import leads from "./leads.json" with { type: "json" };
import metadata from "./metadata.json" with { type: "json" };
import notFound from "./notFound.json" with { type: "json" };
import notifications from "./notifications.json" with { type: "json" };
import profile from "./profile.json" with { type: "json" };
import propertyList from "./propertyList.json" with { type: "json" };
import savedSearches from "./savedSearches.json" with { type: "json" };
import unauthorized from "./unauthorized.json" with { type: "json" };
import user from "./user.json" with { type: "json" };

const messages = {
  auth,
  common,
  dashboard,
  home,
  contact,
  leads,
  metadata,
  notFound,
  notifications,
  profile,
  propertyList,
  savedSearches,
  unauthorized,
  user,
};

export default messages;
