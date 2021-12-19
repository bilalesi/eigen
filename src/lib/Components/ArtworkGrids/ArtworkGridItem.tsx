import { ContextModule, OwnerType, ScreenOwnerType, tappedMainArtworkGrid } from "@artsy/cohesion"
import { ArtworkGridItem_artwork } from "__generated__/ArtworkGridItem_artwork.graphql"
import { filterArtworksParams } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "lib/navigation/navigate"
import { GlobalStore } from "lib/store/GlobalStore"
import { getUrgencyTag } from "lib/utils/getUrgencyTag"
import { PlaceholderBox, PlaceholderRaggedText, RandomNumberGenerator } from "lib/utils/placeholders"
import { userHadMeaningfulInteraction } from "lib/utils/userHadMeaningfulInteraction"
import { Box, Flex, Sans, Spacer, Text, TextProps, Touchable } from "palette"
import React, { useRef } from "react"
import { View } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"
import { useTracking } from "react-tracking"
import { useCustomShareSheetStore } from "../CustomShareSheet/CustomShareSheetStore"

export interface ArtworkProps {
  relay: RelayProp
  artwork: ArtworkGridItem_artwork
  // If it's not provided, then it will push just the one artwork
  // to the switchboard.
  onPress?: (artworkID: string) => void
  trackingFlow?: string
  contextModule?: string
  // Pass Tap to override generic ing, used for home tracking in rails
  trackTap?: (artworkSlug: string, index?: number) => void
  itemIndex?: number
  // By default, we don't track clicks from the grid unless you pass in a contextScreenOwnerType.
  contextScreenOwnerType?: ScreenOwnerType
  contextScreenOwnerId?: string
  contextScreenOwnerSlug?: string
  contextScreenQuery?: string
  contextScreen?: string
  // Hide urgency tags (3 Days left, 1 hour left)
  hideUrgencyTags?: boolean
  // Hide partner name
  hidePartner?: boolean
  // Show the lot number (Lot 213)
  showLotLabel?: boolean
  // styles for each field: allows for customization of each field
  urgencyTagTextStyle?: TextProps
  lotLabelTextStyle?: TextProps
  artistNamesTextStyle?: TextProps
  titleTextStyle?: TextProps
  saleInfoTextStyle?: TextProps
  partnerNameTextStyle?: TextProps
  // allows for artwork to be added to recent searches
  updateRecentSearchesOnTap?: boolean
}

export const Artwork: React.FC<ArtworkProps> = ({
  relay,
  artwork,
  onPress,
  trackTap,
  itemIndex,
  contextScreenOwnerId,
  contextScreenOwnerSlug,
  contextScreenOwnerType,
  contextScreenQuery,
  contextScreen,
  hideUrgencyTags = false,
  hidePartner = false,
  showLotLabel = false,
  urgencyTagTextStyle,
  lotLabelTextStyle,
  artistNamesTextStyle,
  titleTextStyle,
  saleInfoTextStyle,
  partnerNameTextStyle,
  updateRecentSearchesOnTap = false,
}) => {
  const itemRef = useRef<any>()
  const tracking = useTracking()
  const sharesheet = useCustomShareSheetStore()

  let filterParams: any

  // This is needed to make sure the filter context is defined
  if (ArtworksFiltersStore.useStore()) {
    const appliedFilters = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
    filterParams = filterArtworksParams(appliedFilters)
  }

  const addArtworkToRecentSearches = () => {
    if (updateRecentSearchesOnTap) {
      GlobalStore.actions.search.addRecentSearch({
        type: "AUTOSUGGEST_RESULT_TAPPED",
        props: {
          imageUrl: artwork?.image?.url ?? null,
          href: artwork.href,
          slug: artwork.slug,
          displayLabel: `${artwork.artistNames}, ${artwork.title} (${artwork.date})`,
          __typename: "Artwork",
          displayType: "Artwork",
        },
      })
    }
  }

  const handleTap = () => {
    addArtworkToRecentSearches()
    trackArtworkTap()
    onPress && artwork.slug ? onPress(artwork.slug) : navigate(artwork.href!)
  }

  const trackArtworkTap = () => {
    // Unless you explicitly pass in a tracking function or provide a contextScreenOwnerType, we won't track
    // taps from the grid.
    if (trackTap || contextScreenOwnerType) {
      const genericTapEvent = tappedMainArtworkGrid({
        contextScreen,
        contextScreenOwnerType: contextScreenOwnerType!,
        contextScreenOwnerId,
        contextScreenOwnerSlug,
        destinationScreenOwnerId: artwork.internalID,
        destinationScreenOwnerSlug: artwork.slug,
        position: itemIndex,
        // This is always a string; types are incorrect
        sort: String(filterParams?.sort),
        query: contextScreenQuery,
      })

      trackTap ? trackTap(artwork.slug, itemIndex) : tracking.trackEvent(genericTapEvent)
    }
  }

  const saleInfo = saleMessageOrBidInfo({ artwork })

  const urgencyTag = getUrgencyTag(artwork?.sale?.endAt)

  return (
    <Touchable
      onPress={() => handleTap()}
      onLongPress={[
        {
          title: artwork.isSaved ? "Remove from saved" : "Save",
          systemIcon: artwork.isSaved ? "heart.fill" : "heart",
          onPress: () => {
            commitMutation(relay.environment, {
              mutation: graphql`
                mutation ArtworkGridItemSaveMutation($input: SaveArtworkInput!) {
                  saveArtwork(input: $input) {
                    artwork {
                      id
                      is_saved: isSaved
                    }
                  }
                }
              `,
              variables: { input: { artworkID: artwork.internalID, remove: artwork.isSaved } },
              optimisticResponse: { saveArtwork: { artwork: { id: artwork.id, is_saved: !artwork.isSaved } } },
              onCompleted: () =>
                userHadMeaningfulInteraction({
                  contextModule: ContextModule.artworkMetadata,
                  contextOwnerType: OwnerType.artwork,
                  contextOwnerId: artwork.internalID,
                  contextOwnerSlug: artwork.slug,
                }),
            })
          },
        },
        {
          title: "Share",
          systemIcon: "square.and.arrow.up",
          onPress: () => sharesheet.show({ type: "artwork", slug: artwork.slug }),
        },
      ]}
    >
      <View ref={itemRef}>
        {!!artwork.image && (
          <View>
            <OpaqueImageView aspectRatio={artwork.image?.aspectRatio ?? 1} imageURL={artwork.image?.url} />
            {Boolean(!hideUrgencyTags && urgencyTag && artwork?.sale?.isAuction && !artwork?.sale?.isClosed) && (
              <Flex
                position="absolute"
                bottom="5px"
                left="5px"
                backgroundColor="white"
                px="5px"
                py="3px"
                borderRadius={2}
                alignSelf="flex-start"
              >
                <Sans size="2" color="black100" numberOfLines={1} {...urgencyTagTextStyle}>
                  {urgencyTag}
                </Sans>
              </Flex>
            )}
          </View>
        )}
        <Box mt={1}>
          {!!showLotLabel && !!artwork.saleArtwork?.lotLabel && (
            <Text variant="xs" numberOfLines={1} caps {...lotLabelTextStyle}>
              Lot {artwork.saleArtwork.lotLabel}
            </Text>
          )}
          {!!artwork.artistNames && (
            <Text lineHeight="18" weight="regular" variant="xs" numberOfLines={1} {...artistNamesTextStyle}>
              {artwork.artistNames}
            </Text>
          )}
          {!!artwork.title && (
            <Text lineHeight="18" variant="xs" weight="regular" color="black60" numberOfLines={1} {...titleTextStyle}>
              <Text lineHeight="18" variant="xs" weight="regular" italic>
                {artwork.title}
              </Text>
              {artwork.date ? `, ${artwork.date}` : ""}
            </Text>
          )}
          {!hidePartner && !!artwork.partner?.name && (
            <Text variant="xs" lineHeight="18" color="black60" numberOfLines={1} {...partnerNameTextStyle}>
              {artwork.partner.name}
            </Text>
          )}
          {!!saleInfo && (
            <Text lineHeight="18" variant="xs" weight="medium" numberOfLines={1} {...saleInfoTextStyle}>
              {saleInfo}
            </Text>
          )}
        </Box>
      </View>
    </Touchable>
  )
}

