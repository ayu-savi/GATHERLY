import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  Upload,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Image,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { galleryService } from '../../services/galleryService';

export const AdminGalleryPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeCollection, setActiveCollection] = useState(null);
  const [loadingActive, setLoadingActive] = useState(true);

  // Staged Photos for the New Collection to be published
  const [collectionTitle, setCollectionTitle] = useState('');
  const [collectionDesc, setCollectionDesc] = useState('');
  const [isDemoCollection, setIsDemoCollection] = useState(false);
  const [stagedPhotos, setStagedPhotos] = useState([]);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Publishing state
  const [publishing, setPublishing] = useState(false);
  const [publishConfirmOpen, setPublishConfirmOpen] = useState(false);
  const [actionError, setActionError] = useState('');

  // Fetch current active collection
  const loadActiveGallery = async () => {
    try {
      setLoadingActive(true);
      const data = await galleryService.getActiveGallery();
      setActiveCollection(data);
    } catch (err) {
      console.warn('Failed to load active gallery for admin:', err.message);
    } finally {
      setLoadingActive(false);
    }
  };

  useEffect(() => {
    loadActiveGallery();
  }, []);

  // Handle file upload
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    setUploadError('');

    try {
      for (const file of files) {
        // Basic frontend validation
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`File ${file.name} exceeds 10MB limit.`);
        }

        const res = await galleryService.uploadPhoto(file);
        if (res.success && res.data) {
          const newPhoto = {
            id: `staged_${Date.now()}_${Math.random()}`,
            filename: res.data.filename,
            photoPath: res.data.photoPath,
            eventName: file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
            eventDate: new Date().toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            }),
            photographerCredit: 'Campus Life Society',
            isSocietyAttribution: false,
            isFeatured: stagedPhotos.length === 0,
            caption: '',
          };
          setStagedPhotos((prev) => [...prev, newPhoto]);
        }
      }
      showToast({
        title: 'Upload Successful',
        message: `${files.length} photograph(s) staged successfully. Fill in event metadata before publishing.`,
        type: 'success',
      });
    } catch (err) {
      setUploadError(err.message || 'Error uploading photograph(s).');
      showToast({
        title: 'Upload Failed',
        message: err.message || 'Failed to upload photo.',
        type: 'error',
      });
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  // Remove staged photograph
  const handleRemoveStagedPhoto = async (photoId, filename) => {
    try {
      if (filename) {
        await galleryService.deleteStagedPhoto(filename);
      }
    } catch (err) {
      console.warn('Could not remove file on server:', err.message);
    }
    setStagedPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  // Update staged photograph field
  const handleUpdateStagedField = (photoId, field, value) => {
    setStagedPhotos((prev) =>
      prev.map((p) => {
        if (p.id === photoId) {
          return { ...p, [field]: value };
        }
        // If updating isFeatured, unfeature others
        if (field === 'isFeatured' && value === true) {
          return { ...p, isFeatured: false };
        }
        return p;
      })
    );
  };

  // Publish new collection (atomic replacement)
  const handlePublishCollection = async () => {
    if (!stagedPhotos.length) {
      setActionError('Cannot publish an empty collection. Stage at least one photograph.');
      return;
    }

    // Validation
    for (let i = 0; i < stagedPhotos.length; i++) {
      const p = stagedPhotos[i];
      if (!p.eventName.trim()) {
        setActionError(`Photograph #${i + 1} requires an Event Name.`);
        return;
      }
      if (!p.eventDate.trim()) {
        setActionError(`Photograph #${i + 1} requires an Event Date.`);
        return;
      }
    }

    setPublishing(true);
    setActionError('');

    try {
      const payload = {
        title: collectionTitle.trim() || 'Campus Event Highlights',
        description: collectionDesc.trim(),
        isDemo: isDemoCollection,
        photographs: stagedPhotos.map((p) => ({
          photoPath: p.photoPath,
          filename: p.filename,
          eventName: p.eventName.trim(),
          eventDate: p.eventDate.trim(),
          photographerCredit: p.photographerCredit.trim(),
          isSocietyAttribution: p.isSocietyAttribution,
          isFeatured: p.isFeatured,
          caption: p.caption.trim(),
        })),
      };

      const res = await galleryService.publishGallery(payload);
      if (res.success) {
        showToast({
          title: 'Collection Activated',
          message: 'The new campus memories gallery was successfully published and is now live.',
          type: 'success',
        });
        setActiveCollection(res.data);
        setStagedPhotos([]);
        setCollectionTitle('');
        setCollectionDesc('');
        setPublishConfirmOpen(false);
      }
    } catch (err) {
      setActionError(
        err.message ||
          'Publication failed. The previous active gallery collection remains active and safe.'
      );
      showToast({
        title: 'Publication Error',
        message: err.message || 'Publication failed.',
        type: 'error',
      });
    } finally {
      setPublishing(false);
    }
  };

  // Restrict access if not admin
  if (user && user.role !== 'admin') {
    return (
      <div style={{ padding: 'var(--space-12) 0' }}>
        <div className="container-narrow">
          <Card glass style={{ padding: 'var(--space-10)', textAlign: 'center' }}>
            <ShieldAlert size={48} color="var(--danger)" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: '8px' }}>Administrative Access Required</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
              The campus memories management interface is restricted strictly to authorized administrators.
            </p>
            <Link to="/gallery">
              <Button variant="primary">Return to Public Gallery</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-10) 0 var(--space-20)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <div className="editorial-eyebrow">
            <Camera size={14} />
            <span>Administrative Controls</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: '900', letterSpacing: '-0.02em' }}>
                Campus Memories Management
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: '4px' }}>
                Upload, configure, and atomically replace the active university event photography gallery.
              </p>
            </div>

            <Link to="/gallery">
              <Button variant="secondary" size="sm">
                <ExternalLink size={13} style={{ marginRight: '6px' }} /> View Live Gallery
              </Button>
            </Link>
          </div>
        </div>

        {/* Current Active Collection Status Card */}
        <Card
          glass
          style={{
            padding: 'var(--space-6)',
            marginBottom: 'var(--space-8)',
            borderLeft: '4px solid var(--primary)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    fontWeight: '800',
                    color: 'var(--primary)',
                  }}
                >
                  Current Active Public Gallery
                </span>
                {activeCollection?.isDemo && <Badge variant="secondary">Demo Showcase</Badge>}
                <Badge variant="success">Active Live</Badge>
              </div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '800', margin: 0 }}>
                {activeCollection?.title || 'Campus Memories Collection'}
              </h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
                {activeCollection?.photographs?.length || 0} photograph(s) published • Activated on{' '}
                {activeCollection?.publishedAt
                  ? new Date(activeCollection.publishedAt).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>

            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', maxWidth: '320px', textAlign: 'right' }}>
              Publishing a new collection replaces the active collection above as a single atomic operation.
            </div>
          </div>
        </Card>

        {/* Staging & Upload Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-8)' }}>
          {/* Left Column: Upload & Settings */}
          <div>
            <Card glass style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '800', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Upload size={16} color="var(--primary)" /> 1. Upload Event Photographs
              </h3>

              <div
                style={{
                  border: '2px dashed var(--border-subtle)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-8) var(--space-4)',
                  textAlign: 'center',
                  background: 'var(--bg-secondary)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'border-color var(--transition-fast)',
                }}
              >
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0,
                    cursor: 'pointer',
                    width: '100%',
                    height: '100%',
                  }}
                />
                <Camera size={32} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: '700', marginBottom: '4px' }}>
                  {uploading ? 'Uploading Photographs to Server...' : 'Click or Drag & Drop Photos Here'}
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0 }}>
                  Supports JPEG, PNG, and WebP (up to 10MB per photograph)
                </p>
              </div>

              {uploadError && (
                <div style={{ marginTop: '12px', color: 'var(--danger)', fontSize: 'var(--text-xs)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={14} /> {uploadError}
                </div>
              )}
            </Card>

            <Card glass style={{ padding: 'var(--space-6)' }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '800', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={16} color="var(--primary)" /> 2. Collection Details
              </h3>

              <Input
                label="Collection Title"
                placeholder="e.g. Spring Fest 2026 Campus Retrospective"
                value={collectionTitle}
                onChange={(e) => setCollectionTitle(e.target.value)}
                required
              />

              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Collection Description
                </label>
                <textarea
                  placeholder="Provide context or summary for this set of event photographs..."
                  value={collectionDesc}
                  onChange={(e) => setCollectionDesc(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--text-sm)',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-6)' }}>
                <input
                  type="checkbox"
                  id="isDemoCheckbox"
                  checked={isDemoCollection}
                  onChange={(e) => setIsDemoCollection(e.target.checked)}
                  style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
                <label htmlFor="isDemoCheckbox" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  Label as Sample/Demo Collection
                </label>
              </div>

              {actionError && (
                <div style={{ marginBottom: '16px', padding: '10px', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', fontSize: 'var(--text-xs)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={16} /> {actionError}
                </div>
              )}

              <Button
                variant="primary"
                onClick={() => setPublishConfirmOpen(true)}
                disabled={stagedPhotos.length === 0 || publishing}
                style={{ width: '100%' }}
              >
                {publishing ? 'Publishing & Activating...' : `Publish Collection (${stagedPhotos.length} Photos)`}
              </Button>
            </Card>
          </div>

          {/* Right Column: Staged Photos Editor */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '800' }}>
                Staged Photographs ({stagedPhotos.length})
              </h3>
              {stagedPhotos.length > 0 && (
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                  Configure metadata for each photo below
                </span>
              )}
            </div>

            {stagedPhotos.length === 0 ? (
              <Card glass style={{ padding: 'var(--space-10)', textAlign: 'center' }}>
                <Image size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: '700', marginBottom: '4px' }}>
                  No Photographs Staged Yet
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0 }}>
                  Upload photographs in step 1 to configure event details, photographer credits, and featured image.
                </p>
              </Card>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {stagedPhotos.map((photo, idx) => (
                  <Card key={photo.id} glass style={{ padding: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      {/* Thumbnail Preview */}
                      <div
                        style={{
                          width: '120px',
                          height: '90px',
                          borderRadius: 'var(--radius-md)',
                          overflow: 'hidden',
                          background: 'var(--bg-secondary)',
                          flexShrink: 0,
                          position: 'relative',
                        }}
                      >
                        <img
                          src={photo.photoPath}
                          alt={photo.eventName}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {photo.isFeatured && (
                          <div style={{ position: 'absolute', top: '4px', left: '4px' }}>
                            <Badge variant="primary">Featured</Badge>
                          </div>
                        )}
                      </div>

                      {/* Photo Inputs */}
                      <div style={{ flex: 1, minWidth: '220px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--primary)' }}>
                            Photograph #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveStagedPhoto(photo.id, photo.filename)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--danger)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.75rem',
                            }}
                          >
                            <Trash2 size={13} /> Remove
                          </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', marginBottom: '8px' }}>
                          <input
                            type="text"
                            placeholder="Event Name *"
                            value={photo.eventName}
                            onChange={(e) => handleUpdateStagedField(photo.id, 'eventName', e.target.value)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: 'var(--radius-sm)',
                              background: 'var(--bg-secondary)',
                              border: '1px solid var(--border-subtle)',
                              color: 'var(--text-primary)',
                              fontSize: 'var(--text-xs)',
                            }}
                          />
                          <input
                            type="text"
                            placeholder="Event Date *"
                            value={photo.eventDate}
                            onChange={(e) => handleUpdateStagedField(photo.id, 'eventDate', e.target.value)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: 'var(--radius-sm)',
                              background: 'var(--bg-secondary)',
                              border: '1px solid var(--border-subtle)',
                              color: 'var(--text-primary)',
                              fontSize: 'var(--text-xs)',
                            }}
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', marginBottom: '8px' }}>
                          <input
                            type="text"
                            placeholder="Photographer Credit"
                            value={photo.photographerCredit}
                            onChange={(e) => handleUpdateStagedField(photo.id, 'photographerCredit', e.target.value)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: 'var(--radius-sm)',
                              background: 'var(--bg-secondary)',
                              border: '1px solid var(--border-subtle)',
                              color: 'var(--text-primary)',
                              fontSize: 'var(--text-xs)',
                            }}
                          />
                          <input
                            type="text"
                            placeholder="Short Caption (Optional)"
                            value={photo.caption}
                            onChange={(e) => handleUpdateStagedField(photo.id, 'caption', e.target.value)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: 'var(--radius-sm)',
                              background: 'var(--bg-secondary)',
                              border: '1px solid var(--border-subtle)',
                              color: 'var(--text-primary)',
                              fontSize: 'var(--text-xs)',
                            }}
                          />
                        </div>

                        {/* Attribution & Featured Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '0.75rem', marginTop: '4px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={photo.isSocietyAttribution}
                              onChange={(e) => handleUpdateStagedField(photo.id, 'isSocietyAttribution', e.target.checked)}
                              style={{ accentColor: 'var(--primary)' }}
                            />
                            Photography Society Attribution
                          </label>

                          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                            <input
                              type="radio"
                              name="featuredRadio"
                              checked={photo.isFeatured}
                              onChange={() => handleUpdateStagedField(photo.id, 'isFeatured', true)}
                              style={{ accentColor: 'var(--primary)' }}
                            />
                            Set as Featured Spotlight
                          </label>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {publishConfirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(5, 5, 5, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <Card glass style={{ maxWidth: '480px', width: '100%', padding: 'var(--space-8)' }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
              <Sparkles size={36} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '800', marginBottom: '8px' }}>
                Publish Campus Memories Collection?
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', lineHeight: 1.6, margin: 0 }}>
                This action will activate the {stagedPhotos.length} staged photograph(s) as the new public gallery.
                The previous collection will be atomically deactivated, and its uploaded files will be safely cleared.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setPublishConfirmOpen(false)} disabled={publishing}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handlePublishCollection} disabled={publishing}>
                {publishing ? 'Publishing...' : 'Confirm & Publish'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminGalleryPage;
