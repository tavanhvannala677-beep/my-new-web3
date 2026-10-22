import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { QrCode, CheckCircle2, Globe, ArrowRight, Printer, Share2, Sparkles, AlertCircle, RefreshCw, MapPin, Navigation } from 'lucide-react';
import L from 'leaflet';
import { registerBatchToBackend, RegisterBatchPayload, BACKEND_BASE_URL } from '../services/backendApi';

export function QuickRegister() {
  const navigate = useNavigate();

  // Form State
  const [destination, setDestination] = useState<'EU' | 'China'>('EU');
  const [batchId, setBatchId] = useState<string>(() => 'BATCH-LAO-' + Math.floor(100 + Math.random() * 900));
  const [productName, setProductName] = useState<string>('ກາເຟອາຣາບິກາ (Arabica Coffee)');
  const [farmLocation, setFarmLocation] = useState<string>('15.1764, 106.2341 (Paksong Highland, Champasak)');
  const [ownerWallet, setOwnerWallet] = useState<string>('ສົມສັກ ພອນສະຫວັນ (Somsack Phonsavanh)');

  // Map state
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [currentCoords, setCurrentCoords] = useState<[number, number]>([15.1764, 106.2341]); // Paksong Bolaven Plateau

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [registeredBatch, setRegisteredBatch] = useState<RegisterBatchPayload | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: currentCoords,
        zoom: 14,
        attributionControl: false
      });

      // Esri Satellite Layer
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19
      }).addTo(map);

      // Boundaries & Labels overlay
      L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19
      }).addTo(map);

      // Initial Marker
      const marker = L.marker(currentCoords, { draggable: true }).addTo(map);
      marker.bindPopup('<b>ແປງປູກກາເຟ (Coffee Farm Plot)</b><br/>ລາກໝຸດເພື່ອປັບພິກັດ').openPopup();

      marker.on('dragend', () => {
        const latlng = marker.getLatLng();
        const newCoords: [number, number] = [Number(latlng.lat.toFixed(4)), Number(latlng.lng.toFixed(4))];
        setCurrentCoords(newCoords);
        setFarmLocation(`${newCoords[0]}, ${newCoords[1]} (Paksong, Champasak)`);
      });

      // Map Click to move marker
      map.on('click', (e: L.LeafletMouseEvent) => {
        const newCoords: [number, number] = [Number(e.latlng.lat.toFixed(4)), Number(e.latlng.lng.toFixed(4))];
        marker.setLatLng(e.latlng);
        setCurrentCoords(newCoords);
        setFarmLocation(`${newCoords[0]}, ${newCoords[1]} (Paksong Highland)`);
      });

      markerRef.current = marker;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Quick preset farm locations
  const handleSelectPreset = (lat: number, lng: number, name: string) => {
    setCurrentCoords([lat, lng]);
    setFarmLocation(`${lat}, ${lng} (${name})`);
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([lat, lng], 15);
      markerRef.current.setLatLng([lat, lng]);
      markerRef.current.bindPopup(`<b>${name}</b>`).openPopup();
    }
  };

  const handleRegenerateId = () => {
    setBatchId('BATCH-LAO-' + Math.floor(100 + Math.random() * 900));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const farmLocationWithDest = `${farmLocation} [Destination: ${destination}]`;
    const payload: RegisterBatchPayload = {
      batch_id: batchId.trim(),
      product_name: productName.trim(),
      farm_location: farmLocationWithDest,
      owner: ownerWallet.trim()
    };

    const result = await registerBatchToBackend(payload);
    setIsSubmitting(false);

    if (result.success) {
      setRegisteredBatch(payload);
      setIsBackendConnected(result.isBackendConnected);
    } else {
      setErrorMessage(result.error || 'Failed to register batch');
    }
  };

  // QR Code URL for Tracking Page
  const trackingUrl = registeredBatch
    ? `${window.location.origin}/#/track/${encodeURIComponent(registeredBatch.batch_id)}`
    : '';

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', padding: '10px 0 40px 0' }}>

      {/* Top Banner & Go Backend Info */}
      <div style={{
        background: '#ffffff',
        border: '1.5px solid #d5dfce',
        borderRadius: '8px',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>👨‍🌾</span>
            <h1 style={{ fontSize: '18px', fontWeight: 900, color: '#153826', margin: 0 }}>
              1. ໜ້າຊາວກະສິກອນ (Farmer Portal) — ລົງທະບຽນລັອດສິນຄ້າຕົ້ນນ້ຳ
            </h1>
          </div>
          <p style={{ fontSize: '12.5px', color: '#4d6052', margin: '4px 0 0 0' }}>
            Identity Preserved Traceability • API: <code style={{ background: '#eaf1e5', padding: '2px 6px', borderRadius: '4px', color: '#153826', fontWeight: 700 }}>POST {BACKEND_BASE_URL}/batch/register</code>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#eaf1e5',
            color: '#153826',
            padding: '4px 10px',
            borderRadius: '6px',
            fontWeight: 800
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }}></span>
            Go Backend (4001)
          </span>
          <Link
            to="/merge"
            style={{
              color: '#153826',
              textDecoration: 'none',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 12px',
              background: '#ffffff',
              border: '1px solid #d5dfce',
              borderRadius: '6px'
            }}
          >
            <span>ໄປໜ້າໂຮງງານລວມລັອດ</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: registeredBatch ? '1fr 1fr' : '1.1fr 0.9fr', gap: '20px' }}>

        {/* Left Column: Registration Form */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #d5dfce',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#142a1d', margin: '0 0 16px 0', borderBottom: '1px solid #edf2e7', paddingBottom: '10px' }}>
            ຟອມລົງທະບຽນສິນຄ້າ (Identity Preserved)
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Destination Toggle */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#153826', marginBottom: '8px' }}>
                ປາຍທາງການສົ່ງອອກ (Export Destination): <span style={{ color: '#b45309' }}>*</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setDestination('EU')}
                  style={{
                    padding: '12px',
                    borderRadius: '6px',
                    border: destination === 'EU' ? '2px solid #153826' : '1px solid #d5dfce',
                    background: destination === 'EU' ? '#eaf1e5' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 800, fontSize: '13px', color: '#153826' }}>🇪🇺 ສະຫະພາບເອີຣົບ (EU)</span>
                    {destination === 'EU' && <CheckCircle2 size={16} color="#153826" />}
                  </div>
                  <span style={{ fontSize: '11px', color: '#4d6052', display: 'block', marginTop: '2px' }}>ກວດສອບ EUDR ບໍ່ຕັດໄມ້ທຳລາຍປ່າ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDestination('China')}
                  style={{
                    padding: '12px',
                    borderRadius: '6px',
                    border: destination === 'China' ? '2px solid #153826' : '1px solid #d5dfce',
                    background: destination === 'China' ? '#eaf1e5' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 800, fontSize: '13px', color: '#153826' }}>🇨🇳 ສປ ຈີນ (China)</span>
                    {destination === 'China' && <CheckCircle2 size={16} color="#153826" />}
                  </div>
                  <span style={{ fontSize: '11px', color: '#4d6052', display: 'block', marginTop: '2px' }}>AI OCR ໃບສຸຂານາໄມພືດແປພາສາຈີນ</span>
                </button>
              </div>
            </div>

            {/* Batch ID */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#142a1d' }}>
                  ລະຫັດລັອດສິນຄ້າ (batch_id): <span style={{ color: '#b45309' }}>*</span>
                </label>
                <button
                  type="button"
                  onClick={handleRegenerateId}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#153826',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 700
                  }}
                >
                  <RefreshCw size={11} />
                  <span>ສຸ່ມລະຫັດ</span>
                </button>
              </div>
              <input
                type="text"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1.5px solid #d5dfce',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  color: '#153826',
                  letterSpacing: '0.3px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Product Name */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#142a1d', marginBottom: '6px' }}>
                ຊື່ສິນຄ້າ (product_name): <span style={{ color: '#b45309' }}>*</span>
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1.5px solid #d5dfce',
                  fontSize: '13px',
                  color: '#142a1d',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Farm Location Input (Synched with Map) */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#142a1d', marginBottom: '6px' }}>
                ພິກັດແປງປູກ (farm_location): <span style={{ color: '#b45309' }}>*</span>
              </label>
              <input
                type="text"
                value={farmLocation}
                onChange={(e) => setFarmLocation(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1.5px solid #d5dfce',
                  fontSize: '12px',
                  color: '#142a1d',
                  fontWeight: 700,
                  boxSizing: 'border-box'
                }}
              />
              <span style={{ fontSize: '11px', color: '#708375', marginTop: '4px', display: 'block' }}>
                💡 ສາມາດຄລິກເລືອກຈຸດ ຫຼື ລາກໝຸດບົນແຜນທີ່ດາວທຽມດ້ານຂວາເພື່ອປັບພິກັດ
              </span>
            </div>

            {/* Owner */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#142a1d', marginBottom: '6px' }}>
                ຊື່ຊາວກະສິກອນ / ເຈົ້າຂອງແປງ (owner): <span style={{ color: '#b45309' }}>*</span>
              </label>
              <input
                type="text"
                value={ownerWallet}
                onChange={(e) => setOwnerWallet(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1.5px solid #d5dfce',
                  fontSize: '12.5px',
                  color: '#142a1d',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {errorMessage && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '10px', borderRadius: '6px', color: '#991b1b', fontSize: '12px' }}>
                {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                marginTop: '8px',
                padding: '12px 20px',
                background: '#153826',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 800,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 2px 6px rgba(21, 56, 38, 0.2)'
              }}
            >
              {isSubmitting ? (
                <span>ກຳລັງບັນທຶກເຂົ້າ Go Backend...</span>
              ) : (
                <>
                  <QrCode size={18} />
                  <span>ບັນທຶກສິນຄ້າ & ສ້າງ QR Code</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Satellite Map & QR Result */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Interactive Satellite Map Component (MANDATORY in brief) */}
          <div style={{
            background: '#ffffff',
            border: '1.5px solid #d5dfce',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} color="#153826" />
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#153826', margin: 0 }}>
                  ແຜນທີ່ດາວທຽມປັກໝຸດແປງປູກ (GIS Satellite Map)
                </h3>
              </div>
              <span style={{ fontSize: '11px', color: '#15803d', fontWeight: 700 }}>
                ● Esri World Imagery
              </span>
            </div>

            {/* Map Container */}
            <div
              ref={mapContainerRef}
              style={{
                width: '100%',
                height: registeredBatch ? '200px' : '260px',
                borderRadius: '6px',
                overflow: 'hidden',
                border: '1px solid #cbd5e1'
              }}
            />

            {/* Preset Buttons */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', color: '#4d6052', alignSelf: 'center', fontWeight: 700 }}>ຕົວຢ່າງແປງ:</span>
              <button
                type="button"
                onClick={() => handleSelectPreset(15.1764, 106.2341, 'Paksong Highland Plot A')}
                style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '4px', border: '1px solid #d5dfce', background: '#f8fafc', cursor: 'pointer' }}
              >
                ☕ ປາກຊ່ອງ (ຈຳປາສັກ)
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset(19.8921, 102.1342, 'Luang Prabang Arabica Farm')}
                style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '4px', border: '1px solid #d5dfce', background: '#f8fafc', cursor: 'pointer' }}
              >
                🌿 ຫຼວງພະບາງ
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset(15.1123, 106.3145, 'Bolaven Plateau Special Plot')}
                style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '4px', border: '1px solid #d5dfce', background: '#f8fafc', cursor: 'pointer' }}
              >
                ⛰️ ພູພຽງບໍລະເວນ
              </button>
            </div>
          </div>

          {/* QR Code Result Box (When Submitted) */}
          {registeredBatch && (
            <div style={{
              background: '#ffffff',
              border: '2px solid #153826',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 4px 16px rgba(21, 56, 38, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#dcfce7',
                color: '#15803d',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 800,
                marginBottom: '10px'
              }}>
                <CheckCircle2 size={14} />
                <span>ສ້າງ QR Code ສຳເລັດ!</span>
              </div>

              <div style={{ fontSize: '18px', fontWeight: 900, color: '#153826', letterSpacing: '0.5px' }}>
                {registeredBatch.batch_id}
              </div>
              <div style={{ fontSize: '12px', color: '#4d6052', marginBottom: '12px' }}>
                {registeredBatch.product_name}
              </div>

              {/* QR Image Box */}
              <div style={{
                background: '#ffffff',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #153826',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                marginBottom: '12px'
              }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(trackingUrl)}`}
                  alt="Product Batch QR"
                  style={{ width: '180px', height: '180px', display: 'block' }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', width: '100%', marginBottom: '10px' }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: '#edf2e7',
                    color: '#153826',
                    border: '1px solid #d5dfce',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '11.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <Printer size={13} />
                  <span>ພິມ QR ຕິດກ່ອງ</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(trackingUrl);
                    alert('ຄັດລອກລິ້ງແລ້ວ!');
                  }}
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: '#edf2e7',
                    color: '#153826',
                    border: '1px solid #d5dfce',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '11.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <Share2 size={13} />
                  <span>ຄັດລອກລິ້ງ</span>
                </button>
              </div>

              <Link
                to={`/track/${encodeURIComponent(registeredBatch.batch_id)}`}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '10px 14px',
                  background: '#153826',
                  color: '#ffffff',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: 800,
                  fontSize: '12.5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span>ເປີດໜ້າກວດສອບ (Track & Trace)</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
