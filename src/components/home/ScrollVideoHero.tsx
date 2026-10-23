'use client';

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Layers,
  Award,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export type VideoState = 'idle' | 'playing' | 'completing' | 'ready' | 'resetting';

interface SceneContent {
  id: string;
  startTime: number;
  endTime: number;
  badge?: string;
  badgeIcon?: React.ComponentType<{ className?: string }>;
  heading: string;
  headingAccent?: string;
  subtitle: string;
  keyPoints?: string[];
  metrics?: { label: string; value: string; desc?: string }[];
  primaryCta?: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
}

const TOTAL_DURATION = 10.0;

const SCENES: SceneContent[] = [
  // Scene 1: 0.0s - 2.4s — Factory Entrance & Coimbatore Brand Introduction
  {
    id: 'intro',
    startTime: 0.0,
    endTime: 2.4,
    badge: 'Coimbatore Machine Engineering',
    heading: 'Engineering Solutions for a',
    headingAccent: 'Cleaner, Greener Tomorrow.',
    subtitle:
      'Plastic recycling machinery and integrated processing solutions engineered to help businesses transform plastic waste into reusable resources.',
    keyPoints: [
      '10 FT Compact Footprint',
      'Closed-Loop Water Recycling',
      'Active UAE & Middle East Export'
    ],
    primaryCta: { text: 'Request a Quote', href: '/contact?intent=quote' },
    secondaryCta: { text: 'Explore Machinery', href: '/machineries' }
  },

  // Scene 2: 2.4s - 5.2s — Heavy-Duty Scrap Size Reduction & Crusher
  {
    id: 'crusher',
    startTime: 2.4,
    endTime: 5.2,
    badge: 'Heavy-Duty Scrap Size Reduction',
    badgeIcon: Award,
    heading: 'Built for Industrial',
    headingAccent: 'Cutting Performance.',
    subtitle:
      'G-Series heavy-duty plastic crushers and granulators equipped with hardened EN41 alloy rotor knives and high-torque Havells 3-phase electric motors for 24/7 continuous operation.',
    metrics: [
      { label: 'Drive Reliability', value: 'Havells 380V/415V', desc: 'Heavy-duty 3-phase motor' },
      { label: 'Cutter Metallurgy', value: 'EN41 Alloy Steel', desc: 'Precision-hardened knives' },
      { label: 'Throughput Range', value: '250 to 5,000 kg/h', desc: 'Rigids, drums, and films' }
    ],
    primaryCta: { text: 'Explore G-Series Crushers', href: '/machineries/g-series-plastic-crusher-machine' },
    secondaryCta: { text: 'Request Crusher Pricing', href: '/contact?intent=quote&product=g-series-plastic-crusher-machine' }
  },

  // Scene 3: 5.2s - 7.8s — Continuous Transport & Screw Conveyors
  {
    id: 'conveyor',
    startTime: 5.2,
    endTime: 7.8,
    badge: 'Automated Continuous Transport',
    badgeIcon: Layers,
    heading: 'Designed Around Your',
    headingAccent: 'Recycling Process.',
    subtitle:
      'Continuous CR Series screw conveyors and SS 302 stainless steel augers seamlessly bridge shredding, hot-friction washing, and pneumatic blower drying with zero material hold-up.',
    metrics: [
      { label: 'Auger Flight', value: '5,400 mm Length', desc: 'Continuous spiral flights' },
      { label: 'Contact Metallurgy', value: 'SS 302 Stainless', desc: 'Corrosion-proof chambers' },
      { label: 'Cycle Turnaround', value: '~10 Minutes', desc: 'Rapid cleaning cycle' }
    ],
    primaryCta: { text: 'View Conveyor Datasheet', href: '/machineries/cr-series-screw-conveyor' },
    secondaryCta: { text: 'Custom Layout Inquiry', href: '/contact?intent=quote&product=cr-series-screw-conveyor' }
  },

  // Scene 4: 7.8s - 10.0s — Complete Turnkey Line & Quotation Action
  {
    id: 'turnkey',
    startTime: 7.8,
    endTime: 10.0,
    badge: 'Flagship Integrated Plant',
    badgeIcon: ShieldCheck,
    heading: 'Let’s Build Your',
    headingAccent: 'Turnkey Recycling Line.',
    subtitle:
      'From modular 10 FT compact closed-loop washing plants to compounding extruders and genuine spare parts, ABS Polymers delivers end-to-end engineering from Coimbatore to global markets.',
    metrics: [
      { label: 'Footprint Saving', value: '~65% Floor Space', desc: 'vs 30 FT conventional lines' },
      { label: 'Polymer Mastery', value: '35+ Years Heritage', desc: 'Coimbatore granules trading' },
      { label: 'Global Footprint', value: 'Direct Sea Despatch', desc: 'On-site trial runs & export' }
    ],
    primaryCta: { text: 'Request Factory Quotation', href: '/contact?intent=quote' },
    secondaryCta: { text: 'Browse Complete Catalogue', href: '/machineries' }
  }
];

