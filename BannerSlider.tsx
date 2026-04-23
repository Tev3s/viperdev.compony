import React, { useState, useEffect, useRef } from 'react';
import { IconChevronUp, IconTag, IconVolumeX, IconVolume2 } from './Icons';
import { getYouTubeId, getTikTokId } from '../lib/utils';

export const BannerSlider = ({ items }: { items: any[] }) => {
  const [curr, setCurr] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const playerRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    if ((items || []).length <= 1 || isPaused) return;
    const t = setInterval(() => {
      setCurr(c => (c + 1) % (items || []).length);
      setExpanded(false);
    }, 6000);
    return () => clearInterval(t);
  }, [(items || []).length, isPaused]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted, curr]);

  useEffect(() => {
    if (!items || items.length === 0) return;
    const currentItem = items[curr];
    if (currentItem?.type === 'youtube') {
      setIsPaused(true);
      if ((window as any).YT && (window as any).YT.Player) {
        try {
          if (playerRef.current && typeof playerRef.current.destroy === 'function') playerRef.current.destroy();
          playerRef.current = new (window as any).YT.Player(`yt-player-${curr}`, {
            videoId: getYouTubeId(currentItem.url),
            playerVars: {
              autoplay: 1, controls: 0, mute: isMuted ? 1 : 0, rel: 0, showinfo: 0, loop: 1, playlist: getYouTubeId(currentItem.url)
            },
            events: {
              onReady: (e: any) => { if (!isMuted) e.target.unMute(); },
              onStateChange: (e: any) => {
                if (e.data === (window as any).YT.PlayerState.ENDED) {
                  setCurr(c => (c + 1) % items.length);
                  setIsPaused(false);
                }
              }
            }
          });
        } catch (e) {
          setIsPaused(false);
        }
      } else {
        setTimeout(() => {
          setCurr(c => (c + 1) % items.length);
          setIsPaused(false);
        }, 10000);
      }
    } else if (currentItem?.type === 'video' || ((currentItem?.url || '').match(/\.(mp4|webm)$/i))) {
      setIsPaused(true);
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.muted = isMuted;
        videoRef.current.play().catch(() => { });
        videoRef.current.onended = () => {
          setCurr(c => (c + 1) % items.length);
          setIsPaused(false);
        };
      }
    } else if (currentItem?.type === 'tiktok') {
      setIsPaused(true);
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    } else {
      setIsPaused(false);
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    }
  }, [curr, items]);

  if (!items || items.length === 0) return null;

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) setCurr(c => (c === items.length - 1 ? 0 : c + 1));
    if (distance < -50) setCurr(c => (c === 0 ? items.length - 1 : c - 1));
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div className="w-full h-56 md:h-80 rounded-[2.5rem] overflow-hidden relative bg-gray-900 cursor-pointer border border-theme shadow-xl"
      onClick={(e) => {
        if ((e.target as HTMLElement).tagName !== 'IFRAME') {
          if (items[curr]?.targetLink) window.open(items[curr].targetLink, '_blank');
          else setExpanded(!expanded);
        }
      }}
      onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientX)}
      onTouchMove={(e) => setTouchEnd(e.targetTouches[0].clientX)}
      onTouchEnd={handleTouchEnd}
    >
      {items.map((b, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === curr ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
          {b.type === 'youtube' ? (
            <div id={`yt-player-${i}`} className="w-full h-full object-cover pointer-events-none opacity-90 scale-105"></div>
          ) : b.type === 'tiktok' ? (
            <iframe src={`https://www.tiktok.com/embed/v2/${getTikTokId(b.url)}`} className="w-full h-full opacity-95 border-none pointer-events-auto" allow="autoplay; encrypted-media" allowFullScreen></iframe>
          ) : (b.type === 'video' || ((b.url || '').match(/\.(mp4|webm)$/i))) ? (
            <video ref={i === curr ? videoRef : null} src={b.url} className="w-full h-full object-cover opacity-90" playsInline loop autoPlay={i === curr} />
          ) : (
            <img src={b.url} className="w-full h-full object-cover opacity-90 pointer-events-none" alt="" />
          )}

          {(b.title || b.desc) && b.type !== 'tiktok' && (
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-6 md:p-8 z-20 pointer-events-none">
              {b.title && <h3 className={`text-xl md:text-3xl font-black text-white drop-shadow-md transition-all duration-500 ${expanded ? '-translate-y-2' : 'translate-y-4'}`}>{b.title}</h3>}
              {b.desc && <div className={`overflow-hidden transition-all duration-500 ${expanded ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}><p className="text-xs md:text-sm text-gray-200 drop-shadow-md">{b.desc}</p></div>}
              {!expanded && !b.targetLink && <div className="text-[9px] text-white/70 animate-pulse mt-4 flex items-center gap-1 font-bold"><IconChevronUp className="w-3 h-3" /> Klik/Usap banner</div>}
              {b.targetLink && <div className="text-[9px] text-primary-light font-bold uppercase tracking-widest mt-4 flex items-center gap-1 drop-shadow-md"><IconTag className="w-3 h-3" /> Kunjungi Tautan</div>}
            </div>
          )}
        </div>
      ))}
      {(items[curr]?.type === 'youtube' || items[curr]?.type === 'video' || ((items[curr]?.url || '').match(/\.(mp4|webm)$/i))) && (
        <button onClick={(e) => {
          e.stopPropagation();
          setIsMuted(!isMuted);
          if (items[curr]?.type === 'youtube' && playerRef.current) {
            if (!isMuted) playerRef.current.mute();
            else playerRef.current.unMute();
          }
        }} className="absolute top-4 right-4 z-30 p-2.5 bg-black/60 rounded-xl text-white backdrop-blur-md border border-white/20 shadow-lg hover:bg-black/80 transition">
          {isMuted ? <IconVolumeX className="w-4 h-4" /> : <IconVolume2 className="w-4 h-4" />}
        </button>
      )}
      {items.length > 1 && (
        <div className="absolute bottom-6 right-6 flex gap-2 z-30 bg-black/40 px-3 py-2 rounded-full backdrop-blur-sm border border-white/10">
          {items.map((_, i) => (
            <div key={i} onClick={(e) => { e.stopPropagation(); setCurr(i); setExpanded(false); }} className={`h-2 rounded-full cursor-pointer transition-all ${i === curr ? 'w-6 bg-primary' : 'w-2 bg-white/50 hover:bg-white/80'}`}></div>
          ))}
        </div>
      )}
    </div>
  );
};
