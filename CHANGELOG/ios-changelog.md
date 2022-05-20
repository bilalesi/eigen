## Undeployed Changes

### v7.3.7

- Status: **Beta**
- Changelog:

  - User facing changes:

    - Allow My Collection artworks without artists - ole
    - fix cta color inside a conversation - araujobarret
    - The changes are applicable to all users in all platforms.
    - Change Primary CTA on 'sold' artworks pages to "create an alert" - dimatretyak
    - Add my collection empty state - mounir
    - Sale Listings on Eigen show correct subtitle - kizito
    - add my collection insights loading placeholder - mounir
    - add the "open more market insights" banner to the new Insights tab -daria
    - MyCollection placeholder improvements (related to my collection insights) -daria
    - Create Alert button opens up modal pre-filled with relevant filters on artwork screen - dimatretyak
    - move faq section on artwork screen - gkartalis
    - Use network-and-store fetch policy for Artwork and Sales/Auctions screen
    - add new info modal -daria
    - Auctions Countdown Progress Bar - kizito
    - Add detailed Auctions Info to SalesHeader - Anna, Kizito
    - Create Alert button opens up modal pre-filled with relevant filters on artwork page - dimatretyak
    - UI improvements (share button positioning) -daria
    - create alert on artwork page - gkartalis
    - Align My Collection failure view - ole
    - Change copy -daria
    - add recent auction results based on artists you collect screen -daria
    - add purchase button to conversations - araujobarret
    - Show Not Found screen for missing artworks -ole
    - Add My Collection Insights Market Signals title - ole
    - This bug fix is effective for all users using the submission flow in all platforms.
    - Refresh Saved Works when saving an artwork -ole
    - Introduce "Not Found" error view with back button - ole
    - add last 3 recent auction results based on artists you collect (My Collection Insights) - daria
    - Standardize Toast Duration and Make RequestPriceEstimate Toast duration long - kizito
    - fixed truncated prices on artworkrails - gkartalis
    - Changed the alignment of the "View all" link of the <SectionTitle/> component from 'center' to 'top' -daria
    - use displayName over name in genes screen title - gkartalis
    - My Collection artwork upload with custom artists - ole
    - fix collector profile message typo - ole
    - Fix performance issues associated with MyCollectionSearch - kizito
    - update keywords - Brian
    - changed validation of the Onboarding text inputs -daria
    - sorting MyCollection Artworks for artworks without price paid. - kizito
    - Adds a toggle for order push notifications - Brian
    - Fixed rarity filter in MyCollection
    - Fix "Complete Profile" message update issue - ole
    - sort and filter for high demand index - kizito
    - The changes would be reflected on both platforms for users going through sell with artsy flow.
    - added Insights Overview section to MyCollection Insights -daria
    - Hide filters when aggregation counts are empty
    - add insights tab inside my collection - mounir

  - Dev changes:
    - updates tests for Artists screen - dimatretyak
    - Clear relay cache when app is updated - kizito
    - add my collection insights phase 1 different steps - mounir
    - Prepare SavedSearchStore for FX-3954 - dimatretyak
    - Small refactor for `SavedSearchStore` (stage №1) - dimatretyak
    - Fixed a problem with increasing file size for iOS - dimatretyak
    - display TinEye search results - dimatretyak
    - resize image for TinEye search - dimatretyak
    - Add image resizer - dimatretyak
    - upload middleware for Relay - dimatretyak
    - small refactor on Artwork Screen - gkartalis
    - upload file using GraphQL query - dimatretyak
    - Allow customizing env in beta - Brian
    - Use phased releases/rollouts for releases - brian
    - set app version to 7.3.6 - mounir
    - Fix failing sale header test - Brian
    - clean up feature flag AREnableCollectorProfile -daria
    - clean up feature flag AREnableMyCollectionComparableWorks -daria
    - Add collection insights feature flag - mounir
    - Remove the old My Collection artwork screen - ole

<!-- DO NOT CHANGE -->

## Released Changes
