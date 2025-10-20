import { useState } from 'react'

interface WorkGalleryProps {
  title: string
  images: string[]
}

function WorkGallery({ title, images }: WorkGalleryProps) {
  const [index, setIndex] = useState(0)

  if (!images.length) {
    return <div className='gallery-empty'>暂无展示素材</div>
  }

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % images.length)
  }

  return (
    <div className='work-gallery'>
      <div className='gallery-main'>
        <img src={images[index]} alt={`${title} 展示图 ${index + 1}`} />
        {images.length > 1 && (
          <div className='gallery-controls'>
            <button type='button' onClick={handlePrev} aria-label='上一张'>
              ?
            </button>
            <span>
              {index + 1} / {images.length}
            </span>
            <button type='button' onClick={handleNext} aria-label='下一张'>
              ?
            </button>
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className='gallery-thumbs'>
          {images.map((image, thumbIndex) => (
            <button
              key={image}
              type='button'
              className={`thumb${thumbIndex === index ? ' is-active' : ''}`}
              onClick={() => setIndex(thumbIndex)}
            >
              <img src={image} alt={`${title} 缩略图 ${thumbIndex + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default WorkGallery

