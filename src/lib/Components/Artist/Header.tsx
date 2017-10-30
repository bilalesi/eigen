import * as PropTypes from "prop-types"
import * as React from "react"
import { Schema, Track, track as _track } from "../../utils/track"

import { createFragmentContainer, graphql } from "react-relay"

import { Dimensions, NativeModules, StyleSheet, TextStyle, View, ViewStyle } from "react-native"
const { ARTemporaryAPIModule } = NativeModules

import Events from "../../NativeModules/Events"

import colors from "../../../data/colors"
import InvertedButton from "../Buttons/InvertedButton"
import Headline from "../Text/Headline"
import SerifText from "../Text/Serif"

const isPad = Dimensions.get("window").width > 700

// tslint:disable-next-line:no-empty-interface
interface Props extends RelayProps {}

interface State {
  following: boolean
  followersCount: number
}

const track: Track<Props, State, Schema.Entity> = _track

@track()
class Header extends React.Component<Props, State> {
  static propTypes = {
    artist: PropTypes.shape({
      name: PropTypes.string,
      nationality: PropTypes.string,
      birthday: PropTypes.string,
      counts: PropTypes.shape({
        follows: PropTypes.number,
      }),
    }),
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      following: false,
      followersCount: props.artist.counts.follows as number,
    }
  }

  componentDidMount() {
    NativeModules.ARTemporaryAPIModule.followStatusForArtist(this.props.artist._id, (error, following) => {
      this.setState({ following })
    })
  }

  render() {
    const artist = this.props.artist
    return (
      <View style={{ paddingTop: 20 }}>
        <Headline style={[styles.base, styles.headline]}>
          {artist.name}
        </Headline>
        {this.renderByline()}
        {this.renderFollowersCount()}
        {this.renderFollowButton()}
      </View>
    )
  }

  renderFollowButton() {
    if (this.state.following !== null) {
      return (
        <View style={styles.followButton}>
          <InvertedButton
            text={this.state.following ? "Following" : "Follow"}
            selected={this.state.following}
            onPress={this.handleFollowChange.bind(this)}
          />
        </View>
      )
    }
  }

  renderFollowersCount() {
    const count = this.state.followersCount
    const followerString = count + (count === 1 ? " Follower" : " Followers")
    return (
      <SerifText style={[styles.base, styles.followCount]}>
        {followerString}
      </SerifText>
    )
  }

  renderByline() {
    const artist = this.props.artist
    const bylineRequired = artist.nationality || artist.birthday
    if (bylineRequired) {
      return (
        <View>
          <SerifText style={styles.base}>
            {this.descriptiveString()}
          </SerifText>
        </View>
      )
    } else {
      return null
    }
  }

  descriptiveString() {
    const artist = this.props.artist
    const descriptiveString = (artist.nationality || "") + this.birthdayString()
    return descriptiveString
  }

  birthdayString() {
    const birthday = this.props.artist.birthday
    if (!birthday) {
      return ""
    }

    const leadingSubstring = this.props.artist.nationality ? ", b." : ""

    if (birthday.includes("born")) {
      return birthday.replace("born", leadingSubstring)
    } else if (birthday.includes("Est.") || birthday.includes("Founded")) {
      return " " + birthday
    }

    return leadingSubstring + " " + birthday
  }

  @track((props, state) => ({
    action_name: state.following ? Schema.ActionEventNames.artistUnfollow : Schema.ActionEventNames.artistFollow,
    action_type: Schema.ActionEventTypes.tap,
    owner_id: props.artist._id,
    owner_slug: props.artist.id,
    owner_type: Schema.OwnerEntityTypes.artist,
  }))
  handleFollowChange() {
    const newFollowersCount = this.state.following ? this.state.followersCount - 1 : this.state.followersCount + 1
    ARTemporaryAPIModule.setFollowArtistStatus(!this.state.following, this.props.artist._id, (error, following) => {
      if (error) {
        console.warn(error)
        this.failedFollowChange()
      } else {
        this.successfulFollowChange()
      }
      this.setState({ following, followersCount: newFollowersCount })
    })
    this.setState({ following: !this.state.following, followersCount: newFollowersCount })
  }

  @track((props, state) => ({
    action_name: state.following ? Schema.ActionEventNames.artistUnfollow : Schema.ActionEventNames.artistFollow,
    action_type: Schema.ActionEventTypes.success,
    owner_id: props.artist._id,
    owner_slug: props.artist.id,
    owner_type: Schema.OwnerEntityTypes.artist,
  }))
  successfulFollowChange() {
    // callback for analytics purposes
  }

  @track((props, state) => ({
    action_name: state.following ? Schema.ActionEventNames.artistUnfollow : Schema.ActionEventNames.artistFollow,
    action_type: Schema.ActionEventTypes.fail,
    owner_id: props.artist._id,
    owner_slug: props.artist.id,
    owner_type: Schema.OwnerEntityTypes.artist,
  }))
  failedFollowChange() {
    // callback for analytics purposes
  }
}

interface Styles {
  base: TextStyle
  headline: TextStyle
  followCount: TextStyle
  followButton: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  base: {
    textAlign: "center",
  },
  headline: {
    fontSize: 14,
  },
  followCount: {
    color: colors["gray-semibold"],
    marginBottom: 30,
  },
  followButton: {
    height: 40,
    width: isPad ? 330 : null,
    alignSelf: isPad ? "center" : null,
    marginLeft: 0,
    marginRight: 0,
  },
})

export default createFragmentContainer(
  Header,
  graphql`
    fragment Header_artist on Artist {
      _id
      id
      name
      nationality
      birthday
      counts {
        follows
      }
    }
  `
)

interface RelayProps {
  artist: {
    _id: string
    id: string
    name: string | null
    nationality: string | null
    birthday: string | null
    counts: {
      follows: boolean | number | string | null
    } | null
  }
}
