import type { ImageLoader, ImageProps as NextImageProps } from 'next/image'
import NextImage from 'next/future/image'
import { useCallback } from 'react'

type AspectRatios = '1:1' | '3:2' | '4:3' | '9:12' | '16:9'

type AspectRatio = {
  width: number
  aspectRatio?: AspectRatios
}

type ImageProps = {
  fit?: 'fill' | 'crop'
  aspectRatio?: AspectRatios
} & NextImageProps

const ASPECT_RATIOS = {
  '1:1': 1,
  '3:2': 2 / 3,
  '4:3': 3 / 4,
  '9:12': 12 / 9,
  '16:9': 9 / 16,
}

function calcAspectRatio({ aspectRatio = '1:1', width }: AspectRatio) {
  const ratio = Math.floor(width * ASPECT_RATIOS[aspectRatio])
  return ratio
}

export const Image = ({
  width,
  height,
  aspectRatio,
  src,
  alt,
  fit = 'fill',
  ...imageProps
}: ImageProps) => {
  const imageLoader = useCallback<ImageLoader>(
    ({ src, width, quality }) => {
      const height = calcAspectRatio({ width, aspectRatio })
      return `${src}?w=${width}&h=${height}&fit=${fit}&q=${quality ?? 95}`
    },
    [aspectRatio, fit]
  )

  return (
    <NextImage
      src={src}
      loader={imageLoader}
      height={height}
      width={width}
      alt={alt}
      {...imageProps}
    />
  )
}
