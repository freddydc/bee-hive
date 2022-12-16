import styles from './Navbar.module.css'
import type { LinkProps as NextLinkProps } from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useTranslation } from '@hooks/useTranslation'

type LogoProps = {
  name: string
}

type Locales = {
  [locale: string]: {
    name: string
  }
}

const BRANDS = ['🐻', '🐪']

const LOCALES: Locales = {
  es: {
    name: 'Español',
  },
  en: {
    name: 'English',
  },
}

export const Navbar = () => {
  const t = useTranslation()

  return (
    <header className={styles.navbar}>
      <Logo name="Bee" />
      <div className={styles.menu}>
        <NavLink href="/stories">{t.header.stories}</NavLink>
        <NavLang />
      </div>
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

type LinkProps = {
  children: React.ReactNode
} & NextLinkProps

function NavLink({ children, ...linkProps }: LinkProps) {
  return (
    <Link {...linkProps}>
      <a className={styles.linkText}>{children}</a>
    </Link>
  )
}

function NavLang() {
  const router = useRouter()
  const { locales, asPath: currentPath } = router

  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLButtonElement>(null)
  const languageRef = useRef<HTMLUListElement>(null)

  const toggle = () => setIsOpen(previousVal => !previousVal)

  const handleLocale = (locale: string) => {
    fetch('/api/language', {
      method: 'POST',
      body: JSON.stringify({ preferLocale: locale }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => {
      if (res.ok) {
        toggle()
        router.push(currentPath, undefined, { locale })
      }
    })
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        languageRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !languageRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className={styles.navLang}>
      <button onClick={toggle} ref={menuRef}>
        <Language />
        <ChevronDown />
      </button>
      {locales && isOpen && (
        <ul className={styles.languageMenu} ref={languageRef}>
          {locales.map(locale => (
            <li key={locale}>
              <a onClick={() => handleLocale(locale)}>
                {LOCALES[locale].name} <ArrowUpRight />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const Language = () => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={styles.languageIcon}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802"
    />
  </svg>
)

const ChevronDown = () => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={styles.downIcon}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
    />
  </svg>
)

const ArrowUpRight = () => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={styles.arrowIcon}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
    />
  </svg>
)
