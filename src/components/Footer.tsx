'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Github, Twitter, Linkedin, Facebook, Instagram } from 'lucide-react'
import { useRef } from 'react'
import { useInView } from 'framer-motion'

export const Footer = () => {
  const footerRef = useRef(null)
  const isInView = useInView(footerRef, { once: true, amount: 0.3 })
  
  const currentYear = new Date().getFullYear()
  
  const socialLinks = [
    { name: 'GitHub', icon: <Github size={20} />, url: 'https://github.com' },
    { name: 'Twitter', icon: <Twitter size={20} />, url: 'https://twitter.com' },
    { name: 'LinkedIn', icon: <Linkedin size={20} />, url: 'https://linkedin.com' },
    { name: 'Facebook', icon: <Facebook size={20} />, url: 'https://facebook.com' },
    { name: 'Instagram', icon: <Instagram size={20} />, url: 'https://instagram.com' },
  ]
  
  const footerLinks = {
    product: [
      { name: 'Features', url: '/features' },
      { name: 'Pricing', url: '/pricing' },
      { name: 'Templates', url: '/templates' },
      { name: 'Integrations', url: '#' },
    ],
    resources: [
      { name: 'Blog', url: '#' },
      { name: 'Tutorials', url: '#' },
      { name: 'Documentation', url: '#' },
      { name: 'Community', url: '#' },
    ],
    company: [
      { name: 'About', url: '#' },
      { name: 'Careers', url: '#' },
      { name: 'Contact', url: '#' },
      { name: 'Partners', url: '#' },
    ],
    legal: [
      { name: 'Privacy', url: '#' },
      { name: 'Terms', url: '#' },
      { name: 'Security', url: '#' },
      { name: 'Cookies', url: '#' },
    ],
  }
  
  return (
    <footer ref={footerRef} className="bg-gray-50 dark:bg-gray-900 py-12 px-4 md:px-6 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {Object.entries(footerLinks).map(([category, links]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: Object.keys(footerLinks).indexOf(category) * 0.1 }}
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 capitalize">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.url} 
                      className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="mb-6 md:mb-0">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {currentYear} FormWave. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-5">
            {socialLinks.map((social) => (
              <motion.a 
                key={social.name} 
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Follow on ${social.name}`}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  )
} 