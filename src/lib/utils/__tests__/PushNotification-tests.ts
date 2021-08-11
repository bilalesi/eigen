import AsyncStorage from "@react-native-community/async-storage"
import { navigate } from "lib/navigation/navigate"
import { __globalStoreTestUtils__, GlobalStore } from "lib/store/GlobalStore"
import { PendingPushNotification } from "lib/store/PendingPushNotificationModel"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import { Platform } from "react-native"
import PushNotification from "react-native-push-notification"
import { ASYNC_STORAGE_PUSH_NOTIFICATIONS_KEY } from "../AdminMenu"
import * as Push from "../PushNotification"

Object.defineProperty(Platform, "OS", { get: jest.fn(() => "android") }) // We only use this for android only for now
const mockFetch = jest.fn()

;(global as any).fetch = mockFetch

function mockFetchJsonOnce(json: object, status: number = 200) {
  mockFetch.mockResolvedValueOnce({
    status,
    json: () => Promise.resolve(json),
  })
}

beforeEach(() => {
  mockFetch.mockClear()
})

describe("Push Notification Tests", () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await AsyncStorage.clear()
  })

  afterAll(async () => {
    jest.clearAllMocks()
    await AsyncStorage.clear()
  })

  it("Initialises when feature flag is true", async () => {
    await AsyncStorage.setItem(ASYNC_STORAGE_PUSH_NOTIFICATIONS_KEY, "true")

    await Push.configure()
    expect(PushNotification.configure).toHaveBeenCalled()
  })

  it("Does not when feature flag is false", async () => {
    await AsyncStorage.setItem(ASYNC_STORAGE_PUSH_NOTIFICATIONS_KEY, "false")
    await Push.configure()
    expect(PushNotification.configure).not.toHaveBeenCalled()
  })

  describe("saveToken", () => {
    it("sends token to gravity if user is logged in", async () => {
      mockFetchJsonOnce({
        xapp_token: "xapp-token",
        expires_in: "never",
      })
      await GlobalStore.actions.auth.getXAppToken()
      mockFetch.mockClear()
      // log user in
      mockFetchJsonOnce(
        {
          access_token: "auth-access-token",
          expires_in: "1000years",
        },
        201
      )
      mockFetchJsonOnce({
        id: "userid",
      })
      await GlobalStore.actions.auth.signIn({
        email: "user@example.com",
        password: "mypassword",
      })

      mockFetch.mockClear()
      mockFetchJsonOnce({}, 201)

      await Push.saveToken("pushnotificationtoken")
      await flushPromiseQueue()
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    it("does not try to save token to gravity when user is Not logged in", async () => {
      expect(Push.saveToken("sometoken")).rejects.toMatch("Push Notification: No access token")

      expect(mockFetch).not.toHaveBeenCalled()
    })
  })

  describe("Handling Notifications", () => {
    const notification = {
      channelId: "fcm_fallback_notification_channel",
      color: null,
      data: { url: "https://www.artsy.net/artwork/fabrice-monteiro-signares-number-3-goree", id: "0" },
      finish: () => {
        //
      },
      badge: 0,
      alert: {},
      foreground: true,
      id: 411091002,
      message: "New Works by Artists you love!",
      priority: "high",
      smallIcon: "ic_notification",
      sound: "default",
      tag: null,
      title: "New Works by Artists you love!",
      userInteraction: true, // notification was tapped
    }

    it("Saves tapped notification When a user is not logged in", () => {
      Push.handleReceivedNotification(notification)
      expect(__globalStoreTestUtils__?.getCurrentState().pendingPushNotification.notification).toHaveProperty(
        "tappedAt"
      )
      expect(__globalStoreTestUtils__?.getCurrentState().pendingPushNotification.notification?.data).toEqual(
        notification.data
      )
      // notification is not handled
      expect(navigate).not.toHaveBeenCalled()
    })

    it("Handles tapped notification instantly if user is logged in", async () => {
      mockFetchJsonOnce({
        xapp_token: "xapp-token",
        expires_in: "never",
      })
      await GlobalStore.actions.auth.getXAppToken()
      mockFetch.mockClear()
      // log user in
      mockFetchJsonOnce(
        {
          access_token: "auth-access-token",
          expires_in: "1000years",
        },
        201
      )
      mockFetchJsonOnce({
        id: "userid",
      })
      await GlobalStore.actions.auth.signIn({
        email: "user@example.com",
        password: "mypassword",
      })

      mockFetch.mockClear()
      mockFetchJsonOnce({}, 201)

      await flushPromiseQueue()

      Push.handleReceivedNotification(notification)
      expect(navigate).toHaveBeenNthCalledWith(1, notification.data.url, {
        passProps: notification.data,
      })
    })

    it("Pending Notification: navigates to appropriate screen when called", () => {
      Push.handleReceivedNotification(notification)
      const pendingNotification = __globalStoreTestUtils__?.getCurrentState().pendingPushNotification.notification
      Push.handlePendingNotification(pendingNotification as PendingPushNotification)
      expect(navigate).toHaveBeenNthCalledWith(1, notification.data.url, {
        passProps: notification.data,
      })
    })
  })

  describe("Channels and Local Notifications", () => {
    it("creates Channel", async () => {
      const testChannel = { id: "test_channel_id", name: "test_channel_name" }
      Push.createChannel(testChannel.id, testChannel.name)
      expect(PushNotification.createChannel).toHaveBeenCalled()
    })
    it("creates LocalNotification", () => {
      const notification = {
        data: { channelId: Push.CHANNELS[0].id },
        title: "A test push notification",
        foreground: true,
        userInteraction: false,
        badge: 0,
        message: "A test push",
        alert: {},
        id: 22,
        sound: "default",
        // tslint:disable-next-line:no-empty
        finish: () => {},
      }

      PushNotification.channelExists = jest.fn().mockImplementationOnce((_, cb) => {
        cb(true)
      })

      Push.createLocalNotification(notification)
      expect(PushNotification.createChannel).not.toHaveBeenCalled()
      expect(PushNotification.localNotification).toHaveBeenCalled()

      notification.data = { channelId: "unknown_channel_id" }
      PushNotification.channelExists = jest.fn().mockImplementationOnce((_, cb) => {
        cb(false)
      })
      Push.createLocalNotification(notification)
      expect(PushNotification.createChannel).toHaveBeenCalled()
      expect(PushNotification.localNotification).toHaveBeenCalled()
    })
  })
})