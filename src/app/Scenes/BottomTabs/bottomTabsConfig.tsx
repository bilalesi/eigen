import { OwnerType, TappedTabBarArgs } from "@artsy/cohesion"
import { BottomTabType } from "./BottomTabType"

export type BottomTabRoute = "/" | "/search" | "/inbox" | "/sales" | "/collector-profile"
export const BottomTabRoutes = ["/", "/search", "/inbox", "/sales", "/collector-profile"]

export const bottomTabsConfig: {
  [k in BottomTabType]: {
    route: BottomTabRoute
    analyticsDescription: TappedTabBarArgs["tab"]
  }
} = {
  home: {
    route: "/",
    analyticsDescription: OwnerType.home,
  },
  search: {
    route: "/search",
    analyticsDescription: OwnerType.search,
  },
  inbox: {
    route: "/inbox",
    analyticsDescription: OwnerType.inbox,
  },
  sell: {
    route: "/sales",
    analyticsDescription: OwnerType.sell,
  },
  profile: {
    route: "/collector-profile",
    analyticsDescription: OwnerType.profile,
  },
}