interface ScrollVideoHeroProps {
  customHero?: {
    headline?: string;
    headlineAccent?: string;
    subheadline?: string;
    primaryCtaText?: string;
    primaryCtaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
    highlights?: string[];
  };
}

export default function ScrollVideoHero({ customHero }: ScrollVideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStartYRef = useRef<number>(0);
  const shouldReduceMotion = useReducedMotion();

  // State Machine: idle -> playing -> completing -> ready -> resetting
  const [videoState, setVideoState] = useState<VideoState>('idle');
  const videoStateRef = useRef<VideoState>('idle');

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);

  // Keep ref in sync to avoid stale closures in window event listeners
  useEffect(() => {
    videoStateRef.current = videoState;
  }, [videoState]);

  // Preload video buffer on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, []);

  // Merge dynamic CMS hero overrides into scenes
  const scenes = useMemo(() => {
    return SCENES.map((scene, idx) => {
      if (idx === 0 && customHero) {
        return {
          ...scene,
          heading: customHero.headline || scene.heading,
          headingAccent: customHero.headlineAccent || scene.headingAccent,
          subtitle: customHero.subheadline || scene.subtitle,
          keyPoints: customHero.highlights || scene.keyPoints,
          primaryCta: customHero.primaryCtaText
            ? { text: customHero.primaryCtaText, href: customHero.primaryCtaLink || '/contact?intent=quote' }
            : scene.primaryCta,
          secondaryCta: customHero.secondaryCtaText
            ? { text: customHero.secondaryCtaText, href: customHero.secondaryCtaLink || '/machineries' }
            : scene.secondaryCta
        };
      }
      return scene;
    });
  }, [customHero]);

  // Start complete playback forward from time zero
  const startPlayback = useCallback(() => {
    if (videoStateRef.current === 'playing' || videoStateRef.current === 'completing') return;
    const video = videoRef.current;
    if (!video) return;

    setVideoState('playing');
    videoStateRef.current = 'playing';
    video.currentTime = 0;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Playback gesture was prevented or failed:', err);
        setVideoState('ready');
        videoStateRef.current = 'ready';
      });
    }
  }, []);

  // Reset to initial first frame and Scene 1 when user scrolls back to top
  const resetToFirstFrame = useCallback(() => {
    const video = videoRef.current;
    setVideoState('resetting');
    videoStateRef.current = 'resetting';
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setCurrentTime(0);
    setActiveSceneIndex(0);
    setTimeout(() => {
      setVideoState('idle');
      videoStateRef.current = 'idle';
    }, 150);
  }, []);

  // Completion: glides upward and releases normal scrolling
  const handleVideoEnded = useCallback(() => {
    setVideoState('completing');
    videoStateRef.current = 'completing';
    setTimeout(() => {
      setVideoState('ready');
      videoStateRef.current = 'ready';
      // Smoothly transition upward into next homepage section
      const nextSection = document.getElementById('feature-bar');
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 400);
  }, []);

  // Track video time and synchronize scene text accurately
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    const t = video.currentTime;
    setCurrentTime(t);

    // Sync scenes based on actual video time
    const idx = scenes.findIndex((s) => t >= s.startTime && t < s.endTime);
    if (idx !== -1) {
      setActiveSceneIndex(idx);
    } else if (t >= scenes[scenes.length - 1].startTime) {
      setActiveSceneIndex(scenes.length - 1);
    }
  };

  // Global Window-Level Gesture Interception:
  // Prevents the hero from scrolling away on that first gesture and instead starts playback.
  useEffect(() => {
    // 1. Wheel listener (Desktop mouse wheel & trackpad)
    const onWheel = (e: WheelEvent) => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;

      // Only act when the user is at the top / hero section
      if (scrollY > 30) return;

      if (videoStateRef.current === 'idle') {
        if (e.deltaY > 0) {
          // Prevent browser from scrolling the hero away!
          e.preventDefault();
          startPlayback();
        }
      } else if (videoStateRef.current === 'playing') {
        // While video is playing, keep the hero pinned so user doesn't accidentally scroll past mid-video
        e.preventDefault();
      } else if (videoStateRef.current === 'ready') {
        // If user returned to the very top and scrolls upward, reset back to idle
        if (e.deltaY < -15 && scrollY <= 5) {
          resetToFirstFrame();
        }
      }
    };

    // 2. Touch gesture listener (Mobile touchscreen & trackpads)
    const onTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      if (scrollY > 30) return;

      const currentY = e.touches[0].clientY;
      const diffY = touchStartYRef.current - currentY;

      if (videoStateRef.current === 'idle') {
        // Small intentional downward swipe (> 12px) triggers video without scrolling page
        if (diffY > 12) {
          if (e.cancelable) e.preventDefault();
          startPlayback();
        }
      } else if (videoStateRef.current === 'playing') {
        // Keep hero pinned during playback
        if (e.cancelable) e.preventDefault();
      }
    };

    // 3. Keyboard navigation (Down arrow, PageDown, Space)
    const onKeyDown = (e: KeyboardEvent) => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      if (scrollY > 30) return;

      if (videoStateRef.current === 'idle') {
        if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
          e.preventDefault();
          startPlayback();
        }
      }
    };

    // 4. Reset on returning to top of page
    const onWindowScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      if (scrollY <= 5 && videoStateRef.current === 'ready') {
        resetToFirstFrame();
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('keydown', onKeyDown, { passive: false });
    window.addEventListener('scroll', onWindowScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onWindowScroll);
    };
  }, [startPlayback, resetToFirstFrame]);

  // Jump to specific scene if milestone clicked
  const jumpToScene = (index: number) => {
    const video = videoRef.current;
    if (!video) return;
    const targetScene = scenes[index];
    video.currentTime = targetScene.startTime;
    setActiveSceneIndex(index);
    if (videoStateRef.current === 'idle') {
      startPlayback();
    }
  };

  const currentScene = scenes[activeSceneIndex] || scenes[0];
  const progressPercent = Math.min(100, Math.round((currentTime / TOTAL_DURATION) * 100));

  return (
    <div
      className={`relative bg-navy-950 text-white h-screen w-full transition-transform duration-700 ease-out overflow-hidden ${
        videoState === 'completing' ? '-translate-y-4' : 'translate-y-0'
      }`}
    >
      {/* Background Video Layer */}
      <div className="absolute inset-0 z-0 bg-navy-950 flex items-center justify-center">
        {/* Instant Frame 1 Poster Fallback (Zero delay on page load) */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 pointer-events-none z-[1] ${
            isVideoLoaded && videoState !== 'idle' && videoState !== 'resetting'
              ? 'opacity-0'
              : 'opacity-100'
          }`}
          style={{ backgroundImage: `url('/videos/hero-poster.jpg')` }}
        />

        {/* Cinematic Optimized Video Stream */}
        <video
          ref={videoRef}
          src="/videos/hero-scroll-1080p.mp4"
          playsInline
          muted
          preload="auto"
          onLoadedMetadata={() => setIsVideoLoaded(true)}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          className="w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.08] relative z-[2]"
        />

        {/* Directional Gradients for Crisp Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 md:via-navy-950/70 to-navy-950/30 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/60 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-tech-grid opacity-20 z-10 pointer-events-none" />
      </div>

      {/* Main Narrative Hero Overlay */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex flex-col justify-between pt-28 pb-10 sm:pb-12">
        {/* Top Status Bar: Playback State Indicator & Skip Link */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center space-x-2 bg-navy-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/80 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                videoState === 'playing'
                  ? 'bg-emerald-400 animate-pulse'
                  : videoState === 'idle'
                  ? 'bg-brand-orange animate-ping'
                  : 'bg-slate-400'
              }`}
            />
            <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              {videoState === 'idle'
                ? 'Scroll Down to Start Experience'
                : videoState === 'playing'
                ? `Plant Tour in Progress (${currentTime.toFixed(1)}s / ${TOTAL_DURATION}s)`
                : videoState === 'completing' || videoState === 'ready'
                ? 'Plant Overview Complete'
                : 'Preparing Replay'}
            </span>
          </div>

          {/* Quick Skip to Content Button */}
          <button
            type="button"
            onClick={() => {
              const video = videoRef.current;
              if (video) video.pause();
              setVideoState('ready');
              videoStateRef.current = 'ready';
              const nextSection = document.getElementById('feature-bar');
              if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="text-xs font-bold text-slate-400 hover:text-white bg-navy-900/60 hover:bg-navy-900 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors inline-flex items-center space-x-1"
          >
            <span>Skip to Content</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Narrative Content Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-4">
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScene.id}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="space-y-5 sm:space-y-6"
              >
                {/* Scene Badge */}
                {currentScene.badge && (
                  <div className="inline-flex items-center space-x-2 bg-navy-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/80 shadow-md">
                    {currentScene.badgeIcon ? (
                      React.createElement(currentScene.badgeIcon, {
                        className: 'w-4 h-4 text-brand-orange'
                      })
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
                    )}
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      {currentScene.badge}
                    </span>
                  </div>
                )}

                {/* Main Headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-white">
                  {currentScene.heading}{' '}
                  {currentScene.headingAccent && (
                    <span className="text-brand-orange block sm:inline underline decoration-brand-orange/40 decoration-wavy decoration-1 underline-offset-8">
                      {currentScene.headingAccent}
                    </span>
                  )}
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal drop-shadow-xs">
                  {currentScene.subtitle}
                </p>

                {/* Keypoints (Scene 1) */}
                {currentScene.keyPoints && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs sm:text-sm text-slate-300">
                    {currentScene.keyPoints.map((point, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-2 bg-navy-900/80 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-700/70 shadow-xs"
                      >
                        <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
                        <span className="font-medium text-slate-200">{point}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Metrics Pills (Scenes 2, 3, 4) */}
                {currentScene.metrics && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    {currentScene.metrics.map((metric, idx) => (
                      <div
                        key={idx}
                        className="bg-navy-900/85 backdrop-blur-md border border-slate-700/70 rounded-xl p-3 sm:p-3.5 space-y-1 shadow-md"
                      >
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          {metric.label}
                        </span>
                        <span className="text-sm sm:text-base font-black text-white font-mono block">
                          {metric.value}
                        </span>
                        {metric.desc && (
                          <span className="text-[11px] text-slate-400 block font-normal">
                            {metric.desc}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA Buttons (Clean: No 'Start Tour' button) */}
                <div className="flex flex-wrap items-center gap-3.5 pt-3">
                  {currentScene.primaryCta && (
                    <Link
                      href={currentScene.primaryCta.href}
                      className="inline-flex items-center px-6 py-3.5 text-sm sm:text-base font-bold text-white bg-brand-orange hover:bg-orange-600 rounded-lg shadow-xl shadow-brand-orange/25 hover:shadow-brand-orange/40 transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                      <span>{currentScene.primaryCta.text}</span>
                      <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                    </Link>
                  )}

                  {currentScene.secondaryCta && (
                    <Link
                      href={currentScene.secondaryCta.href}
                      className="inline-flex items-center px-5 py-3.5 text-sm sm:text-base font-bold text-slate-200 hover:text-white bg-navy-900/85 hover:bg-navy-800/95 border border-slate-700 rounded-lg shadow-md transition-all duration-200"
                    >
                      <span>{currentScene.secondaryCta.text}</span>
                    </Link>
                  )}

                  {/* Replay action only appears if sequence was completed and user is still at hero */}
                  {(videoState === 'ready' || videoState === 'completing') && (
                    <button
                      type="button"
                      onClick={startPlayback}
                      className="inline-flex items-center px-4 py-3.5 text-xs font-bold text-slate-300 hover:text-white bg-navy-900/80 border border-slate-700 rounded-lg transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                      <span>Replay Sequence</span>
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right-Hand Milestone Navigator */}
          <div className="hidden lg:flex lg:col-span-4 flex-col items-end justify-center">
            <div className="bg-navy-900/85 backdrop-blur-md border border-slate-800/90 rounded-2xl p-5 w-72 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Industrial Sequence
                </span>
                <span className="text-xs font-mono font-bold text-brand-orange">
                  {String(activeSceneIndex + 1).padStart(2, '0')} / 04
                </span>
              </div>

              {/* Milestone Buttons */}
              <div className="space-y-2">
                {scenes.map((scene, idx) => {
                  const isActive = idx === activeSceneIndex;
                  return (
                    <button
                      key={scene.id}
                      type="button"
                      onClick={() => jumpToScene(idx)}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between ${
                        isActive
                          ? 'bg-brand-orange text-white shadow-md font-bold'
                          : 'bg-navy-950/60 text-slate-400 hover:text-white hover:bg-navy-950'
                      }`}
                    >
                      <div className="truncate mr-2">
                        <span className="text-[10px] font-mono mr-2 opacity-75">
                          0{idx + 1}
                        </span>
                        <span className="text-xs">{scene.heading}</span>
                      </div>
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0 animate-ping" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Video Timeline Gauge */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Playback Timeline</span>
                  <span>{currentTime.toFixed(1)}s / {TOTAL_DURATION}s</span>
                </div>
                <div className="h-1.5 w-full bg-navy-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-brand-orange to-orange-400 transition-all duration-100 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gesture Prompt (Clean Industrial Notice) */}
        <div className="flex flex-col items-center">
          <div className="inline-flex items-center space-x-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-300 bg-navy-900/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-800/80 shadow-md">
            {videoState === 'idle' ? (
              <>
                <span>Scroll or swipe down slightly to start video sequence</span>
                <ChevronDown className="w-3.5 h-3.5 text-brand-orange animate-bounce" />
              </>
            ) : videoState === 'playing' ? (
              <>
                <span>Continuous plant sequence in progress</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </>
            ) : (
              <>
                <span>Sequence complete — scroll down to explore machinery</span>
                <ChevronDown className="w-3.5 h-3.5 text-brand-orange animate-bounce" />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
