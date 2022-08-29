import styles from './ProductCard.module.css'
import Image from 'next/future/image'
import Link from 'next/link'

type Props = {
  name: string
  image: string
}

export const ProductCard = ({ image, name }: Props) => {
  return (
    <Link href="/">
      <a>
        <div className={styles.card}>
          <Image
            className={styles.image}
            src={image}
            alt="Description"
            width={800}
            height={800}
            priority
          />
          <p className={styles.description}>{name}</p>
        </div>
      </a>
    </Link>
  )
}
