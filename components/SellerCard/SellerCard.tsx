import { Image } from '@components/Image'
import styles from './SellerCard.module.css'

type Props = {
  name: string
  description: string
  image: string
}

export const SellerCard = ({ description, name, image }: Props) => {
  return (
    <div className={styles.card}>
      <Image
        className={styles.image}
        src={image}
        alt={name}
        height={175}
        width={175}
        aspectRatio="1:1"
        fit="fill"
        priority
      />
      <div className={styles.content}>
        <h1>{name}</h1>
        <p>{description}</p>
      </div>
    </div>
  )
}
