import { EVENT_TRACKED_LOGGERS_ACTIVE } from "../hideLoggers"
import { TrackingProvider } from "./providers"

export const ConsoleTrackingProvider: TrackingProvider = {
  identify: (userId, traits) => {
    if (!__DEV__) {
      return
    }
    if (EVENT_TRACKED_LOGGERS_ACTIVE) {
      console.log("[Event tracked]", JSON.stringify({ userId, ...traits }, null, 2))
    }
  },

  postEvent: (info) => {
    if (!__DEV__) {
      return
    }
    if (EVENT_TRACKED_LOGGERS_ACTIVE) {
      console.log("[Event tracked]", JSON.stringify(info, null, 2))
    }
  },
}
