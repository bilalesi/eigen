import { DecoratorFunction } from "@storybook/addons"
import { TrackProvider } from "lib/tests/renderWithWrappers"
import { ProvideScreenDimensions } from "lib/utils/useScreenDimensions"
import { Theme } from "palette"
import React from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"

export const withTheme: DecoratorFunction<React.ReactNode> = (story) => <Theme>{story()}</Theme>

export const withSafeArea: DecoratorFunction<React.ReactNode> = (story) => (
  <SafeAreaProvider>{story()}</SafeAreaProvider>
)

export const withScreenDimensions: DecoratorFunction<React.ReactNode> = (story) => (
  <SafeAreaProvider>
    <ProvideScreenDimensions>{story()}</ProvideScreenDimensions>
  </SafeAreaProvider>
)

export const withTracking: DecoratorFunction<React.ReactNode> = (story) => <TrackProvider>{story()}</TrackProvider>

/**
 * Add this as the last decorator, if you use any other decorators that use hooks in them.
 */
// @ts-ignore
export const withHooks = (Story) => <Story />
