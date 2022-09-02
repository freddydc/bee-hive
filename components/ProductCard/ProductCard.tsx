import styles from './ProductCard.module.css'
import Image from 'next/future/image'
import Link from 'next/link'

type Props = {
  name: string
  image: string
  slug: string
}

export const ProductCard = ({ image, name, slug }: Props) => {
  return (
    <Link href={`products/${slug}`}>
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
