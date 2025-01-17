import { useTimer } from "app/utils/useTimer"
import { ProgressBar } from "palette"
import React from "react"

export interface ArtworkAuctionProgressBarProps {
  startAt?: string | null
  endAt?: string | null
  extendedBiddingPeriodMinutes: number
  extendedBiddingIntervalMinutes: number
  extendedBiddingEndAt?: string | null
}

export const ArtworkAuctionProgressBar: React.FC<ArtworkAuctionProgressBarProps> = ({
  startAt,
  endAt,
  extendedBiddingPeriodMinutes,
  extendedBiddingIntervalMinutes,
  extendedBiddingEndAt,
}) => {
  const hasBeenExtended = !!extendedBiddingEndAt

  const biddingEndAt = extendedBiddingEndAt ?? endAt

  if (!biddingEndAt) {
    return null
  }

  const { time } = useTimer(biddingEndAt, startAt ?? "")
  const { days, hours, minutes, seconds } = time

  const parsedDaysUntilEnd = parseInt(days, 10)
  const parsedHoursUntilEnd = parseInt(hours, 10)
  const parsedMinutesUntilEnd = parseInt(minutes, 10)
  const parsedSecondsUntilEnd = parseInt(seconds, 10)

  const isWithinExtendedBiddingPeriod =
    parsedDaysUntilEnd < 1 &&
    parsedHoursUntilEnd < 1 &&
    parsedMinutesUntilEnd < extendedBiddingPeriodMinutes

  const extendedBiddingDuration = hasBeenExtended
    ? extendedBiddingIntervalMinutes
    : extendedBiddingPeriodMinutes

  const percentComplete =
    (parsedSecondsUntilEnd + parsedMinutesUntilEnd * 60) / (extendedBiddingDuration * 60)

  const renderProgressBar = isWithinExtendedBiddingPeriod || hasBeenExtended

  return (
    <>{renderProgressBar && <ProgressBar trackColor="red100" progress={percentComplete * 100} />}</>
  )
}
