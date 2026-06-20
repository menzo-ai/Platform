'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  Settings,
  SkipBack,
  SkipForward,
  RotateCcw,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Share2,
  Download,
  AlertTriangle
} from 'lucide-react'

interface ProtectedVideoPlayerProps {
  videoUrl: string
  title: string
  onProgress?: (progress: number) => void
  autoProgress?: boolean
}

export default function ProtectedVideoPlayer({ 
  videoUrl, 
  title,
  onProgress,
  autoProgress = true 
}: ProtectedVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  const [showWarning, setShowWarning] = useState(true)
  const [isLocked, setIsLocked] = useState(false)
  const hideControlsTimeout = useRef<NodeJS.Timeout>()

  // Hide YouTube logo and related videos by extracting video ID and using embed
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0]
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`
    }
    return url
  }

  const embedUrl = getEmbedUrl(videoUrl)
  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')

  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    // Disable keyboard shortcuts for screenshots
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        e.preventDefault()
        return false
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
        if (window.getSelection()?.toString() === '') {
          e.preventDefault()
        }
      }
    }

    // Disable drag
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault()
      return false
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('contextmenu', handleContextMenu)
      container.addEventListener('dragstart', handleDragStart)
    }
    
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      if (container) {
        container.removeEventListener('contextmenu', handleContextMenu)
        container.removeEventListener('dragstart', handleDragStart)
      }
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Auto-hide controls
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true)
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current)
      }
      if (isPlaying) {
        hideControlsTimeout.current = setTimeout(() => {
          setShowControls(false)
        }, 3000)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove)
      }
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current)
      }
    }
  }, [isPlaying])

  // Track progress
  useEffect(() => {
    if (autoProgress && duration > 0) {
      const progress = (currentTime / duration) * 100
      onProgress?.(progress)
    }
  }, [currentTime, duration, autoProgress, onProgress])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const time = parseFloat(e.target.value)
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value)
    setVolume(vol)
    if (videoRef.current) {
      videoRef.current.volume = vol
    }
    setIsMuted(vol === 0)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        containerRef.current.requestFullscreen?.()
      } else {
        document.exitFullscreen?.()
      }
      setIsFullscreen(!isFullscreen)
    }
  }

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds
    }
  }

  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate)
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
    }
    setShowSettings(false)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  // YouTube Embed (no YouTube UI)
  if (isYouTube) {
    return (
      <div 
        ref={containerRef}
        className="relative aspect-video bg-black rounded-xl overflow-hidden group"
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Warning Banner */}
        {showWarning && (
          <div className="absolute top-0 left-0 right-0 bg-amber-500/90 p-3 flex items-center justify-between z-50">
            <div className="flex items-center gap-2 text-black">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">محتوى محمي - النسخ والحفظ ممنوع</span>
            </div>
            <button onClick={() => setShowWarning(false)} className="text-black hover:opacity-70">
              <EyeOff className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* YouTube Iframe */}
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />

        {/* Protection Overlay */}
        <div className="absolute inset-0 pointer-events-none" />
      </div>
    )
  }

  // HTML5 Video Player
  return (
    <div 
      ref={containerRef}
      className="relative aspect-video bg-black rounded-xl overflow-hidden group"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onClick={togglePlay}
        disablePictureInPicture
        controlsList="nodownload noplaybackrate"
      />

      {/* Lock Overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-40">
          <div className="text-center">
            <Lock className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <p className="text-white text-lg mb-4">المحتوى مقفل</p>
            <button 
              onClick={() => setIsLocked(false)}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
            >
              فتح القفل
            </button>
          </div>
        </div>
      )}

      {/* Play Button Overlay */}
      {!isPlaying && !isLocked && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
          onClick={togglePlay}
        >
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
            <Play className="w-10 h-10 text-white mr-[-4px]" />
          </div>
        </div>
      )}

      {/* Controls */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        {/* Progress Bar */}
        <div className="relative h-1 bg-white/20 rounded-full mb-4 cursor-pointer group/progress">
          <div 
            className="absolute h-full bg-primary rounded-full"
            style={{ width: `${progress}%` }}
          />
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
          />
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Play/Pause */}
            <button onClick={togglePlay} className="text-white hover:text-primary transition-colors">
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>

            {/* Skip */}
            <button onClick={() => skip(-10)} className="text-white hover:text-primary transition-colors">
              <RotateCcw className="w-5 h-5" />
            </button>
            <button onClick={() => skip(10)} className="text-white hover:text-primary transition-colors">
              <SkipForward className="w-5 h-5" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className="text-white hover:text-primary transition-colors">
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
              />
            </div>

            {/* Time */}
            <span className="text-white text-sm font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Speed */}
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="text-white hover:text-primary transition-colors relative"
            >
              <Settings className="w-5 h-5" />
              {showSettings && (
                <div className="absolute bottom-full right-0 mb-2 bg-slate-800 rounded-lg shadow-xl p-2 min-w-[120px]">
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                    <button
                      key={rate}
                      onClick={() => changePlaybackRate(rate)}
                      className={`block w-full text-right px-3 py-1.5 rounded text-sm ${
                        playbackRate === rate ? 'bg-primary text-white' : 'text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </button>

            {/* Lock */}
            <button 
              onClick={() => setIsLocked(!isLocked)}
              className={`transition-colors ${isLocked ? 'text-amber-400' : 'text-white hover:text-amber-400'}`}
            >
              {isLocked ? <Lock className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>

            {/* Fullscreen */}
            <button onClick={toggleFullscreen} className="text-white hover:text-primary transition-colors">
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Protection Warning */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
        <Lock className="w-3 h-3 text-amber-400" />
        <span className="text-xs text-white">محتوى محمي</span>
      </div>
    </div>
  )
}