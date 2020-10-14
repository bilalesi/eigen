jest.mock("../../../../../utils/googleMaps", () => ({ queryLocation: jest.fn() }))

import { InquiryModalTestsQuery } from "__generated__/InquiryModalTestsQuery.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { Input } from "lib/Components/Input/Input"
import { extractText } from "lib/tests/extractText"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { ArtworkInquiryStateProvider } from "lib/utils/ArtworkInquiry/ArtworkInquiryStore"
import { queryLocation } from "lib/utils/googleMaps"
import { Touchable } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act, ReactTestInstance } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { InquiryModalFragmentContainer } from "../InquiryModal"
import { LocationAutocomplete } from "../LocationAutocomplete"
import { ShippingModal } from "../ShippingModal"
jest.unmock("react-relay")

let env: ReturnType<typeof createMockEnvironment>

// TODO: add the other modal props
const modalProps = {
  modalIsVisible: true,
  toggleVisibility: jest.fn(),
}

const TestRenderer = () => (
  <QueryRenderer<InquiryModalTestsQuery>
    environment={env}
    query={graphql`
      query InquiryModalTestsQuery @relay_test_operation {
        artwork(id: "pumpkins") {
          ...InquiryModal_artwork
        }
      }
    `}
    variables={{}}
    render={({ props, error }) => {
      if (Boolean(props?.artwork)) {
        return (
          <ArtworkInquiryStateProvider>
            <InquiryModalFragmentContainer artwork={props!.artwork!} {...modalProps} />
          </ArtworkInquiryStateProvider>
        )
      } else if (Boolean(error)) {
        console.log(error)
      }
    }}
  />
)

const getWrapper = (
  mockResolvers = {
    Artwork: () => ({
      inquiryQuestions: [
        { question: "Price & Availability" },
        { question: "Shipping" },
        { question: "History & Provenance" },
      ],
    }),
  }
) => {
  const tree = renderWithWrappers(<TestRenderer />)
  act(() => {
    env.mock.resolveMostRecentOperation((operation) => {
      return MockPayloadGenerator.generate(operation, mockResolvers)
    })
  })
  return tree
}

beforeEach(() => {
  env = createMockEnvironment()
})

const press = (
  ti: ReactTestInstance,
  { text = "", componentType = TouchableOpacity }: { text?: string | RegExp; componentType?: React.ComponentType }
) => {
  const touchables = ti.findAllByType(componentType, { deep: true }).filter((t) => {
    return extractText(t).match(text)
  })
  const touchable = touchables[0]
  if (Boolean(touchable) && Boolean(touchable.props.onPress)) {
    act(() => {
      touchable.props.onPress()
    })
  }
}

describe("<InquiryModal />", () => {
  it("renders the modal", () => {
    const tree = getWrapper()
    expect(extractText(tree.root)).toContain("What information are you looking for?")
  })

  describe("user can select 'Price & Availability'", () => {
    it("user tapping the inquiry question does not expose the shipping dropdown", () => {
      const wrapper = getWrapper()
      press(wrapper.root, { text: "Price & Availability" })

      expect(extractText(wrapper.root)).not.toContain("Add your location")
    })
    it.todo("user taps checkbox and option is selected")
  })

  describe("user can select 'Condition & Provenance'", () => {
    it("user tapping the inquiry question does not expose the shipping dropdown", () => {
      const wrapper = getWrapper()
      press(wrapper.root, { text: "Condition & Provenance" })

      expect(extractText(wrapper.root)).not.toContain("Add your location")
    })
    it.todo("user taps checkbox and option is selected")
  })

  describe("user can select Shipping", () => {
    it("user tapping the inquiry question exposes the shipping dropdown", () => {
      const wrapper = getWrapper()
      press(wrapper.root, { text: "Shipping" })

      expect(extractText(wrapper.root)).toContain("Add your location")
    })
    it("user can visit shipping modal", async () => {
      const wrapper = getWrapper()
      press(wrapper.root, { text: "Shipping" })

      expect(extractText(wrapper.root)).toContain("Add your location")
      expect(wrapper.root.findByType(ShippingModal).props.modalIsVisible).toBeFalsy()

      press(wrapper.root, { text: /^Add your location/ })

      expect(wrapper.root.findByType(ShippingModal).props.modalIsVisible).toBeTruthy()
      const header = wrapper.root.findByType(ShippingModal).findByType(FancyModalHeader)
      expect(extractText(header)).toContain("Add Location")
    })

    it("User adds a location from the shipping modal", async () => {
      ;(queryLocation as jest.Mock).mockResolvedValue([
        { id: "a", name: "Coxsackie, NY, USA" },
        { id: "b", name: "Coxs Creek, KY, USA" },
      ])
      const wrapper = getWrapper()
      press(wrapper.root, { text: "Shipping" })
      press(wrapper.root, { text: /^Add your location/ })

      const locationModal = wrapper.root.findByType(LocationAutocomplete)
      const locationInput = locationModal.findByType(Input)
      await act(async () => {
        locationInput.props.onChangeText("Cox")
        await flushPromiseQueue()
      })
      expect(wrapper.root.findAllByProps({ "data-test-id": "dropdown" }).length).not.toEqual(0)
      expect(extractText(wrapper.root)).toContain("Coxsackie, NY, USA")

      press(wrapper.root, { text: "Coxsackie, NY, USA", componentType: Touchable })
      expect(wrapper.root.findByType(Input).props.value).toEqual("Coxsackie, NY, USA")
      expect(wrapper.root.findAllByProps({ "data-test-id": "dropdown" }).length).toEqual(0)

      press(wrapper.root, { text: "Apply" })
      expect(wrapper.root.findByType(ShippingModal).props.modalIsVisible).toBeFalsy()

      expect(extractText(wrapper.root)).toContain("Coxsackie, NY, USA")
    })
  })
})
