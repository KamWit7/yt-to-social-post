'use client'

import { StaggeredFade } from '@/components/animation/StaggeredFade'
import { useState } from 'react'

export default function AnimationDemoPage() {
  const [text, setText] = useState('Witaj w demo animacji!')
  const [delay, setDelay] = useState(0.07)
  const [className, setClassName] = useState('')

  const sampleTexts = [
    'Witaj w demo animacji!',
    'To jest test animacji StaggeredFade',
    'Każda litera pojawia się z opóźnieniem',
    'Sprawdź jak wygląda animacja z różnymi tekstami',
    'Lorem ipsum dolor sit amet consectetur',
    'React + Framer Motion = Piękne animacje',
    'StaggeredFade Animation Demo',
    'Testowanie różnych długości tekstu',
  ]

  const sampleClasses = [
    '',
    'text-red-500',
    'text-blue-600',
    'text-green-500',
    'text-purple-600',
    'text-orange-500',
    'text-pink-500',
    'text-indigo-600',
  ]

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto px-4'>
        <div className='bg-white rounded-lg shadow-lg p-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-8 text-center'>
            StaggeredFade Animation Demo
          </h1>

          {/* Controls */}
          <div className='space-y-6 mb-8'>
            {/* Text Input */}
            <div>
              <label
                htmlFor='text'
                className='block text-sm font-medium text-gray-700 mb-2'>
                Tekst do animacji
              </label>
              <textarea
                id='text'
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                placeholder='Wprowadź tekst do animacji...'
              />

              {/* Sample Texts */}
              <div className='mt-2'>
                <p className='text-sm text-gray-600 mb-2'>
                  Przykładowe teksty:
                </p>
                <div className='flex flex-wrap gap-2'>
                  {sampleTexts.map((sampleText, index) => (
                    <button
                      key={index}
                      type='button'
                      onClick={() => setText(sampleText)}
                      className='text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors'>
                      {sampleText.length > 30
                        ? `${sampleText.substring(0, 30)}...`
                        : sampleText}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Delay Control */}
            <div>
              <label
                htmlFor='delay'
                className='block text-sm font-medium text-gray-700 mb-2'>
                Opóźnienie między literami: {delay}s
              </label>
              <input
                id='delay'
                type='range'
                min='0.01'
                max='0.2'
                step='0.01'
                value={delay}
                onChange={(e) => setDelay(parseFloat(e.target.value))}
                className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
              />
              <div className='flex justify-between text-xs text-gray-500 mt-1'>
                <span>0.01s</span>
                <span>0.2s</span>
              </div>
            </div>

            {/* Class Name Control */}
            <div>
              <label
                htmlFor='className'
                className='block text-sm font-medium text-gray-700 mb-2'>
                Dodatkowe klasy CSS
              </label>
              <input
                id='className'
                type='text'
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                placeholder='np: text-red-500, text-lg, font-bold'
              />

              {/* Sample Classes */}
              <div className='mt-2'>
                <p className='text-sm text-gray-600 mb-2'>Przykładowe klasy:</p>
                <div className='flex flex-wrap gap-2'>
                  {sampleClasses.map((sampleClass, index) => (
                    <button
                      key={index}
                      type='button'
                      onClick={() => setClassName(sampleClass)}
                      className={`text-xs px-2 py-1 rounded transition-colors ${
                        sampleClass
                          ? 'bg-gray-100 hover:bg-gray-200'
                          : 'bg-blue-100 hover:bg-blue-200'
                      }`}>
                      {sampleClass || 'domyślne'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <button
              type='button'
              onClick={() => {
                setText('Witaj w demo animacji!')
                setDelay(0.07)
                setClassName('')
              }}
              className='px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'>
              Resetuj do domyślnych
            </button>
          </div>

          {/* Animation Preview */}
          <div className='border-t pt-8'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>
              Podgląd animacji:
            </h2>

            <div className='bg-gray-50 border border-gray-200 rounded-md p-8 min-h-[200px] flex items-center justify-center'>
              <div className='text-center'>
                <StaggeredFade
                  text={text}
                  className={className}
                  delay={delay}
                />
                <p className='text-sm text-gray-500 mt-4'>
                  Animacja uruchamia się gdy tekst jest widoczny na ekranie
                </p>
              </div>
            </div>
          </div>

          {/* Code Preview */}
          <div className='mt-8 border-t pt-8'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>
              Kod komponentu:
            </h2>
            <div className='bg-gray-900 text-gray-100 rounded-md p-4 overflow-x-auto'>
              <pre className='text-sm'>
                {`<StaggeredFade 
  text="${text}" 
  className="${className}"
  delay={${delay}}
/>`}
              </pre>
            </div>
          </div>

          {/* Component Info */}
          <div className='mt-8 border-t pt-8'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>
              Informacje o komponencie:
            </h2>
            <div className='space-y-3 text-sm text-gray-600'>
              <div>
                <strong>Nazwa:</strong> StaggeredFade
              </div>
              <div>
                <strong>Biblioteka:</strong> Framer Motion
              </div>
              <div>
                <strong>Efekt:</strong> Każda litera pojawia się z opóźnieniem
              </div>
              <div>
                <strong>Opóźnienie:</strong> {delay}s między literami
              </div>
              <div>
                <strong>Trigger:</strong> Animacja uruchamia się gdy komponent
                jest widoczny
              </div>
              <div>
                <strong>Jednorazowość:</strong> Animacja uruchamia się tylko raz
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
