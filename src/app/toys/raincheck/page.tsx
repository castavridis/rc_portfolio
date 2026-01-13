'use client'

import './styles.css'
import { useEffect } from 'react'

export default function RainCheckPage () {
  useEffect(() => {
    const element = document.querySelector('.card')
    if (!element) return

    // Placing function within useEffect means that these are instatiated once per component instance, onComponentDidMount
    const handleMouseMove = (e: MouseEvent) => {

      // DOMRect - "the smallest rectangle which contains the entire element"
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateX = (y - centerY) / centerY * -10
      const rotateY = (x - centerX) / centerX * 10
      const translateZ = 20

      const percentX = (x / rect.width) * 100
      const percentY = (y / rect.height) * 100

      // the semicolon at the beginning of ;(element as HTMLElement) is a defensive semicolon
      ;(element as HTMLElement).style.transform = `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`
      //
      ;(element as HTMLElement).style.setProperty('--reflection-x', `${percentX}%`)
      ;(element as HTMLElement).style.setProperty('--reflection-y', `${percentY}%`)
    }

    const handleMouseLeave = () => {
      ;(element as HTMLElement).style.transform = 'perspective(1500px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
    }

    element.addEventListener('mousemove', handleMouseMove as EventListener)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove as EventListener)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  useEffect(() => {
    const seal = document.querySelector('.seal')
    if (!seal) return

    const text = seal.textContent || ''
    seal.innerHTML = ''

    const chars = text.split('')
    const radius = 50
    const angleStep = 360 / chars.length

    chars.forEach((char, i) => {
      const span = document.createElement('span')
      span.textContent = char === ' ' ? '\u00A0' : char
      span.style.position = 'absolute'
      span.style.left = '50%'
      span.style.top = '50%'
      span.style.transformOrigin = '0 0'
      span.style.transform = `rotate(${i * angleStep}deg) translateY(-${radius}px)`
      seal.appendChild(span)
    })
  }, [])

  useEffect(() => {
    const guilloche = document.querySelector('.guilloche')
    if (!guilloche) return

    const width = 320
    const height = 240
    const border = 12

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', width.toString())
    svg.setAttribute('height', height.toString())
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)

    const createWavePath = (offset: number, amplitude: number, frequency: number, isHorizontal: boolean, position: number) => {
      let path = ''
      if (isHorizontal) {
        for (let i = 0; i <= width; i += 2) {
          const y = position + Math.sin((i + offset) * frequency) * amplitude
          path += `${i === 0 ? 'M' : 'L'} ${i} ${y} `
        }
      } else {
        for (let i = 0; i <= height; i += 2) {
          const x = position + Math.sin((i + offset) * frequency) * amplitude
          path += `${i === 0 ? 'M' : 'L'} ${x} ${i} `
        }
      }
      return path
    }

    for (let i = 0; i < 3; i++) {
      const pathTop = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      pathTop.setAttribute('d', createWavePath(i * 20, 3, 0.1, true, border + i * 2))
      pathTop.setAttribute('stroke', `rgba(0, 100, 200, ${0.3 + i * 0.2})`)
      pathTop.setAttribute('stroke-width', '0.5')
      pathTop.setAttribute('fill', 'none')
      svg.appendChild(pathTop)

      const pathBottom = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      pathBottom.setAttribute('d', createWavePath(i * 20, 3, 0.1, true, height - border - i * 2))
      pathBottom.setAttribute('stroke', `rgba(0, 100, 200, ${0.3 + i * 0.2})`)
      pathBottom.setAttribute('stroke-width', '0.5')
      pathBottom.setAttribute('fill', 'none')
      svg.appendChild(pathBottom)

      const pathLeft = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      pathLeft.setAttribute('d', createWavePath(i * 20, 3, 0.1, false, border + i * 2))
      pathLeft.setAttribute('stroke', `rgba(0, 100, 200, ${0.3 + i * 0.2})`)
      pathLeft.setAttribute('stroke-width', '0.5')
      pathLeft.setAttribute('fill', 'none')
      svg.appendChild(pathLeft)

      const pathRight = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      pathRight.setAttribute('d', createWavePath(i * 20, 3, 0.1, false, width - border - i * 2))
      pathRight.setAttribute('stroke', `rgba(0, 100, 200, ${0.3 + i * 0.2})`)
      pathRight.setAttribute('stroke-width', '0.5')
      pathRight.setAttribute('fill', 'none')
      svg.appendChild(pathRight)
    }

    guilloche.appendChild(svg)
  }, [])

  return (
    <div>    
      <h1 className="text-7xl">Rain Check</h1>     
      <p className="text-2xl mb-4">
        For when you need to send a rain check to someone important to you.
      </p>
      <div className="flex flex-wrap gap-4">
        <div>
          <p className="font-bold">Design Reference</p>
          <div className="flex w-full">
              <img className="w-[75%] max-w-full h-auto" src="https://d2w9rnfcy7mm78.cloudfront.net/42513465/original_6d9beb4bfa401743160eabcf9ffa095d.jpg?1767979735?bc=0" alt="Travis Purrington's US banknote proposal with how data transfers over" />
              <img className="w-[25%] max-w-full h-auto" src="http://www.couponingtodisney.com/wp-content/uploads/2011/06/Rainchecks.jpg" alt="Three filled out rain checks from CVS, Walgreens, and Publix." />
          </div>
          <div className="flex w-full">
            <img className="block max-w-full h-auto w-[50%]" src="https://d2w9rnfcy7mm78.cloudfront.net/42512657/original_70dfab1b7433133f16aea20466b4e304.jpg?1767978056?bc=0" alt="Australian 50 dollar banknote" />
            <img className="block max-w-full h-auto w-[50%]" src="https://d2w9rnfcy7mm78.cloudfront.net/42512590/original_ee1964b32ae75272a47a2d8f0d52eb4b.jpg?1767977978?bc=0" alt="Swiss 50 franc note" />
          </div>
        </div>
        <div className="basis-full"></div>
        <div className="w-[45%]"> 
          <p>
            <strong>
              Features
            </strong>
          </p>
          <ul className="list-disc pl-4">
            <li className="font-bold">Sender</li>
            <ul className="list-disc pl-4">
              <li>Form</li>
              <li>Save raincheck</li>
              <li>Send raincheck</li>
            </ul>
            <li className="font-bold">Recipient</li>
            <ul className="list-disc pl-4">
              <li>
                <a href="https://add-to-calendar-button.com/examples" className="underline text-blue-700">
                  Add to Calendar Button
                </a>
              </li>
              <li>PWA notifications for Accept/Reject</li>
            </ul>
            <li className="font-bold">Handle the following data:</li>
            <ul className="list-disc pl-4">
              <li className="font-bold">Core Data</li>
              <ul className="list-disc pl-4">
                <li>To</li>
                <li>From</li>
                <li>Event name</li>
                <li>Message</li>
                <li>Category/Reason (sick, weather, etc.) - create different base check designs</li>
                <li>Cancellation severity - (no biggie, easy to reschedule &gt; big deal = coin, once-in-a-lifetime event = placquard)</li>
              </ul>
              <li className="font-bold">Original Date – Used for security printing effects</li>
              <ul className="list-disc pl-4">
                <li>Location – Lat, Long down to seconds?</li>
                <li>Datetime – UNIX time</li>
              </ul>
              <li className="font-bold">Proposed Data - Displayed in a human-readable format</li>
              <ul className="list-disc pl-4">
                <li>Location</li>
                <li>Date</li>
                <li>Time</li>
              </ul>
              <li className="font-bold">Raincheck Metadata</li>
              <ul className="list-disc pl-4">
                <li>Date issued (e.g. created)</li>
                <li>Location issued from</li>
                <li>Time</li>
              </ul>
            </ul>
          </ul>
        </div>
        <div className="w-[45%]">
          <p className="font-bold mt-4">Ideas from converation with Evan Gedrich Pintado</p>
          <ul className="list-disc pl-4">
            <li>certainty of specific future thing, day and time offered (required) not having to make plan again</li>
            <li>put forward options for user</li>
            <li>different kinds of "certificates" based</li>
            <li>ticket form is based on how severe the issue is (coin = not a big deal) – (tapestry = big deal issue) </li>
          </ul>
        </div>
        <div className="w-full"> 
          <h2 className="font-bold">Rain Check Explorations</h2>
          <h3 className="">Foil effect</h3>
          <div className="flex items-center justify-center py-10 bg-blue-950 bg-[url('https://images.unsplash.com/photo-1508402476522-c77c2fa4479d?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover">
            <div className="card w-80 h-120 p-8 relative">
              <div className="absolute top-8 left-8 right-8 bottom-8 foil--ripple shadow-2xl border-amber-50 border-8 bg-amber-200 rounded-sm">
                <div className="w-full h-full foil-container"> 
                  <div className="w-full h-full foil">
                    <div className="w-full h-full foil-mask bg-amber-50">
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full h-full relative flex p-4 text-black">
                <div className="text-5xl">
                  Foil Paper Card
                </div>
              </div>
            </div>
            <div className="card w-72 h-112 m-8 relative backdrop-blur-xs">
              <div className="w-full h-full relative rounded-sm">
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-indigo-400 opacity-15"></div>
                <div className="seal-mask w-full h-full flex justify-center items-center bg-amber-50 text-black rounded-sm">
                  Clear Seal Test
                </div>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78.51 79.4">
              <mask id="foil-mask" mask-type="luminance">
                <path transform="scale(6)" d="M76.15,33.89c-2.85-10.4-12.19-17.32-21.36-21.95-9.38-4.7-19.8-6.59-30.08-8.11C16.49,2.53,7.81,1.44-.87,0l-.51,79.41c6.22-2.67,12.12-4.93,16.89-6.73,9.74-3.57,19.63-6.75,29.58-9.69,4.99-1.47,10.08-2.78,14.83-4.97,9.55-4.07,19.24-12.7,16.23-24.13ZM-1.06,29.85c.31.08.6.17.87.31.56.28,1.15.71,1.3,1.34.26,1.08-1.08,1.52-1.9,1.74-.1.03-.2.07-.3.09l.02-3.49ZM-1.09,33.41c.11-.03.21-.07.31-.1.31-.09.63-.18.93-.31.59-.26,1.21-.79,1.01-1.51-.17-.65-.76-1.08-1.34-1.37-.29-.14-.59-.24-.9-.32v-1.93c1.55.21,3.17.45,4.51,1.13,1.12.57,2.3,1.41,2.61,2.68.53,2.16-2.15,3.04-3.81,3.48C1.12,35.46,0,35.82-1.11,36.21l.02-2.81ZM-1.11,36.39c1.12-.41,2.25-.77,3.39-1.1.62-.18,1.26-.36,1.85-.62,1.19-.53,2.41-1.59,2.03-3.02-.35-1.3-1.52-2.16-2.67-2.74-1.17-.59-2.48-.82-3.76-1.01-.26-.04-.52-.08-.79-.11v-1.84c2.7.4,5.72.67,8.14,1.89,1.67.85,3.45,2.12,3.91,4.02.79,3.24-3.23,4.56-5.71,5.23-1.88.51-3.74,1.1-5.58,1.77-.27.1-.56.21-.84.31l.02-2.77ZM-1.13,39.42c.32-.12.64-.24.92-.35,1.82-.68,3.68-1.26,5.55-1.82.93-.28,1.88-.53,2.78-.93,1.78-.79,3.62-2.38,3.04-4.52-.53-1.95-2.29-3.25-4.01-4.12-1.76-.88-3.71-1.23-5.64-1.52-.83-.13-1.69-.24-2.56-.36v-1.81c.16.02.31.05.46.07,3.69.58,7.94.89,11.31,2.59,2.23,1.13,4.6,2.82,5.21,5.36,1.05,4.32-4.31,6.08-7.62,6.97-2.51.68-4.99,1.47-7.44,2.36-.66.24-1.35.5-2.03.76l.02-2.69ZM-1.15,42.48c.78-.3,1.51-.58,2.15-.82,2.43-.91,4.91-1.69,7.4-2.42,1.25-.37,2.51-.71,3.71-1.24,2.37-1.05,4.82-3.18,4.06-6.03-.7-2.6-3.05-4.33-5.34-5.49-2.35-1.18-4.95-1.63-7.52-2.03-1.39-.21-2.85-.4-4.33-.61v-1.78c.43.07.85.13,1.26.2,4.61.73,9.93,1.11,14.14,3.24,2.79,1.41,5.75,3.53,6.52,6.69,1.31,5.39-5.38,7.6-9.52,8.71-3.14.85-6.24,1.84-9.29,2.95-1.04.38-2.13.79-3.23,1.21l.02-2.59ZM-1.16,45.54c1.23-.49,2.39-.92,3.38-1.29,3.04-1.13,6.13-2.11,9.25-3.03,1.56-.46,3.14-.89,4.63-1.55,2.97-1.32,6.03-3.97,5.07-7.54-.88-3.25-3.81-5.41-6.68-6.86-2.93-1.47-6.19-2.04-9.4-2.53-1.96-.3-4.02-.56-6.1-.86v-1.76c.7.11,1.38.22,2.06.33,5.54.87,11.92,1.33,16.97,3.89,3.35,1.7,6.9,4.24,7.82,8.03,1.58,6.47-6.46,9.12-11.43,10.45-3.77,1.01-7.48,2.21-11.15,3.54-1.43.52-2.92,1.07-4.43,1.66l.02-2.49ZM-1.18,48.6c1.69-.68,3.27-1.28,4.61-1.77,3.65-1.36,7.36-2.53,11.09-3.63,1.87-.55,3.77-1.07,5.56-1.86,3.56-1.58,7.24-4.77,6.08-9.05-1.05-3.91-4.57-6.49-8.01-8.23-3.52-1.76-7.43-2.45-11.28-3.04-2.52-.39-5.18-.72-7.87-1.11v-1.73c.97.16,1.92.31,2.86.46,6.46,1.02,13.9,1.56,19.8,4.54,3.91,1.98,8.05,4.94,9.12,9.37,1.84,7.55-7.54,10.64-13.33,12.2-4.39,1.18-8.73,2.58-13.01,4.13-1.81.66-3.71,1.38-5.63,2.13l.02-2.4ZM-1.2,51.67c2.14-.87,4.16-1.63,5.83-2.25,4.25-1.58,8.59-2.95,12.94-4.24,2.18-.64,4.4-1.25,6.49-2.17,4.15-1.84,8.44-5.56,7.1-10.56-1.23-4.56-5.33-7.58-9.35-9.6-4.1-2.06-8.67-2.86-13.16-3.55-3.09-.47-6.35-.87-9.64-1.36v-1.71c1.24.2,2.46.4,3.66.59,7.38,1.16,15.89,1.78,22.62,5.19,4.46,2.26,9.19,5.65,10.43,10.71,2.1,8.63-8.62,12.16-15.23,13.94-5.02,1.35-9.98,2.95-14.87,4.73-2.19.8-4.5,1.66-6.83,2.58v-2.3ZM-1.22,54.73c2.6-1.06,5.04-1.98,7.06-2.73,4.86-1.81,9.81-3.37,14.79-4.84,2.49-.74,5.02-1.42,7.41-2.48,4.74-2.1,9.65-6.36,8.11-12.07-1.4-5.21-6.09-8.66-10.68-10.98-4.69-2.35-9.91-3.27-15.04-4.05-3.65-.56-7.52-1.03-11.41-1.61v-1.68c1.51.25,3,.49,4.46.72,8.31,1.31,17.88,2,25.45,5.84,5.02,2.54,10.34,6.35,11.73,12.05,2.36,9.71-9.69,13.68-17.14,15.68-5.65,1.52-11.23,3.31-16.73,5.32-2.58.94-5.29,1.94-8.03,3.04v-2.2ZM-1.24,57.8c3.06-1.26,5.93-2.34,8.29-3.22,5.47-2.04,11.04-3.79,16.64-5.45,2.8-.83,5.65-1.6,8.34-2.79,5.34-2.37,10.85-7.15,9.13-13.57-1.58-5.86-6.86-9.74-12.02-12.35-5.28-2.64-11.14-3.68-16.92-4.56-4.22-.65-8.69-1.19-13.18-1.87v-1.65c1.78.3,3.53.57,5.25.85,9.23,1.46,19.86,2.22,28.28,6.49,5.58,2.83,11.49,7.06,13.03,13.39,2.63,10.79-10.77,15.2-19.04,17.42-6.28,1.69-12.47,3.68-18.59,5.91-2.96,1.08-6.08,2.24-9.23,3.5v-2.1ZM-1.26,60.87c3.51-1.45,6.81-2.69,9.52-3.7,6.08-2.26,12.27-4.22,18.49-6.05,3.12-.92,6.28-1.78,9.27-3.1,5.93-2.63,12.06-7.94,10.14-15.08-1.75-6.51-7.62-10.82-13.35-13.72-5.86-2.94-12.38-4.09-18.8-5.07-4.78-.73-9.85-1.34-14.95-2.12v-1.63c2.05.34,4.07.67,6.05.98,10.15,1.6,21.85,2.44,31.11,7.14,6.14,3.11,12.64,7.77,14.34,14.73,2.89,11.87-11.85,16.71-20.95,19.17-6.9,1.86-13.72,4.05-20.45,6.5-3.34,1.22-6.87,2.52-10.43,3.96v-1.99ZM-1.28,63.93c3.96-1.65,7.7-3.05,10.75-4.18,6.68-2.49,13.49-4.64,20.34-6.66,3.43-1.01,6.91-1.96,10.2-3.42,6.52-2.89,13.27-8.74,11.15-16.59-1.93-7.16-8.38-11.91-14.69-15.09-6.45-3.23-13.62-4.49-20.68-5.58-5.35-.82-11.02-1.5-16.72-2.38v-1.6c2.32.39,4.61.76,6.85,1.12,11.07,1.75,23.83,2.67,33.94,7.78,6.7,3.39,13.79,8.47,15.64,16.07,3.15,12.95-12.92,18.23-22.85,20.91-7.53,2.03-14.97,4.42-22.31,7.09-3.72,1.36-7.66,2.82-11.63,4.42v-1.89ZM-1.3,67c4.42-1.84,8.59-3.4,11.97-4.67,7.29-2.72,14.72-5.06,22.19-7.26,3.74-1.1,7.54-2.14,11.12-3.73,7.12-3.16,14.47-9.53,12.17-18.1-2.1-7.81-9.14-12.99-16.02-16.46-7.04-3.53-14.86-4.9-22.56-6.08-5.91-.9-12.19-1.65-18.49-2.63v-1.57c2.59.44,5.15.84,7.65,1.24,12,1.89,25.82,2.89,36.77,8.43,7.26,3.68,14.94,9.18,16.94,17.4,3.42,14.02-14,19.75-24.76,22.65-8.16,2.2-16.22,4.79-24.16,7.68-4.11,1.49-8.45,3.1-12.83,4.88v-1.79ZM-1.32,70.07c4.87-2.04,9.47-3.76,13.2-5.15,7.9-2.94,15.95-5.48,24.04-7.87,4.05-1.2,8.16-2.31,12.05-4.04,7.71-3.42,15.68-10.33,13.18-19.61-2.28-8.46-9.9-14.07-17.36-17.83-7.62-3.82-16.1-5.31-24.44-6.59-6.47-.99-13.36-1.8-20.26-2.88v-1.54c2.86.49,5.69.94,8.45,1.37,12.92,2.04,27.81,3.11,39.59,9.08,7.81,3.96,16.09,9.88,18.25,18.74,3.68,15.1-15.08,21.27-26.66,24.39-8.79,2.37-17.46,5.15-26.02,8.27-4.49,1.63-9.24,3.39-14.03,5.34v-1.69ZM-1.34,73.14c5.33-2.23,10.36-4.12,14.43-5.64,8.51-3.17,17.17-5.9,25.89-8.48,4.36-1.29,8.79-2.49,12.98-4.35,8.3-3.68,16.89-11.12,14.2-21.12-2.45-9.11-10.67-15.15-18.69-19.21-8.21-4.11-17.34-5.72-26.32-7.1-7.04-1.08-14.53-1.96-22.03-3.13v-1.52c3.13.53,6.22,1.02,9.25,1.5,13.84,2.18,29.79,3.33,42.42,9.73,8.37,4.24,17.24,10.59,19.55,20.08,3.94,16.18-16.15,22.79-28.57,26.14-9.41,2.54-18.71,5.52-27.88,8.86-4.87,1.77-10.03,3.69-15.23,5.81v-1.6ZM44.8,61.98c-10,2.86-19.93,5.96-29.74,9.45-5.25,1.95-10.82,4.04-16.43,6.36v-1.57c5.79-2.43,11.26-4.48,15.67-6.13,9.11-3.4,18.4-6.32,27.74-9.08,4.67-1.38,9.42-2.67,13.9-4.66,8.9-3.95,18.09-11.92,15.21-22.62-2.63-9.76-11.43-16.24-20.03-20.58-8.8-4.41-18.57-6.13-28.2-7.6C15.31,4.38,7.22,3.42-.89,2.15V.68c3.39.58,6.76,1.12,10.05,1.63,14.76,2.37,31.78,3.55,45.25,10.38,8.93,4.52,18.13,11.36,20.85,21.42,3.76,17.36-17.18,24.51-30.47,27.88Z"/>
              </mask>
            </svg>
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78.51 79.4">
              <mask id="foil-mask-inverted" mask-type="luminance">
                <g transform="scale(6)">
                  <path d="M2.07,43.86c3.06-1.11,6.16-2.11,9.29-2.95,4.14-1.11,10.84-3.32,9.52-8.71-.77-3.16-3.73-5.28-6.52-6.69-4.21-2.13-9.53-2.52-14.14-3.24-.08-.01-.15-.02-.23-.04v1.76c1.12.15,2.23.3,3.3.47,2.57.39,5.18.85,7.52,2.03,2.29,1.16,4.64,2.88,5.34,5.49.77,2.86-1.68,4.98-4.06,6.03-1.2.53-2.46.87-3.71,1.24-2.49.74-4.97,1.52-7.4,2.42-.31.12-.65.24-1,.38v2.59c.7-.26,1.4-.52,2.07-.77Z"/>
                  <path d="M2.25,35.16c1.65-.45,4.33-1.33,3.81-3.48-.31-1.27-1.49-2.11-2.61-2.68C2.41,28.47,1.21,28.21,0,28.02v2.19c.52.29,1.01.69,1.17,1.28.19.71-.42,1.25-1.01,1.51-.05.02-.1.04-.15.06v2.79c.74-.25,1.49-.48,2.25-.68Z"/>
                  <path d="M5.29,37.07c2.48-.67,6.5-1.99,5.71-5.23-.46-1.9-2.24-3.17-3.91-4.02C4.98,26.76,2.41,26.42,0,26.08v1.85c1.2.19,2.4.42,3.5.97,1.15.58,2.32,1.44,2.67,2.74.38,1.43-.84,2.49-2.03,3.02-.6.27-1.23.44-1.85.62-.77.23-1.53.47-2.28.73v2.74c1.74-.63,3.5-1.19,5.29-1.67Z"/>
                  <path d="M1.11,31.5C.98,30.94.5,30.55,0,30.27v2.71c.67-.27,1.3-.71,1.11-1.48Z"/>
                  <path d="M41.76,60.07c12.41-3.34,32.51-9.95,28.57-26.14-2.31-9.49-11.18-15.84-19.55-20.08C38.14,7.45,22.19,6.3,8.35,4.12,5.61,3.68,2.82,3.24,0,2.76v1.5c7.2,1.11,14.37,1.97,21.13,3,8.99,1.38,18.12,2.98,26.32,7.1,8.03,4.05,16.24,10.09,18.69,19.21,2.69,9.99-5.89,17.43-14.2,21.12-4.18,1.86-8.61,3.06-12.98,4.35-8.71,2.57-17.38,5.31-25.89,8.48C9.37,68.89,4.83,70.6,0,72.59v1.61c4.74-1.91,9.43-3.65,13.88-5.27,9.17-3.34,18.47-6.32,27.88-8.86Z"/>
                  <path d="M32.64,54.32c9.93-2.68,26-7.96,22.85-20.91-1.85-7.59-8.94-12.67-15.64-16.07-10.1-5.12-22.86-6.04-33.94-7.78C3.97,9.25,1.99,8.93,0,8.6v1.58c5.38.81,10.73,1.47,15.78,2.24,7.06,1.08,14.23,2.34,20.68,5.58,6.31,3.18,12.76,7.93,14.69,15.09,2.11,7.85-4.63,13.7-11.15,16.59-3.29,1.46-6.77,2.4-10.2,3.42-6.84,2.02-13.66,4.17-20.34,6.66C6.75,60.76,3.48,61.99,0,63.41v1.91c3.53-1.4,7.02-2.7,10.34-3.91,7.34-2.67,14.77-5.06,22.31-7.09Z"/>
                  <path d="M8.12,36.33c-.9.4-1.85.66-2.78.93C3.54,37.79,1.76,38.36,0,39.01v2.68c.3-.11.6-.23.89-.33,2.45-.89,4.92-1.69,7.44-2.36,3.31-.89,8.67-2.65,7.62-6.97-.62-2.53-2.98-4.22-5.21-5.36C7.54,25.05,3.55,24.68,0,24.15v1.8c.51.07,1.03.14,1.52.21,1.93.29,3.88.64,5.64,1.52,1.72.87,3.48,2.16,4.01,4.12.58,2.14-1.26,3.74-3.04,4.52Z"/>
                  <path d="M29.6,52.4c9.1-2.45,23.84-7.3,20.95-19.17-1.7-6.96-8.2-11.62-14.34-14.73-9.26-4.69-20.96-5.53-31.11-7.14C3.43,11.11,1.72,10.83,0,10.55v1.61c4.77.71,9.51,1.29,14,1.98,6.42.98,12.94,2.13,18.8,5.07,5.73,2.89,11.6,7.21,13.35,13.72,1.92,7.14-4.21,12.45-10.14,15.08-2.99,1.33-6.15,2.18-9.27,3.1-6.22,1.84-12.41,3.79-18.49,6.05C5.88,58.05,3.03,59.12,0,60.35v2c3.12-1.24,6.21-2.38,9.16-3.45,6.72-2.45,13.54-4.64,20.45-6.5Z"/>
                  <path d="M5.61,51.38c4.89-1.78,9.85-3.37,14.87-4.73,6.62-1.78,17.34-5.31,15.23-13.94-1.23-5.06-5.96-8.45-10.43-10.71-6.74-3.41-15.24-4.03-22.62-5.19-.88-.14-1.77-.28-2.67-.43v1.69c2.95.42,5.87.79,8.65,1.22,4.49.69,9.06,1.49,13.16,3.55,4.01,2.03,8.12,5.05,9.35,9.6,1.34,5-2.95,8.72-7.1,10.56-2.09.93-4.31,1.53-6.49,2.17-4.36,1.29-8.69,2.65-12.94,4.24C3.27,49.92,1.69,50.52,0,51.18v2.31c1.91-.74,3.81-1.45,5.61-2.11Z"/>
                  <path d="M44.8,61.98c13.29-3.36,34.23-10.52,30.47-27.88-2.73-10.06-11.92-16.9-20.85-21.42C40.94,5.86,23.92,4.68,9.16,2.3,6.15,1.84,3.09,1.35,0,.82v1.46c7.81,1.21,15.59,2.14,22.91,3.26,9.63,1.47,19.41,3.19,28.2,7.6,8.6,4.34,17.4,10.82,20.03,20.58,2.88,10.71-6.32,18.68-15.21,22.62-4.48,1.99-9.23,3.28-13.9,4.66-9.33,2.76-18.62,5.69-27.74,9.08C10.24,71.6,5.27,73.47,0,75.65v1.59c5.14-2.09,10.24-4.01,15.06-5.8,9.81-3.49,19.74-6.59,29.74-9.45Z"/>
                  <path d="M12.7,66.42c8.56-3.12,17.24-5.9,26.02-8.27,11.58-3.12,30.34-9.29,26.66-24.39-2.16-8.86-10.43-14.79-18.25-18.74C35.35,9.04,20.46,7.97,7.54,5.93,5.07,5.54,2.54,5.13,0,4.71v1.53c6.59,1.01,13.16,1.8,19.35,2.75,8.35,1.28,16.82,2.77,24.44,6.59,7.45,3.76,15.08,9.37,17.36,17.83,2.5,9.28-5.47,16.19-13.18,19.61-3.89,1.72-8,2.84-12.05,4.04-8.09,2.39-16.14,4.93-24.04,7.87C8.49,66.18,4.38,67.73,0,69.53v1.7c4.33-1.74,8.63-3.33,12.7-4.81Z"/>
                  <path d="M3.25,46.36c3.67-1.34,7.39-2.53,11.15-3.54,4.96-1.34,13-3.98,11.43-10.45-.92-3.8-4.47-6.34-7.82-8.03-5.05-2.56-11.43-3.02-16.97-3.89-.34-.05-.69-.11-1.04-.17v1.74c1.73.24,3.45.47,5.08.72,3.21.49,6.47,1.06,9.4,2.53,2.87,1.45,5.8,3.61,6.68,6.86.96,3.57-2.11,6.23-5.07,7.54-1.49.66-3.08,1.09-4.63,1.55-3.11.92-6.21,1.9-9.25,3.03-.67.25-1.42.53-2.21.84v2.49c1.11-.42,2.2-.83,3.25-1.21Z"/>
                  <path d="M11.52,63.91c7.95-2.89,16.01-5.48,24.16-7.68,10.76-2.9,28.17-8.63,24.76-22.65-2-8.23-9.69-13.73-16.94-17.4-10.95-5.54-24.77-6.54-36.77-8.43C4.52,7.4,2.27,7.04,0,6.66v1.55c5.99.91,11.94,1.63,17.56,2.49,7.7,1.18,15.53,2.56,22.56,6.08,6.88,3.47,13.92,8.65,16.02,16.46,2.3,8.57-5.05,14.94-12.17,18.1-3.59,1.59-7.38,2.62-11.12,3.73-7.47,2.21-14.9,4.55-22.19,7.26C7.62,63.47,3.93,64.86,0,66.47v1.81c3.93-1.57,7.82-3.02,11.52-4.36Z"/>
                  <path d="M0,0v.13c8.39,1.37,16.77,2.44,24.7,3.69,10.28,1.52,20.7,3.41,30.08,8.11,9.18,4.63,18.51,11.55,21.36,21.95,3.02,11.44-6.68,20.06-16.23,24.13-4.75,2.19-9.84,3.5-14.83,4.97-9.96,2.94-19.84,6.12-29.58,9.69C11.1,74.34,5.71,76.41,0,78.82v.58h78.51V0H0Z"/>
                  <path d="M7.97,56.39c6.11-2.23,12.31-4.22,18.59-5.91,8.27-2.23,21.67-6.64,19.04-17.42-1.54-6.33-7.45-10.56-13.03-13.39-8.42-4.26-19.05-5.03-28.28-6.49C2.88,12.96,1.44,12.73,0,12.49v1.63c4.17.62,8.3,1.13,12.22,1.73,5.78.88,11.65,1.92,16.92,4.56,5.16,2.61,10.44,6.49,12.02,12.35,1.73,6.42-3.79,11.21-9.13,13.57-2.69,1.19-5.54,1.97-8.34,2.79-5.6,1.65-11.17,3.41-16.64,5.45C5.01,55.34,2.58,56.26,0,57.3v2.1c2.72-1.07,5.41-2.07,7.97-3.01Z"/>
                  <path d="M17.44,44.74c5.79-1.56,15.17-4.65,13.33-12.2-1.08-4.43-5.22-7.39-9.12-9.37-5.89-2.99-13.34-3.52-19.8-4.54-.61-.1-1.23-.2-1.85-.3v1.71c2.34.33,4.66.63,6.87.97,3.85.59,7.76,1.28,11.28,3.04,3.44,1.74,6.96,4.33,8.01,8.23,1.15,4.28-2.53,7.47-6.08,9.05-1.79.8-3.69,1.31-5.56,1.86-3.73,1.1-7.45,2.27-11.09,3.63-1.02.38-2.18.82-3.42,1.3v2.41c1.51-.58,3-1.15,4.43-1.67,4.28-1.56,8.62-2.95,13.01-4.13Z"/>
                  <path d="M6.79,53.88c5.5-2,11.08-3.79,16.73-5.32,7.45-2.01,19.5-5.97,17.14-15.68-1.39-5.7-6.71-9.51-11.73-12.05-7.58-3.84-17.15-4.53-25.45-5.84C2.34,14.82,1.17,14.63,0,14.44v1.66c3.56.52,7.09.96,10.43,1.47,5.14.79,10.35,1.7,15.04,4.05,4.59,2.32,9.28,5.77,10.68,10.98,1.54,5.71-3.37,9.96-8.11,12.07-2.39,1.06-4.92,1.75-7.41,2.48-4.98,1.47-9.93,3.03-14.79,4.84C4.14,52.63,2.14,53.38,0,54.24v2.21c2.32-.91,4.61-1.77,6.79-2.56Z"/>
                </g>
              </mask>
            </svg>
          </div>
          <h3 className="font-bold">"Wireframe"</h3>
          <div className="w-full p-12 bg-blue-950 flex items-center justify-center">
            <div className="w-full text-white">
              <p>Raincheck issued to April Greiman.</p>
              <p>Graciously Accept</p>
              <p>Politely Decline</p>
            </div>
            <div className="flex w-full relative">
              <div className="rainbow-roll w-80 h-60 rounded-sm">
                <div className="guilloche"></div>
                <div className="m-4 absolute top-2 left-2 right-2 bottom-2 bg-white shadow-sm text-black rounded-sm">
                  <p>Issued by<br/>C Stavridis</p>
                  <div className="hologram"></div>
                  <div className="seal font-mono">OFFICIAL&nbsp;RAINCHECK&nbsp;</div>
                </div>
              </div>
              <div className="note bg-amber-50 w-40 h-30 absolute top-[50%] -translate-y-[50%] -right-5 -translate-x-[50%] p-4">
                Custom Note
              </div>
            </div>
          </div>
        </div>
        <div className="basis-full"></div>
        <div className="w-[45%]">
          <h2>Claude Code Generated Elements</h2>
          // TBD: seal, hologram, guilloche, rainbow-roll hover
        </div>
      </div>
    </div>
  )
}
