import { FaWhatsapp, FaInstagram } from 'react-icons/fa'
import { MdEmail, MdSms } from 'react-icons/md'

export const shareContent = {
  title: 'Toxic Love — Webinar for Married Couples',
  message:
    "Join me for Khushboo's live webinar on toxic patterns in marriage — understand why, and how to heal. Register here:",
}

export const getShareLinks = (fullMessage) => [
  {
    label: 'WhatsApp',
    href: `https://wa.me/?text=${encodeURIComponent(fullMessage)}`,
    icon: FaWhatsapp,
    className: 'share-whatsapp',
  },
  {
    label: 'Instagram',
    href: '#',
    icon: FaInstagram,
    className: 'share-instagram',
    copyOnClick: true,
  },
  {
    label: 'Gmail',
    href: `mailto:?subject=${encodeURIComponent(shareContent.title)}&body=${encodeURIComponent(fullMessage)}`,
    icon: MdEmail,
    className: 'share-gmail',
  },
  {
    label: 'Message',
    href: `sms:?body=${encodeURIComponent(fullMessage)}`,
    icon: MdSms,
    className: 'share-sms',
  },
]