/**
 * Get sale message or bid info
 * @example
 * "$1,000 (Starting price)"
 * @example
 * "Bidding closed"
 *  @example
 * "$1,750 (2 bids)"
 */
export const saleMessageOrBidInfo = ({
  artwork,
  isSmallTile = false,
}: {
  artwork: Readonly<{
    sale: { isAuction: boolean | null; isClosed: boolean | null } | null
    saleArtwork: {
      counts: { bidderPositions: number | null } | null | null
      currentBid: { display: string | null } | null
    } | null
    saleMessage: string | null
  }>
  isSmallTile?: boolean
}): string | null | undefined => {
  const { sale, saleArtwork } = artwork

  // Auction specs are available at https://artsyproduct.atlassian.net/browse/MX-482
  if (sale?.isAuction) {
    // The auction is closed
    if (sale.isClosed) {
      return "Bidding closed"
    }

    // The auction is open
    const bidderPositions = saleArtwork?.counts?.bidderPositions
    const currentBid = saleArtwork?.currentBid?.display
    // If there are no current bids we show the starting price with an indication that it's a new bid
    if (!bidderPositions) {
      if (isSmallTile) {
        return `${currentBid} (Bid)`
      }
      return `${currentBid} (Starting bid)`
    }

    // If there are bids we show the current bid price and the number of bids
    const numberOfBidsString = bidderPositions === 1 ? "1 bid" : `${bidderPositions} bids`
    return `${currentBid} (${numberOfBidsString})`
  }

  if (artwork.saleMessage === "Contact For Price") {
    return "Contact for price"
  }

  return artwork.saleMessage
}

export default createFragmentContainer(Artwork, {
  artwork: graphql`
    fragment ArtworkGridItem_artwork on Artwork {
      title
      date
      saleMessage
      slug
      id
      internalID
      artistNames
      href
      isSaved
      sale {
        isAuction
        isClosed
        displayTimelyAt
        endAt
      }
      saleArtwork {
        counts {
          bidderPositions
        }
        currentBid {
          display
        }
        lotLabel
      }
      partner {
        name
      }
      image {
        url(version: "large")
        aspectRatio
      }
    }
  `,
})

export const ArtworkGridItemPlaceholder: React.FC<{ seed?: number }> = ({ seed = Math.random() }) => {
  const rng = new RandomNumberGenerator(seed)
  return (
    <Flex>
      <PlaceholderBox height={rng.next({ from: 50, to: 150 })} width="100%" />
      <Spacer mb="1" />
      <PlaceholderRaggedText seed={rng.next()} numLines={2} />
    </Flex>
  )
}
