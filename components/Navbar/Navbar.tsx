import styles from './Navbar.module.css'
import { useEffect, useState } from 'react'
import Link from 'next/link'

type LogoProps = {
  name: string
}

const BRANDS = ['🐻', '🐪']

export const Navbar = () => {
  return (
    <header className={styles.navbar}>
      <Logo name="Bee" />
    </header>
  )
}

function Logo({ name }: LogoProps) {
  const [brandIndex, setBrandIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  const toggleBrand = () => {
    setIsHovering(!isHovering)
  }

  useEffect(() => {
    if (!isHovering) return

    const intervalId = setInterval(() => {
      setBrandIndex(previousValue => {
        const nextValue = previousValue + 1
        if (nextValue >= BRANDS.length) return 0
        return nextValue
      })
    }, 1000)

    return () => {
      clearTimeout(intervalId)
    }
  }, [isHovering])

  return (
    <Link href="/">
      <a
        className={styles.logo}
        onMouseEnter={toggleBrand}
        onMouseLeave={toggleBrand}
      >
        {BRANDS[brandIndex]} {name}
      </a>
    </Link>
  )
}
