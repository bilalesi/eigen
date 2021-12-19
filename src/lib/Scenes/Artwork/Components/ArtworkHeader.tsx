import { ArtworkHeader_artwork } from "__generated__/ArtworkHeader_artwork.graphql"
import { useCustomShareSheetStore } from "lib/Components/CustomShareSheet/CustomShareSheetStore"
import { useDevToggle } from "lib/store/GlobalStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, Flex, Spacer } from "palette"
import React, { useState } from "react"
import { Button, Modal } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { ArtworkActionsFragmentContainer as ArtworkActions } from "./ArtworkActions"
import { ArtworkTombstoneFragmentContainer as ArtworkTombstone } from "./ArtworkTombstone"
import { ImageCarouselFragmentContainer } from "./ImageCarousel/ImageCarousel"
import { InstagramStoryViewShot } from "./InstagramStoryViewShot"

interface ArtworkHeaderProps {
  artwork: ArtworkHeader_artwork
}

export const ArtworkHeader: React.FC<ArtworkHeaderProps> = (props) => {
  const { artwork } = props
  const screenDimensions = useScreenDimensions()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const debugInstagramShot = useDevToggle("DTShowInstagramShot")
  const [showInstagramShot, setShowInstagramShot] = useState(false)
  const sharesheet = useCustomShareSheetStore()

  const currentImage = (artwork.images ?? [])[currentImageIndex]
  const currentImageUrl = (currentImage?.url ?? "").replace(":version", "normalized")

  return (
    <>
      <Box>
        <Spacer mb={2} />
        <ImageCarouselFragmentContainer
          images={artwork.images as any /* STRICTNESS_MIGRATION */}
          cardHeight={screenDimensions.width >= 375 ? 340 : 290}
          onImageIndexChange={(imageIndex) => setCurrentImageIndex(imageIndex)}
        />

        {debugInstagramShot ? <Button title="debug instagram shot" onPress={() => setShowInstagramShot(true)} /> : null}

        <Flex alignItems="center" mt={2}>
          <ArtworkActions
            artwork={artwork}
            shareOnPress={() => sharesheet.show({ type: "artwork", slug: artwork.slug, currentImageIndex })}
          />
        </Flex>
        <Spacer mb={2} />
        <Box px={2}>
          <ArtworkTombstone artwork={artwork} />
        </Box>
      </Box>

      {debugInstagramShot && showInstagramShot ? (
        <Modal visible={showInstagramShot} onRequestClose={() => setShowInstagramShot(false)}>
          <InstagramStoryViewShot
            // @ts-ignore
            shotRef={undefined}
            href={currentImageUrl}
            artist={artwork.artists![0]?.name!}
            title={artwork.title!}
          />
          <Flex position="absolute" top={100} left={0}>
            <Button title="close instagram shot" onPress={() => setShowInstagramShot(false)} />
          </Flex>
        </Modal>
      ) : null}
    </>
  )
}

export const ArtworkHeaderFragmentContainer = createFragmentContainer(ArtworkHeader, {
  artwork: graphql`
    fragment ArtworkHeader_artwork on Artwork {
      ...ArtworkActions_artwork
      ...ArtworkTombstone_artwork
      images {
        ...ImageCarousel_images
        url: imageURL
        imageVersions
      }
      title
      href
      internalID
      slug
      artists {
        name
      }
    }
  `,
})
