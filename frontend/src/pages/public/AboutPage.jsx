import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Heart,
  Users,
  Target,
  BookOpen,
  Camera,
  Code2,
  Music,
  Trophy,
  Palette,
  Compass,
  ArrowRight,
  Info,
  Award,
  GraduationCap,
  MapPin,
  Calendar,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useInView } from '../../hooks/useInView';

// Optional creator photo URL (defaults to null for elegant avatar placeholder)
const CREATOR_PHOTO_URL = null;

export const AboutPage = () => {
  // Intersection observers for coordinated scroll entrances
  const [heroRef, heroInView] = useInView();
  const [introRef, introInView] = useInView();
  const [expRef, expInView] = useInView();
  const [socRef, socInView] = useInView();
  const [photoRef, photoInView] = useInView();
  const [archRef, archInView] = useInView();
  const [creatorRef, creatorInView] = useInView();

  return (
    <div style={{ padding: 'var(--space-12) 0 var(--space-20)' }}>
      <div className="container">
        {/* ========================================================================= */}
        {/* SECTION 1: HEADER & CAMPUS INTRODUCTION                                   */}
        {/* ========================================================================= */}
        <div
          ref={heroRef}
          className={heroInView ? 'animate-hero-fade-up' : ''}
          style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}
        >
          <div className="editorial-eyebrow" style={{ justifyContent: 'center' }}>
            <Compass size={14} />
            <span>Campus Life & Platform Philosophy</span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)',
              fontWeight: '900',
              letterSpacing: '-0.03em',
              marginBottom: 'var(--space-4)',
              lineHeight: 1.15,
            }}
          >
            Where Campus Vibrancy Meets Connected Events
          </h1>
          <p
            style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--text-secondary)',
              maxWidth: '780px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            University life extends far beyond lecture halls and semester examinations. It thrives in the energy of
            auditorium stage lights, late-night hackathon sprints, cultural galas, and inter-department sports derbies.
            GATHERLY was engineered to unify this rich campus tapestry into a single, seamless digital ecosystem.
          </p>
        </div>

        {/* Introduction Narrative Banner */}
        <div ref={introRef} className={introInView ? 'animate-slide-up delay-1' : ''}>
          <Card
            glass
            style={{
              padding: 'var(--space-8)',
              marginBottom: 'var(--space-12)',
              borderLeft: '4px solid var(--primary)',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: '800', marginBottom: 'var(--space-3)' }}>
                  The Pulse of University Culture
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: 'var(--text-sm)' }}>
                  Every semester, campus societies organize dozens of tech expos, dance showcases, musical nights, and
                  competitive tournaments. Yet students often missed key registration windows due to scattered posters,
                  informal chat threads, and fragmented links. GATHERLY bridges this gap by providing an authentic central
                  stage for event discovery, verified ticketing, and lasting memories.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'var(--space-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} color="var(--primary)" />
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: '600' }}>
                    Real-time schedules for all campus clubs and departments
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} color="var(--primary)" />
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: '600' }}>
                    Cryptographically verified QR passes with gate check-in
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} color="var(--primary)" />
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: '600' }}>
                    Curated visual archives preserving festival highlights
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: CAMPUS LIFE EXPERIENCES                                        */}
        {/* ========================================================================= */}
        <div ref={expRef} style={{ marginBottom: 'var(--space-16)' }}>
          <div
            className={expInView ? 'animate-slide-up' : ''}
            style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}
          >
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: '800', letterSpacing: '-0.02em' }}>
              The Dimensions of Campus Life
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: '6px' }}>
              From competitive coding marathons to colorful folk dances, experience every facet of university spirit.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--space-6)',
            }}
          >
            {/* Cultural Festivals */}
            <Card
              glass
              className={expInView ? 'about-experience-card animate-slide-up delay-1' : 'about-experience-card'}
              style={{ padding: 0, overflow: 'hidden' }}
            >
              <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src="/uploads/gallery/defaults/rangmanch_cultural_fest.jpg"
                  alt="Campus Cultural Fest"
                  className="exp-card-img"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                  <Badge variant="primary">Cultural Fests</Badge>
                </div>
              </div>
              <div style={{ padding: 'var(--space-5)' }}>
                <h4 style={{ fontSize: 'var(--text-base)', fontWeight: '800', marginBottom: '8px' }}>
                  Annual Fests & Stage Celebrations
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  Multi-day annual festivals featuring illuminated stages, celebrity concerts, traditional music, and
                  electrifying student cheering sections.
                </p>
              </div>
            </Card>

            {/* Classical & Contemporary Dance */}
            <Card
              glass
              className={expInView ? 'about-experience-card animate-slide-up delay-2' : 'about-experience-card'}
              style={{ padding: 0, overflow: 'hidden' }}
            >
              <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src="/uploads/gallery/defaults/udaan_dance_night.jpg"
                  alt="Dance Showcase"
                  className="exp-card-img"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                  <Badge variant="secondary">Performing Arts</Badge>
                </div>
              </div>
              <div style={{ padding: 'var(--space-5)' }}>
                <h4 style={{ fontSize: 'var(--text-base)', fontWeight: '800', marginBottom: '8px' }}>
                  Dance & Theater Productions
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  Classical Bharatanatyam, Kathak, folk Garba, and modern Bollywood fusion troupes performing
                  choreographies across open amphitheaters.
                </p>
              </div>
            </Card>

            {/* Technical Hackathons */}
            <Card
              glass
              className={expInView ? 'about-experience-card animate-slide-up delay-3' : 'about-experience-card'}
              style={{ padding: 0, overflow: 'hidden' }}
            >
              <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src="/uploads/gallery/defaults/hackverse_student_hackathon.jpg"
                  alt="Student Hackathon"
                  className="exp-card-img"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                  <Badge variant="default">Engineering</Badge>
                </div>
              </div>
              <div style={{ padding: 'var(--space-5)' }}>
                <h4 style={{ fontSize: 'var(--text-base)', fontWeight: '800', marginBottom: '8px' }}>
                  Hackathons & Tech Innovation
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  High-stakes 36-hour coding marathons, AI prototype demos, robotics rover courses, and technical
                  paper presentations.
                </p>
              </div>
            </Card>

            {/* Sports & Extracurriculars */}
            <Card
              glass
              className={expInView ? 'about-experience-card animate-slide-up delay-4' : 'about-experience-card'}
              style={{ padding: 0, overflow: 'hidden' }}
            >
              <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src="/uploads/gallery/defaults/campus_sports_carnival.jpg"
                  alt="Campus Sports"
                  className="exp-card-img"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                  <Badge variant="success">Athletics</Badge>
                </div>
              </div>
              <div style={{ padding: 'var(--space-5)' }}>
                <h4 style={{ fontSize: 'var(--text-base)', fontWeight: '800', marginBottom: '8px' }}>
                  Sports Carnivals & Tournaments
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  Inter-hostel cricket leagues, badminton championships, football derbies, and track qualifiers
                  contested with competitive camaraderie.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 3: STUDENT SOCIETIES & COMMUNITIES                                 */}
        {/* ========================================================================= */}
        <div ref={socRef} style={{ marginBottom: 'var(--space-16)' }}>
          <div
            className={socInView ? 'animate-slide-up' : ''}
            style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}
          >
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: '800', letterSpacing: '-0.02em' }}>
              Student Society Ecosystem
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: '6px' }}>
              Student-led societies form the heartbeat of campus culture, empowering peers to lead, build, and express.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 'var(--space-5)',
            }}
          >
            <Card
              glass
              className={socInView ? 'about-society-card animate-slide-up delay-1' : 'about-society-card'}
              style={{ padding: 'var(--space-6)' }}
            >
              <div className="society-icon-box" style={{ width: 'fit-content' }}>
                <Code2 size={24} color="var(--primary)" style={{ marginBottom: '12px' }} />
              </div>
              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: '800', marginBottom: '6px' }}>
                Technical Societies
              </h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Student chapters dedicated to artificial intelligence, full-stack web, open-source software, competitive
                coding, and robotics engineering.
              </p>
            </Card>

            <Card
              glass
              className={socInView ? 'about-society-card animate-slide-up delay-2' : 'about-society-card'}
              style={{ padding: 'var(--space-6)' }}
            >
              <div className="society-icon-box" style={{ width: 'fit-content' }}>
                <Music size={24} color="var(--accent-secondary)" style={{ marginBottom: '12px' }} />
              </div>
              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: '800', marginBottom: '6px' }}>
                Cultural & Performing Troupes
              </h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Bands, instrumentalists, classical dancers, street theater (Nukkad Natak), and theatrical production
                teams staging annual plays.
              </p>
            </Card>

            <Card
              glass
              className={socInView ? 'about-society-card animate-slide-up delay-3' : 'about-society-card'}
              style={{ padding: 'var(--space-6)' }}
            >
              <div className="society-icon-box" style={{ width: 'fit-content' }}>
                <Camera size={24} color="var(--highlight)" style={{ marginBottom: '12px' }} />
              </div>
              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: '800', marginBottom: '6px' }}>
                Photography & Shutter Societies
              </h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Campus photojournalists documenting fest milestones, behind-the-scenes rehearsals, and visual memory
                chronicles for the student body.
              </p>
            </Card>

            <Card
              glass
              className={socInView ? 'about-society-card animate-slide-up delay-4' : 'about-society-card'}
              style={{ padding: 'var(--space-6)' }}
            >
              <div className="society-icon-box" style={{ width: 'fit-content' }}>
                <Palette size={24} color="var(--primary)" style={{ marginBottom: '12px' }} />
              </div>
              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: '800', marginBottom: '6px' }}>
                Fine Arts & Literature Clubs
              </h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Poetry symposiums, parliamentary debating societies, creative writing groups, and canvas painting
                exhibitions.
              </p>
            </Card>

            <Card
              glass
              className={socInView ? 'about-society-card animate-slide-up delay-5' : 'about-society-card'}
              style={{ padding: 'var(--space-6)' }}
            >
              <div className="society-icon-box" style={{ width: 'fit-content' }}>
                <Trophy size={24} color="var(--success)" style={{ marginBottom: '12px' }} />
              </div>
              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: '800', marginBottom: '6px' }}>
                Sports & Athletics Leagues
              </h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Student committees managing intramural matches, university teams, fitness bootcamps, and annual athletic
                meets.
              </p>
            </Card>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 4: CAMPUS PHOTOGRAPHY SHOWCASE STRIP                              */}
        {/* ========================================================================= */}
        <div ref={photoRef} style={{ marginBottom: 'var(--space-16)' }}>
          <div
            className={photoInView ? 'animate-slide-up' : ''}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-6)',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={16} color="var(--primary)" />
                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: '800', margin: 0 }}>
                  Campus Memories Preview
                </h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', marginTop: '4px', margin: 0 }}>
                Visual moments from student fests, concerts, and society gatherings.
              </p>
            </div>

            <Link to="/gallery">
              <Button variant="secondary" size="sm">
                Open Full Gallery <ArrowRight size={13} style={{ marginLeft: '6px' }} />
              </Button>
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-4)',
            }}
          >
            <div
              className={photoInView ? 'gallery-photo-card animate-slide-up delay-1' : 'gallery-photo-card'}
              style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '170px' }}
            >
              <img
                src="/uploads/gallery/defaults/campus_beats_music_fest.jpg"
                alt="Music Fest"
                className="gallery-card-img"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div
              className={photoInView ? 'gallery-photo-card animate-slide-up delay-2' : 'gallery-photo-card'}
              style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '170px' }}
            >
              <img
                src="/uploads/gallery/defaults/ethnic_runway_showcase.jpg"
                alt="Ethnic Runway"
                className="gallery-card-img"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div
              className={photoInView ? 'gallery-photo-card animate-slide-up delay-3' : 'gallery-photo-card'}
              style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '170px' }}
            >
              <img
                src="/uploads/gallery/defaults/expressions_art_exhibition.jpg"
                alt="Art Exhibition"
                className="gallery-card-img"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div
              className={photoInView ? 'gallery-photo-card animate-slide-up delay-4' : 'gallery-photo-card'}
              style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '170px' }}
            >
              <img
                src="/uploads/gallery/defaults/utsav_spring_lantern_night.jpg"
                alt="Campus Celebration"
                className="gallery-card-img"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              padding: '8px 14px',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <Info size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <span>
              Sample Campus Photography Notice: The preview photographs above represent student festival life using
              free-to-use photography with original author credits. They illustrate GATHERLY’s visual archiving capabilities.
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 5: PLATFORM FOUNDATION & CORE PILLARS                              */}
        {/* ========================================================================= */}
        <div ref={archRef} style={{ marginBottom: 'var(--space-16)' }}>
          <div
            className={archInView ? 'animate-slide-up' : ''}
            style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}
          >
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: '800', letterSpacing: '-0.02em' }}>
              Engineering & Architecture Pillars
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: '6px' }}>
              Built with industry-standard practices, security-first authentication, and accessibility compliance.
            </p>
          </div>

          {/* Academic Mission Card */}
          <div className={archInView ? 'animate-slide-up delay-1' : ''}>
            <Card glass style={{ padding: 'var(--space-8)', marginBottom: 'var(--space-6)' }}>
              <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={20} color="var(--primary)" /> Academic Mission & Problem Statement
              </h3>
              <p style={{ lineHeight: 1.7, marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                Campus life moves fast. Student societies host dozens of hackathons, cultural concerts, and debates every
                semester, yet students routinely miss registration deadlines due to scattered social media notices. GATHERLY
                provides a central stage with real-time discovery, verified registrations, atomic capacity management, and
                digital passes.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <Badge variant="primary">Full-Stack React + Express</Badge>
                <Badge variant="secondary">MongoDB Persistence</Badge>
                <Badge variant="default">WCAG AA Contrast</Badge>
                <Badge variant="success">Role-Based Access Control</Badge>
              </div>
            </Card>
          </div>

          {/* Core Pillars Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 'var(--space-6)',
            }}
          >
            <Card
              glass
              className={archInView ? 'about-society-card animate-slide-up delay-2' : 'about-society-card'}
              style={{ padding: 'var(--space-6)' }}
            >
              <div className="society-icon-box" style={{ width: 'fit-content' }}>
                <ShieldCheck size={24} color="var(--primary)" style={{ marginBottom: '10px' }} />
              </div>
              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: '800', marginBottom: '6px' }}>
                Verified Registrations
              </h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Atomic MongoDB concurrency controls preventing overbooking, duplicate passes, and unauthorized admissions.
              </p>
            </Card>

            <Card
              glass
              className={archInView ? 'about-society-card animate-slide-up delay-3' : 'about-society-card'}
              style={{ padding: 'var(--space-6)' }}
            >
              <div className="society-icon-box" style={{ width: 'fit-content' }}>
                <Users size={24} color="var(--accent-secondary)" style={{ marginBottom: '10px' }} />
              </div>
              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: '800', marginBottom: '6px' }}>
                Student Society Hub
              </h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Self-service proposal submission, administrative review pipelines, and organizer capacity analytics.
              </p>
            </Card>

            <Card
              glass
              className={archInView ? 'about-society-card animate-slide-up delay-4' : 'about-society-card'}
              style={{ padding: 'var(--space-6)' }}
            >
              <div className="society-icon-box" style={{ width: 'fit-content' }}>
                <BookOpen size={24} color="var(--highlight)" style={{ marginBottom: '10px' }} />
              </div>
              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: '800', marginBottom: '6px' }}>
                Independent Design System
              </h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Custom visual identity pairing Peach/Emerald/Turquoise light theme with Midnight Black/Antique Gold dark theme.
              </p>
            </Card>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 6: MEET THE CREATOR                                               */}
        {/* ========================================================================= */}
        <div ref={creatorRef} style={{ marginTop: 'var(--space-16)' }}>
          <div
            className={creatorInView ? 'animate-slide-up' : ''}
            style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}
          >
            <div className="editorial-eyebrow" style={{ justifyContent: 'center' }}>
              <Award size={14} />
              <span>Project Leadership</span>
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', fontWeight: '900', letterSpacing: '-0.02em' }}>
              Meet the Creator
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: '4px' }}>
              The engineering vision, development journey, and student inspiration behind GATHERLY.
            </p>
          </div>

          <div className={creatorInView ? 'animate-scale-fade-in delay-1' : ''}>
            <Card
              glass
              style={{
                maxWidth: '860px',
                margin: '0 auto',
                padding: 'clamp(24px, 4vw, 40px)',
                borderRadius: 'var(--radius-2xl)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-lg)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.boxShadow = '0 20px 48px rgba(var(--primary-rgb), 0.16), var(--shadow-xl)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: 'clamp(20px, 4vw, 36px)',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                {/* Creator Photo / Elegant Avatar Placeholder */}
                <div style={{ flexShrink: 0, margin: '0 auto' }}>
                  {CREATOR_PHOTO_URL ? (
                    <img
                      src={CREATOR_PHOTO_URL}
                      alt="Ayushi Kesarwani — Creator of GATHERLY"
                      style={{
                        width: '140px',
                        height: '140px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '3px solid var(--primary)',
                        boxShadow: '0 8px 24px rgba(var(--primary-rgb), 0.25)',
                      }}
                    />
                  ) : (
                    <div
                      className="animate-avatar-ring"
                      style={{
                        width: '140px',
                        height: '140px',
                        borderRadius: '50%',
                        background:
                          'radial-gradient(circle at 35% 35%, rgba(var(--primary-rgb), 0.35), var(--bg-secondary) 75%)',
                        border: '2.5px solid var(--primary)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        transition: 'transform 0.3s ease',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontWeight: '900',
                          fontSize: '2.6rem',
                          letterSpacing: '-0.04em',
                          color: 'var(--primary)',
                          lineHeight: 1,
                        }}
                      >
                        AK
                      </span>
                      <span
                        style={{
                          fontSize: '0.62rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          color: 'var(--text-muted)',
                          fontWeight: '700',
                          marginTop: '4px',
                        }}
                      >
                        Creator
                      </span>
                    </div>
                  )}
                </div>

                {/* Creator Details & Perspective */}
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                    <h3
                      style={{
                        fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                        fontWeight: '900',
                        letterSpacing: '-0.02em',
                        margin: 0,
                      }}
                    >
                      Ayushi Kesarwani
                    </h3>
                    <Badge variant="primary">Creator & Developer</Badge>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-secondary)',
                      marginBottom: 'var(--space-4)',
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <GraduationCap size={14} color="var(--primary)" /> B.Tech Computer Science Engineering
                    </span>
                    <span>•</span>
                    <span>3rd Year</span>
                    <span>•</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={13} color="var(--primary)" /> Kalinga Institute of Industrial Technology
                    </span>
                  </div>

                  {/* Creator Quote */}
                  <div
                    style={{
                      position: 'relative',
                      padding: '16px 20px',
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-subtle)',
                      marginBottom: 'var(--space-4)',
                    }}
                  >
                    <p
                      style={{
                        fontStyle: 'italic',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-primary)',
                        lineHeight: 1.6,
                        margin: 0,
                        fontWeight: '500',
                      }}
                    >
                      “I wanted to build a platform that brings campus events, student communities and memorable experiences
                      together in one place.”
                    </p>
                  </div>

                  <p
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    GATHERLY was envisioned and architected as a complete semester capstone to solve the real-world fragmentation of
                    university notifications. By uniting real-time discovery, atomic MongoDB registration integrity, digital QR pass
                    generation, gatekeeper scanner verification, and community memories in a cohesive full-stack interface, the platform
                    empowers student organizers and attendees alike.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
