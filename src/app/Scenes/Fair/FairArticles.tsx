import { FairArticles_fair } from "__generated__/FairArticles_fair.graphql"
import { FairArticlesQuery } from "__generated__/FairArticlesQuery.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { useEnvironment } from "app/store/GlobalStore"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { compact } from "lodash"
import { Box, Button, Join, Message, Spacer, Text, Touchable, useSpace } from "palette"
import React, { useState } from "react"
import { Dimensions, FlatList, ScrollView } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { FairEditorialShare } from "./Components/FairEditorialShare"

const FAIR2_ARTICLES_PAGE_SIZE = 10

interface FairArticlesQueryRendererProps {
  fairID: string
}

interface FairArticlesProps {
  fair: FairArticles_fair
  relay: RelayPaginationProp
}

export const FairArticles: React.FC<FairArticlesProps> = ({ fair, relay }) => {
  const space = useSpace()
  const articles = fair.articlesConnection?.edges
  const totalCount = fair.articlesConnection?.totalCount ?? 0
  const [isLoading, setIsLoading] = useState(false)

  const handlePress = () => {
    if (!relay.hasMore() || relay.isLoading()) {
      return
    }

    setIsLoading(true)

    relay.loadMore(FAIR2_ARTICLES_PAGE_SIZE, (err) => {
      setIsLoading(false)

      if (err) {
        console.error(err)
      }
    })
  }

  if (totalCount === 0) {
    return <Message>There aren’t any articles at this time.</Message>
  }

  const [{ node: heroArticle }, ...remainingArticles] = compact(articles)

  const { width: screenWidth } = Dimensions.get("screen")
  const imageWidth = screenWidth - space(4)

  const webURL = useEnvironment().webURL

  return (
    <ScrollView>
      <Box px={2} py={6}>
        <Text variant="lg">Articles</Text>

        <Spacer my={1} />

        <Join separator={<Spacer my={3} />}>
          <Touchable
            onPress={() => {
              navigate(heroArticle!.href!)
            }}
          >
            <Box position="relative">
              <OpaqueImageView
                width={imageWidth}
                height={(4 / 3) * imageWidth}
                imageURL={heroArticle!.thumbnailImage?.url}
              />

              <Box bg="white100" pt={2} px={2} width="85%" position="absolute" bottom={0} right={0}>
                <Text variant="md" mb={1}>
                  {heroArticle!.title}
                </Text>

                <Text variant="xs" color="black60">
                  {heroArticle!.author?.name}
                </Text>

                <Text variant="xs">{heroArticle!.publishedAt}</Text>

                <FairEditorialShare
                  mt={1}
                  subject={heroArticle!.title!}
                  url={`${webURL}${heroArticle!.href}`}
                />
              </Box>
            </Box>
          </Touchable>

          <FlatList<typeof remainingArticles[number]>
            data={remainingArticles}
            keyExtractor={({ node }, i) => node?.internalID ?? `${i}`}
            ItemSeparatorComponent={() => <Spacer my={3} />}
            renderItem={({ item: { node: article } }) => {
              return (
                <Touchable
                  onPress={() => {
                    navigate(article!.href!)
                  }}
                >
                  <OpaqueImageView
                    width={imageWidth}
                    height={(9 / 16) * imageWidth}
                    imageURL={article!.thumbnailImage?.url}
                  />

                  <Box width="95%">
                    <Text variant="md" mt={1} mb={1}>
                      {article!.title}
                    </Text>

                    <Text color="black60" variant="xs">
                      {article!.author?.name}
                    </Text>

                    <Text variant="xs">{article!.publishedAt}</Text>

                    <FairEditorialShare
                      mt={1}
                      subject={article!.title!}
                      url={`${webURL}${article!.href}`}
                    />
                  </Box>
                </Touchable>
              )
            }}
          />

          {totalCount > FAIR2_ARTICLES_PAGE_SIZE && (
            <Button
              variant="fillGray"
              block
              width="100%"
              loading={isLoading}
              onPress={handlePress}
              disabled={!relay.hasMore()}
            >
              Show more
            </Button>
          )}
        </Join>
      </Box>
    </ScrollView>
  )
}

export const FAIR2_ARTICLES_QUERY = graphql`
  query FairArticlesQuery($id: String!, $first: Int!, $after: String) {
    fair(id: $id) @principalField {
      ...FairArticles_fair @arguments(first: $first, after: $after)
    }
  }
`

export const FairArticlesPaginationContainer = createPaginationContainer(
  FairArticles,
  {
    fair: graphql`
      fragment FairArticles_fair on Fair
      @argumentDefinitions(first: { type: "Int" }, after: { type: "String" }) {
        slug
        articlesConnection(first: $first, after: $after)
          @connection(key: "FairArticlesQuery_articlesConnection") {
          totalCount
          edges {
            node {
              internalID
              title
              href
              author {
                name
              }
              publishedAt(format: "MMM Do, YYYY")
              thumbnailTitle
              thumbnailImage {
                url
              }
            }
          }
        }
      }
    `,
  },
  {
    query: FAIR2_ARTICLES_QUERY,
    direction: "forward",
    getVariables({ fair: { slug: id } }, { cursor: after }, { first }) {
      return { first, after, id }
    },
  }
)

export const FairArticlesQueryRenderer: React.FC<FairArticlesQueryRendererProps> = ({ fairID }) => {
  return (
    <QueryRenderer<FairArticlesQuery>
      environment={defaultEnvironment}
      query={FAIR2_ARTICLES_QUERY}
      variables={{ id: fairID, first: FAIR2_ARTICLES_PAGE_SIZE }}
      render={renderWithLoadProgress(FairArticlesPaginationContainer)}
    />
  )
}